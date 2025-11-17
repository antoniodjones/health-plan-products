/**
 * Code Equivalency Database Functions (Epic 8)
 * CRUD operations for code equivalencies and mappings
 */

import { PrismaClient } from '@prisma/client';
import type {
  CodeEquivalency,
  CodeEquivalencySearchParams,
  CodeEquivalencySearchResult,
  FindEquivalentCodesInput,
  EquivalentCodeResult,
  CodeEquivalencyLookupResult,
  CompareCodesInput,
  CompareCodesResult,
  BulkCodeLookupInput,
  BulkCodeLookupResult,
  CodeEquivalencyStatistics,
  CreateCodeEquivalencyInput,
  UpdateCodeEquivalencyInput,
  CreateEquivalencyMappingInput,
} from '@/types/code-equivalency';

// Prisma client singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ============================================================================
// Code Equivalency CRUD
// ============================================================================

export async function createCodeEquivalency(
  data: CreateCodeEquivalencyInput
): Promise<CodeEquivalency> {
  return await prisma.codeEquivalency.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      source: data.source || 'MANUAL',
      confidence: data.confidence || 1.0,
      createdBy: data.createdBy,
      metadata: data.metadata,
    },
    include: {
      mappings: {
        include: {
          sourceCode: true,
          targetCode: true,
        },
      },
    },
  });
}

export async function getCodeEquivalencyById(id: string): Promise<CodeEquivalency | null> {
  return await prisma.codeEquivalency.findUnique({
    where: { id },
    include: {
      mappings: {
        include: {
          sourceCode: true,
          targetCode: true,
        },
      },
    },
  });
}

export async function updateCodeEquivalency(
  id: string,
  data: UpdateCodeEquivalencyInput
): Promise<CodeEquivalency> {
  return await prisma.codeEquivalency.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.source && { source: data.source }),
      ...(data.confidence !== undefined && { confidence: data.confidence }),
      ...(data.metadata && { metadata: data.metadata }),
    },
    include: {
      mappings: {
        include: {
          sourceCode: true,
          targetCode: true,
        },
      },
    },
  });
}

export async function deleteCodeEquivalency(id: string): Promise<void> {
  await prisma.codeEquivalency.delete({
    where: { id },
  });
}

