/**
 * Database operations for Code-to-Benefit Mappings
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type { CodeMappingSearchParams } from '@/types/mappings';

// Prisma client singleton to prevent connection pool exhaustion in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Search and filter code mappings
 */
export async function searchMappings(params: CodeMappingSearchParams) {
  const {
    mappingType,
    status,
    codeType,
    benefitCategory,
    search,
    effectiveDateFrom,
    effectiveDateTo,
    page = 1,
    pageSize = 25,
    sortBy = 'effectiveDate',
    sortOrder = 'desc',
  } = params;

  // Build where clause
  const where: Prisma.CodeMappingWhereInput = {};

  if (mappingType && mappingType.length > 0) {
    where.mappingType = { in: mappingType as any[] };
  }

  if (status && status.length > 0) {
    where.status = { in: status as any[] };
  }

  if (codeType && codeType.length > 0) {
    where.codeSet = {
      codeType: { in: codeType as any[] },
    };
  }

  if (benefitCategory) {
    where.benefitSegment = {
      category: benefitCategory as any,
    };
  }

  if (search) {
    where.OR = [
      { codeSet: { code: { contains: search, mode: 'insensitive' } } },
      { codeSet: { description: { contains: search, mode: 'insensitive' } } },
      { benefitSegment: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Note: effectiveDate removed from schema, using createdAt instead
  if (effectiveDateFrom || effectiveDateTo) {
    where.createdAt = {};
    if (effectiveDateFrom) {
      where.createdAt.gte = effectiveDateFrom;
    }
    if (effectiveDateTo) {
      where.createdAt.lte = effectiveDateTo;
    }
  }

  // Execute query with pagination
  const [mappings, total] = await Promise.all([
    prisma.codeMapping.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        codeSet: {
          select: {
            id: true,
            code: true,
            codeType: true,
            description: true,
          },
        },
        benefitSegment: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    }),
    prisma.codeMapping.count({ where }),
  ]);

  return {
    mappings,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get a single mapping by ID
 */
export async function getMappingById(id: string) {
  return prisma.codeMapping.findUnique({
    where: { id },
    include: {
      codeSet: true,
      benefitSegment: true,
    },
  });
}

/**
 * Create a new mapping
 */
export async function createMapping(data: Prisma.CodeMappingCreateInput) {
  return prisma.codeMapping.create({
    data,
    include: {
      codeSet: true,
      benefitSegment: true,
    },
  });
}

/**
 * Create multiple mappings in bulk
 */
export async function bulkCreateMappings(mappings: Prisma.CodeMappingCreateInput[]) {
  return prisma.$transaction(
    mappings.map((mapping) =>
      prisma.codeMapping.create({
        data: mapping,
      })
    )
  );
}

/**
 * Update a mapping
 */
export async function updateMapping(id: string, data: Prisma.CodeMappingUpdateInput) {
  return prisma.codeMapping.update({
    where: { id },
    data,
    include: {
      codeSet: true,
      benefitSegment: true,
    },
  });
}

/**
 * Delete a mapping
 */
export async function deleteMapping(id: string) {
  return prisma.codeMapping.delete({
    where: { id },
  });
}

/**
 * Check for mapping conflicts
 */
export async function checkMappingConflicts(
  medicalCodeId: string,
  benefitId: string,
  effectiveDate: Date,
  expirationDate?: Date | null,
  excludeMappingId?: string
) {
  const where: Prisma.CodeMappingWhereInput = {
    medicalCodeId,
    benefitId,
    NOT: excludeMappingId ? { id: excludeMappingId } : undefined,
    OR: [
      // Check for date overlaps
      {
        AND: [
          { effectiveDate: { lte: effectiveDate } },
          {
            OR: [
              { expirationDate: null },
              { expirationDate: { gte: effectiveDate } },
            ],
          },
        ],
      },
      expirationDate
        ? {
            AND: [
              { effectiveDate: { lte: expirationDate } },
              {
                OR: [
                  { expirationDate: null },
                  { expirationDate: { gte: effectiveDate } },
                ],
              },
            ],
          }
        : {},
    ],
  };

  return prisma.codeMapping.findMany({
    where,
    include: {
      benefitSegment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Get mapping statistics
 */
export async function getMappingStatistics() {
  const [
    totalMappings,
    activeMappings,
    draftMappings,
    byType,
    recentlyCreated,
    totalCodes,
    mappedCodes,
  ] = await Promise.all([
    prisma.codeMapping.count(),
    prisma.codeMapping.count({ where: { isActive: true } }),
    prisma.codeMapping.count({ where: { isActive: false } }),
    prisma.codeMapping.groupBy({
      by: ['codeSetId'],
      _count: { codeSetId: true },
    }),
    prisma.codeMapping.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
    prisma.codeSet.count({ where: { isActive: true } }),
    prisma.codeSet.count({
      where: {
        isActive: true,
        mappings: {
          some: {},
        },
      },
    }),
  ]);

  return {
    totalMappings,
    activeMappings,
    draftMappings,
    byType: {},
    unmappedCodes: totalCodes - mappedCodes,
    recentlyCreated,
  };
}

/**
 * Get mappings for a specific code
 */
export async function getMappingsByCode(codeSetId: string) {
  return prisma.codeMapping.findMany({
    where: { codeSetId },
    include: {
      benefitSegment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get mappings for a specific benefit
 */
export async function getMappingsByBenefit(benefitSegmentId: string) {
  return prisma.codeMapping.findMany({
    where: { benefitSegmentId },
    include: {
      codeSet: true,
    },
    orderBy: { priority: 'desc' },
  });
}

