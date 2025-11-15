/**
 * Database operations for Medical Codes
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type { CodeSearchParams, MedicalCode } from '@/types/codes';

const prisma = new PrismaClient();

/**
 * Search and filter medical codes
 */
export async function searchCodes(params: CodeSearchParams) {
  const {
    codeType,
    status,
    source,
    category,
    search,
    effectiveDateFrom,
    effectiveDateTo,
    isCustom,
    page = 1,
    pageSize = 25,
    sortBy = 'code',
    sortOrder = 'asc',
  } = params;

  // Build where clause
  const where: Prisma.CodeSetWhereInput = {};

  if (codeType && codeType.length > 0) {
    where.codeType = { in: codeType };
  }

  if (status && status.length > 0) {
    where.status = { in: status };
  }

  if (source && source.length > 0) {
    where.source = { in: source };
  }

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { longDescription: { contains: search, mode: 'insensitive' } },
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

  if (typeof isCustom === 'boolean') {
    where.isCustom = isCustom;
  }

  // Execute query with pagination
  const [codes, total] = await Promise.all([
    prisma.codeSet.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.codeSet.count({ where }),
  ]);

  return {
    codes,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get a single medical code by ID
 */
export async function getCodeById(id: string) {
  return prisma.codeSet.findUnique({
    where: { id },
    include: {
      customCodePrefix: true,
    },
  });
}

/**
 * Get a medical code by code value and type
 */
export async function getCodeByValue(code: string, codeType: string) {
  return prisma.codeSet.findFirst({
    where: {
      code,
      codeType: codeType as any,
    },
  });
}

/**
 * Create a new medical code
 */
export async function createCode(data: Prisma.MedicalCodeCreateInput) {
  return prisma.codeSet.create({
    data,
  });
}

/**
 * Update a medical code
 */
export async function updateCode(id: string, data: Prisma.MedicalCodeUpdateInput) {
  return prisma.codeSet.update({
    where: { id },
    data,
  });
}

/**
 * Delete a medical code
 */
export async function deleteCode(id: string) {
  return prisma.codeSet.delete({
    where: { id },
  });
}

/**
 * Get code statistics
 */
export async function getCodeStatistics() {
  const [
    totalCodes,
    activeCount,
    inactiveCount,
    customCount,
    byType,
    bySource,
    recentlyAdded,
    recentlyUpdated,
  ] = await Promise.all([
    prisma.codeSet.count(),
    prisma.codeSet.count({ where: { status: 'ACTIVE' } }),
    prisma.codeSet.count({ where: { status: 'INACTIVE' } }),
    prisma.codeSet.count({ where: { isCustom: true } }),
    prisma.codeSet.groupBy({
      by: ['codeType'],
      _count: { codeType: true },
    }),
    prisma.codeSet.groupBy({
      by: ['source'],
      _count: { source: true },
    }),
    prisma.codeSet.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
    prisma.codeSet.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ]);

  return {
    totalCodes,
    activeCount,
    inactiveCount,
    customCount,
    byType: Object.fromEntries(byType.map((t) => [t.codeType, t._count.codeType])),
    bySource: Object.fromEntries(bySource.map((s) => [s.source, s._count.source])),
    recentlyAdded,
    recentlyUpdated,
  };
}

/**
 * Get all categories for a code type
 */
export async function getCodeCategories(codeType?: string) {
  const where = codeType ? { codeType: codeType as any } : {};

  const categories = await prisma.codeSet.groupBy({
    by: ['category'],
    where: {
      ...where,
      category: { not: null },
    },
    _count: { category: true },
  });

  return categories
    .filter((c) => c.category !== null)
    .map((c) => ({
      category: c.category!,
      count: c._count.category,
    }));
}

/**
 * Batch create medical codes
 */
export async function batchCreateCodes(codes: Prisma.MedicalCodeCreateInput[]) {
  return prisma.$transaction(
    codes.map((code) => prisma.codeSet.create({ data: code }))
  );
}

/**
 * Check if code exists
 */
export async function codeExists(code: string, codeType: string): Promise<boolean> {
  const count = await prisma.codeSet.count({
    where: {
      code,
      codeType: codeType as any,
    },
  });
  return count > 0;
}