export async function searchCodeEquivalencies(
  params: CodeEquivalencySearchParams
): Promise<CodeEquivalencySearchResult> {
  const {
    query,
    category,
    source,
    minConfidence,
    page = 1,
    pageSize = 25,
    sortBy = 'name',
    sortOrder = 'asc',
  } = params;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (source) {
    where.source = source;
  }

  if (minConfidence !== undefined) {
    where.confidence = { gte: minConfidence };
  }

  // Get total count
  const total = await prisma.codeEquivalency.count({ where });

  // Get paginated results
  const equivalencies = await prisma.codeEquivalency.findMany({
    where,
    include: {
      mappings: {
        include: {
          sourceCode: true,
          targetCode: true,
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    equivalencies,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ============================================================================
// Equivalency Mapping CRUD
// ============================================================================

export async function createEquivalencyMapping(
  data: CreateEquivalencyMappingInput
) {
  return await prisma.equivalencyMapping.create({
    data: {
      equivalencyId: data.equivalencyId,
      sourceCodeId: data.sourceCodeId,
      targetCodeId: data.targetCodeId,
      relationship: data.relationship,
      bidirectional: data.bidirectional ?? true,
      confidence: data.confidence ?? 1.0,
      validFrom: data.validFrom || new Date(),
      validTo: data.validTo,
    },
    include: {
      sourceCode: true,
      targetCode: true,
      equivalency: true,
    },
  });
}

export async function deleteEquivalencyMapping(id: string): Promise<void> {
  await prisma.equivalencyMapping.delete({
    where: { id },
  });
}

// ============================================================================
// Code Equivalency Queries
// ============================================================================

export async function findEquivalentCodes(
  input: FindEquivalentCodesInput
): Promise<EquivalentCodeResult[]> {
  const { codeType, code, includeRelationships } = input;

  // Find the code in the database
  const sourceCode = await prisma.codeSet.findFirst({
    where: {
      code,
      codeType,
      isActive: true,
    },
  });

  if (!sourceCode) {
    return [];
  }

  // Find all mappings where this code is the source or target
  const mappings = await prisma.equivalencyMapping.findMany({
    where: {
      OR: [
        { sourceCodeId: sourceCode.id },
        { targetCodeId: sourceCode.id, bidirectional: true },
      ],
      ...(includeRelationships && {
        relationship: { in: includeRelationships },
      }),
    },
    include: {
      sourceCode: true,
      targetCode: true,
      equivalency: true,
    },
  });

  // Transform to result format
  const results: EquivalentCodeResult[] = [];

  for (const mapping of mappings) {
    // Determine which code is the equivalent (not the input code)
    const isSource = mapping.sourceCodeId === sourceCode.id;
    const equivalentCode = isSource ? mapping.targetCode : mapping.sourceCode;

    results.push({
      codeType: equivalentCode.codeType,
      code: equivalentCode.code,
      description: equivalentCode.description,
      relationship: mapping.relationship,
      confidence: mapping.confidence,
      equivalencyId: mapping.equivalency.id,
      equivalencyName: mapping.equivalency.name,
    });
  }

  return results;
}

export async function lookupCodeEquivalency(
  codeType: string,
  code: string
): Promise<CodeEquivalencyLookupResult> {
  const equivalentCodes = await findEquivalentCodes({ codeType, code });

  if (equivalentCodes.length === 0) {
    return { found: false };
  }

  // Group by equivalency (there might be multiple)
  const equivalencyMap = new Map<string, typeof equivalentCodes>();
  
  for (const result of equivalentCodes) {
    if (!equivalencyMap.has(result.equivalencyId)) {
      equivalencyMap.set(result.equivalencyId, []);
    }
    equivalencyMap.get(result.equivalencyId)!.push(result);
  }

  // Return the first equivalency (or you could return all)
  const [equivalencyId, codes] = Array.from(equivalencyMap.entries())[0];
  const firstCode = codes[0];

  return {
    found: true,
    equivalency: {
      id: equivalencyId,
      name: firstCode.equivalencyName,
      category: 'LABORATORY', // You might want to fetch this from the equivalency
      confidence: Math.min(...codes.map((c) => c.confidence)),
      mappings: codes.map((c) => ({
        codeType: c.codeType,
        code: c.code,
        description: c.description,
        relationship: c.relationship,
      })),
    },
  };
}

export async function compareCodes(
  input: CompareCodesInput
): Promise<CompareCodesResult> {
  const { code1, code2 } = input;

  // Find both codes
  const [sourceCode, targetCode] = await Promise.all([
    prisma.codeSet.findFirst({
      where: { code: code1.code, codeType: code1.codeType, isActive: true },
    }),
    prisma.codeSet.findFirst({
      where: { code: code2.code, codeType: code2.codeType, isActive: true },
    }),
  ]);

  if (!sourceCode || !targetCode) {
    return { areEquivalent: false };
  }

  // Check if there's a mapping between them
  const mapping = await prisma.equivalencyMapping.findFirst({
    where: {
      OR: [
        { sourceCodeId: sourceCode.id, targetCodeId: targetCode.id },
        { sourceCodeId: targetCode.id, targetCodeId: sourceCode.id, bidirectional: true },
      ],
    },
    include: {
      equivalency: true,
    },
  });

  if (!mapping) {
    return { areEquivalent: false };
  }

  return {
    areEquivalent: true,
    equivalencyId: mapping.equivalency.id,
    equivalencyName: mapping.equivalency.name,
    relationship: mapping.relationship,
    confidence: mapping.confidence,
  };
}

export async function bulkCodeLookup(
  input: BulkCodeLookupInput
): Promise<BulkCodeLookupResult> {
  const results = await Promise.all(
    input.codes.map(async ({ codeType, code }) => {
      const lookup = await lookupCodeEquivalency(codeType, code);
      return {
        codeType,
        code,
        found: lookup.found,
        equivalency: lookup.equivalency,
      };
    })
  );

  return { results };
}

// ============================================================================
// Statistics
// ============================================================================

export async function getCodeEquivalencyStatistics(): Promise<CodeEquivalencyStatistics> {
  const [
    totalEquivalencies,
    byCategory,
    bySource,
    totalMappings,
    avgConfidence,
    totalActiveCodes,
  ] = await Promise.all([
    // Total equivalencies
    prisma.codeEquivalency.count(),

    // By category
    prisma.codeEquivalency.groupBy({
      by: ['category'],
      _count: true,
    }),

    // By source
    prisma.codeEquivalency.groupBy({
      by: ['source'],
      _count: true,
    }),

    // Total mappings
    prisma.equivalencyMapping.count(),

    // Average confidence
    prisma.codeEquivalency.aggregate({
      _avg: { confidence: true },
    }),

    // Total active codes
    prisma.codeSet.count({
      where: { isActive: true },
    }),
  ]);

  // Count unique source codes with equivalencies
  const uniqueSourceCodes = await prisma.equivalencyMapping.groupBy({
    by: ['sourceCodeId'],
  });
  const codesWithEquivalencies = uniqueSourceCodes.length;

  const coverageRate = totalActiveCodes > 0 ? (codesWithEquivalencies / totalActiveCodes) * 100 : 0;

  return {
    totalEquivalencies,
    byCategory: byCategory.map((item) => ({
      category: item.category as any,
      count: item._count,
    })),
    bySource: bySource.map((item) => ({
      source: item.source as any,
      count: item._count,
    })),
    totalMappings,
    averageConfidence: avgConfidence._avg.confidence || 0,
    coverageRate: parseFloat(coverageRate.toFixed(2)),
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

export async function getOrphanCodes(limit: number = 100) {
  // Find codes without any equivalency mappings
  return await prisma.codeSet.findMany({
    where: {
      isActive: true,
      sourceEquivalencies: { none: {} },
      targetEquivalencies: { none: {} },
    },
    take: limit,
    orderBy: { code: 'asc' },
  });
}

export async function getEquivalencyByName(name: string): Promise<CodeEquivalency | null> {
  return await prisma.codeEquivalency.findFirst({
    where: { name },
    include: {
      mappings: {
        include: {
          sourceCode: true,
          targetCode: true,
        },
      },
    },
  });
}

export async function addCodeToEquivalency(
  equivalencyId: string,
  codeId: string,
  relationship: string = 'EXACT'
) {
  // Get the equivalency to find an existing code to link with
  const equivalency = await prisma.codeEquivalency.findUnique({
    where: { id: equivalencyId },
    include: {
      mappings: {
        include: { sourceCode: true },
        take: 1,
      },
    },
  });

  if (!equivalency || equivalency.mappings.length === 0) {
    throw new Error('Equivalency not found or has no existing mappings');
  }

  // Link the new code with an existing code in the equivalency
  return await prisma.equivalencyMapping.create({
    data: {
      equivalencyId,
      sourceCodeId: equivalency.mappings[0].sourceCodeId,
      targetCodeId: codeId,
      relationship: relationship as any,
      bidirectional: true,
    },
    include: {
      sourceCode: true,
      targetCode: true,
    },
  });
}

