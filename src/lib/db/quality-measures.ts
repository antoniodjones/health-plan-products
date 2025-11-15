/**
 * Database operations for Quality Measures
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type {
  QualityMeasureSearchParams,
  QualityMeasure,
  QualityMeasureSearchResult,
  CreateQualityMeasureInput,
  UpdateQualityMeasureInput,
  QualityMeasureStatistics,
} from '@/types/quality-measures';

// Singleton pattern to prevent connection pool exhaustion
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Search and filter quality measures
 */
export async function searchQualityMeasures(
  params: QualityMeasureSearchParams
): Promise<QualityMeasureSearchResult> {
  const {
    program,
    domain,
    status,
    search,
    steward,
    effectiveYear,
    page = 1,
    pageSize = 25,
    sortBy = 'measureId',
    sortOrder = 'asc',
  } = params;

  // Build where clause
  const where: Prisma.QualityMeasureWhereInput = {};

  if (program && program.length > 0) {
    where.program = { in: program };
  }

  if (domain && domain.length > 0) {
    where.domain = { in: domain };
  }

  if (status && status.length > 0) {
    where.status = { in: status };
  }

  if (steward) {
    where.steward = { contains: steward, mode: 'insensitive' };
  }

  if (search) {
    where.OR = [
      { measureId: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (effectiveYear) {
    where.effectiveDate = {
      gte: new Date(`${effectiveYear}-01-01`),
      lt: new Date(`${effectiveYear + 1}-01-01`),
    };
  }

  // Execute query with pagination
  const [measures, total] = await Promise.all([
    prisma.qualityMeasure.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        measureLogic: {
          include: {
            valueSet: true,
          },
        },
        productMeasures: {
          select: {
            id: true,
            productId: true,
          },
        },
      },
    }),
    prisma.qualityMeasure.count({ where }),
  ]);

  return {
    measures: measures as any,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get a single quality measure by ID
 */
export async function getQualityMeasureById(id: string): Promise<QualityMeasure | null> {
  return prisma.qualityMeasure.findUnique({
    where: { id },
    include: {
      measureLogic: {
        include: {
          valueSet: {
            include: {
              codes: {
                include: {
                  codeSet: true,
                },
              },
            },
          },
        },
        orderBy: { sequence: 'asc' },
      },
      productMeasures: {
        include: {
          product: {
            select: {
              id: true,
              productId: true,
              name: true,
            },
          },
        },
      },
    },
  }) as any;
}

/**
 * Get a quality measure by measureId
 */
export async function getQualityMeasureByMeasureId(measureId: string): Promise<QualityMeasure | null> {
  return prisma.qualityMeasure.findUnique({
    where: { measureId },
    include: {
      measureLogic: {
        include: {
          valueSet: true,
        },
        orderBy: { sequence: 'asc' },
      },
    },
  }) as any;
}

/**
 * Create a new quality measure
 */
export async function createQualityMeasure(
  data: CreateQualityMeasureInput
): Promise<QualityMeasure> {
  return prisma.qualityMeasure.create({
    data,
  }) as any;
}

/**
 * Update a quality measure
 */
export async function updateQualityMeasure(
  data: UpdateQualityMeasureInput
): Promise<QualityMeasure> {
  const { id, ...updateData } = data;
  
  return prisma.qualityMeasure.update({
    where: { id },
    data: updateData,
  }) as any;
}

/**
 * Delete a quality measure
 */
export async function deleteQualityMeasure(id: string): Promise<void> {
  await prisma.qualityMeasure.delete({
    where: { id },
  });
}

/**
 * Get quality measure statistics
 */
export async function getQualityMeasureStatistics(): Promise<QualityMeasureStatistics> {
  const [
    totalMeasures,
    activeCount,
    draftCount,
    retiredCount,
    byProgram,
    byDomain,
    bySteward,
    recentlyAdded,
    recentlyUpdated,
  ] = await Promise.all([
    prisma.qualityMeasure.count(),
    prisma.qualityMeasure.count({ where: { status: 'ACTIVE' } }),
    prisma.qualityMeasure.count({ where: { status: 'DRAFT' } }),
    prisma.qualityMeasure.count({ where: { status: 'RETIRED' } }),
    prisma.qualityMeasure.groupBy({
      by: ['program'],
      _count: { program: true },
    }),
    prisma.qualityMeasure.groupBy({
      by: ['domain'],
      _count: { domain: true },
    }),
    prisma.qualityMeasure.groupBy({
      by: ['steward'],
      _count: { steward: true },
      where: {
        steward: {
          not: null,
        },
      },
    }),
    prisma.qualityMeasure.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
    prisma.qualityMeasure.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
  ]);

  return {
    totalMeasures,
    activeCount,
    draftCount,
    retiredCount,
    byProgram: Object.fromEntries(byProgram.map((p) => [p.program, p._count.program])) as any,
    byDomain: Object.fromEntries(byDomain.map((d) => [d.domain, d._count.domain])) as any,
    bySteward: Object.fromEntries(bySteward.map((s) => [s.steward || 'Unknown', s._count.steward])) as any,
    recentlyAdded,
    recentlyUpdated,
  };
}

/**
 * Get measures by program (e.g., all HEDIS measures)
 */
export async function getMeasuresByProgram(program: string): Promise<QualityMeasure[]> {
  return prisma.qualityMeasure.findMany({
    where: {
      program: program as any,
      status: 'ACTIVE',
    },
    orderBy: { measureId: 'asc' },
  }) as any;
}

/**
 * Get measures for a specific product
 */
export async function getProductMeasures(productId: string) {
  return prisma.productMeasure.findMany({
    where: { productId },
    include: {
      measure: {
        include: {
          measureLogic: {
            include: {
              valueSet: true,
            },
          },
        },
      },
    },
    orderBy: { measure: { measureId: 'asc' } },
  });
}

/**
 * Assign a measure to a product
 */
export async function assignMeasureToProduct(data: {
  productId: string;
  measureId: string;
  isRequired: boolean;
  reportingYear: number;
  targetRate?: number;
}) {
  return prisma.productMeasure.create({
    data,
  });
}

/**
 * Update product measure assignment
 */
export async function updateProductMeasure(
  id: string,
  data: {
    isRequired?: boolean;
    reportingYear?: number;
    targetRate?: number;
  }
) {
  return prisma.productMeasure.update({
    where: { id },
    data,
  });
}

/**
 * Remove measure from product
 */
export async function removeProductMeasure(id: string): Promise<void> {
  await prisma.productMeasure.delete({
    where: { id },
  });
}

/**
 * Bulk assign measures to product
 */
export async function bulkAssignMeasuresToProduct(data: {
  productId: string;
  measureIds: string[];
  reportingYear: number;
  isRequired: boolean;
  targetRate?: number;
}) {
  const { productId, measureIds, reportingYear, isRequired, targetRate } = data;

  return prisma.$transaction(
    measureIds.map((measureId) =>
      prisma.productMeasure.create({
        data: {
          productId,
          measureId,
          reportingYear,
          isRequired,
          targetRate,
        },
      })
    )
  );
}

