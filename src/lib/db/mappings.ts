/**
 * Database operations for Code-to-Benefit Mappings
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type { CodeMappingSearchParams } from '@/types/mappings';

const prisma = new PrismaClient();

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
    where.medicalCode = {
      codeType: { in: codeType as any[] },
    };
  }

  if (benefitCategory) {
    where.benefit = {
      category: benefitCategory,
    };
  }

  if (search) {
    where.OR = [
      { medicalCode: { code: { contains: search, mode: 'insensitive' } } },
      { medicalCode: { description: { contains: search, mode: 'insensitive' } } },
      { benefit: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (effectiveDateFrom || effectiveDateTo) {
    where.effectiveDate = {};
    if (effectiveDateFrom) {
      where.effectiveDate.gte = effectiveDateFrom;
    }
    if (effectiveDateTo) {
      where.effectiveDate.lte = effectiveDateTo;
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
        medicalCode: {
          select: {
            id: true,
            code: true,
            codeType: true,
            description: true,
          },
        },
        benefit: {
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
      medicalCode: true,
      benefit: true,
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
      medicalCode: true,
      benefit: true,
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
      medicalCode: true,
      benefit: true,
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
      benefit: {
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
    prisma.codeMapping.count({ where: { status: 'ACTIVE' } }),
    prisma.codeMapping.count({ where: { status: 'DRAFT' } }),
    prisma.codeMapping.groupBy({
      by: ['mappingType'],
      _count: { mappingType: true },
    }),
    prisma.codeMapping.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
    prisma.medicalCode.count(),
    prisma.medicalCode.count({
      where: {
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
    byType: Object.fromEntries(byType.map((t) => [t.mappingType, t._count.mappingType])),
    unmappedCodes: totalCodes - mappedCodes,
    recentlyCreated,
  };
}

/**
 * Get mappings for a specific code
 */
export async function getMappingsByCode(medicalCodeId: string) {
  return prisma.codeMapping.findMany({
    where: { medicalCodeId },
    include: {
      benefit: true,
    },
    orderBy: { effectiveDate: 'desc' },
  });
}

/**
 * Get mappings for a specific benefit
 */
export async function getMappingsByBenefit(benefitId: string) {
  return prisma.codeMapping.findMany({
    where: { benefitId },
    include: {
      medicalCode: true,
    },
    orderBy: { priority: 'desc' },
  });
}

