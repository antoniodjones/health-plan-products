/**
 * Database operations for Value Sets
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type {
  ValueSetSearchParams,
  ValueSet,
  ValueSetSearchResult,
  CreateValueSetInput,
  UpdateValueSetInput,
  ValueSetStatistics,
  ValueSetCode,
} from '@/types/quality-measures';

// Singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Search and filter value sets
 */
export async function searchValueSets(
  params: ValueSetSearchParams
): Promise<ValueSetSearchResult> {
  const {
    purpose,
    search,
    oid,
    page = 1,
    pageSize = 25,
    sortBy = 'name',
    sortOrder = 'asc',
  } = params;

  const where: Prisma.ValueSetWhereInput = {};

  if (purpose) {
    where.purpose = { contains: purpose, mode: 'insensitive' };
  }

  if (oid) {
    where.oid = { contains: oid, mode: 'insensitive' };
  }

  if (search) {
    where.OR = [
      { valueSetId: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [valueSets, total] = await Promise.all([
    prisma.valueSet.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        codes: {
          select: {
            id: true,
          },
        },
        measureLogic: {
          select: {
            id: true,
            measureId: true,
          },
        },
      },
    }),
    prisma.valueSet.count({ where }),
  ]);

  return {
    valueSets: valueSets as any,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get a single value set by ID
 */
export async function getValueSetById(id: string): Promise<ValueSet | null> {
  return prisma.valueSet.findUnique({
    where: { id },
    include: {
      codes: {
        include: {
          codeSet: {
            select: {
              id: true,
              code: true,
              codeType: true,
              description: true,
              category: true,
            },
          },
        },
      },
      measureLogic: {
        include: {
          measure: {
            select: {
              id: true,
              measureId: true,
              name: true,
            },
          },
        },
      },
    },
  }) as any;
}

/**
 * Get a value set by valueSetId
 */
export async function getValueSetByValueSetId(valueSetId: string): Promise<ValueSet | null> {
  return prisma.valueSet.findUnique({
    where: { valueSetId },
    include: {
      codes: {
        include: {
          codeSet: true,
        },
      },
    },
  }) as any;
}

/**
 * Create a new value set
 */
export async function createValueSet(
  data: CreateValueSetInput
): Promise<ValueSet> {
  return prisma.valueSet.create({
    data,
  }) as any;
}

/**
 * Update a value set
 */
export async function updateValueSet(
  data: UpdateValueSetInput
): Promise<ValueSet> {
  const { id, ...updateData } = data;
  
  return prisma.valueSet.update({
    where: { id },
    data: updateData,
  }) as any;
}

/**
 * Delete a value set
 */
export async function deleteValueSet(id: string): Promise<void> {
  await prisma.valueSet.delete({
    where: { id },
  });
}

/**
 * Get value set statistics
 */
export async function getValueSetStatistics(): Promise<ValueSetStatistics> {
  const [
    totalValueSets,
    totalCodes,
    byPurpose,
    recentlyAdded,
  ] = await Promise.all([
    prisma.valueSet.count(),
    prisma.valueSetCode.count(),
    prisma.valueSet.groupBy({
      by: ['purpose'],
      _count: { purpose: true },
      where: {
        purpose: {
          not: null,
        },
      },
    }),
    prisma.valueSet.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
  ]);

  const averageCodesPerSet = totalValueSets > 0 ? totalCodes / totalValueSets : 0;

  return {
    totalValueSets,
    totalCodes,
    averageCodesPerSet,
    byPurpose: Object.fromEntries(byPurpose.map((p) => [p.purpose || 'Unknown', p._count.purpose])),
    recentlyAdded,
  };
}

/**
 * Get codes in a value set
 */
export async function getValueSetCodes(valueSetId: string): Promise<ValueSetCode[]> {
  return prisma.valueSetCode.findMany({
    where: { valueSetId },
    include: {
      codeSet: {
        select: {
          id: true,
          code: true,
          codeType: true,
          description: true,
          category: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      codeSet: {
        code: 'asc',
      },
    },
  }) as any;
}

/**
 * Add codes to a value set
 */
export async function addCodesToValueSet(data: {
  valueSetId: string;
  codeSetIds: string[];
  included?: boolean;
  notes?: string;
}): Promise<number> {
  const { valueSetId, codeSetIds, included = true, notes } = data;

  const result = await prisma.valueSetCode.createMany({
    data: codeSetIds.map((codeSetId) => ({
      valueSetId,
      codeSetId,
      included,
      notes,
    })),
    skipDuplicates: true, // Skip if code already in value set
  });

  return result.count;
}

/**
 * Remove codes from a value set
 */
export async function removeCodesFromValueSet(data: {
  valueSetId: string;
  codeSetIds: string[];
}): Promise<number> {
  const { valueSetId, codeSetIds } = data;

  const result = await prisma.valueSetCode.deleteMany({
    where: {
      valueSetId,
      codeSetId: {
        in: codeSetIds,
      },
    },
  });

  return result.count;
}

/**
 * Update value set code (toggle included/excluded)
 */
export async function updateValueSetCode(
  id: string,
  data: {
    included?: boolean;
    notes?: string;
  }
): Promise<ValueSetCode> {
  return prisma.valueSetCode.update({
    where: { id },
    data,
  }) as any;
}

/**
 * Bulk import codes to value set from code patterns
 */
export async function bulkImportCodesByPattern(data: {
  valueSetId: string;
  codeType: string;
  codePattern: string; // e.g., "E10%" for all E10.* codes
  included?: boolean;
}): Promise<number> {
  const { valueSetId, codeType, codePattern, included = true } = data;

  // Find all codes matching the pattern
  const matchingCodes = await prisma.codeSet.findMany({
    where: {
      codeType: codeType as any,
      code: {
        startsWith: codePattern.replace('%', ''),
      },
    },
    select: {
      id: true,
    },
  });

  if (matchingCodes.length === 0) {
    return 0;
  }

  const result = await prisma.valueSetCode.createMany({
    data: matchingCodes.map((code) => ({
      valueSetId,
      codeSetId: code.id,
      included,
    })),
    skipDuplicates: true,
  });

  return result.count;
}

/**
 * Get value sets that contain a specific code
 */
export async function getValueSetsForCode(codeSetId: string) {
  return prisma.valueSetCode.findMany({
    where: { codeSetId },
    include: {
      valueSet: {
        include: {
          measureLogic: {
            include: {
              measure: {
                select: {
                  id: true,
                  measureId: true,
                  name: true,
                  program: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

