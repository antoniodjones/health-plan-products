/**
 * Database operations for Medical Codes
 * SIMPLIFIED - Direct Prisma queries only
 */
import { PrismaClient } from '@prisma/client';
import type { CodeSearchInput } from '@/lib/validations/code';
import type { CodeType } from '@/types/codes';

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Search codes - SIMPLIFIED
 */
export async function searchCodes(params: CodeSearchInput) {
  const {
    search,
    codeType,
    category,
    isActive,
    page = 1,
    pageSize = 20,
  } = params;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (codeType && codeType.length > 0) {
    where.codeType = { in: codeType };
  }

  if (category && category.length > 0) {
    where.category = { in: category };
  }

  if (typeof isActive === 'boolean') {
    where.isActive = isActive;
  }

  // Execute query
  const [codes, total] = await Promise.all([
    prisma.codeSet.findMany({
      where,
      orderBy: { code: 'asc' },
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
 * Get code statistics - SIMPLIFIED
 */
export async function getCodeStatistics() {
  const [totalCodes, activeCodes, inactiveCodes, byType] = await Promise.all([
    prisma.codeSet.count(),
    prisma.codeSet.count({ where: { isActive: true } }),
    prisma.codeSet.count({ where: { isActive: false } }),
    prisma.codeSet.groupBy({
      by: ['codeType'],
      _count: { codeType: true },
    }),
  ]);

  return {
    totalCodes,
    activeCodes,
    inactiveCodes,
    codeTypeCount: byType.length,
    byType: Object.fromEntries(
      byType.map((t) => [t.codeType, t._count.codeType])
    ),
  };
}

/**
 * Get single code by ID
 */
export async function getCodeById(id: string) {
  return prisma.codeSet.findUnique({
    where: { id },
  });
}

/**
 * Get distinct categories
 */
export async function getCategories() {
  const result = await prisma.codeSet.groupBy({
    by: ['category'],
    where: { category: { not: null } },
    _count: { category: true },
  });

  return result
    .filter((r) => r.category !== null)
    .map((r) => ({
      category: r.category!,
      count: r._count.category,
    }));
}
