/**
 * Database operations for Analytics and Reporting
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type {
  DashboardMetrics,
  TimeSeriesData,
  CodeCoverageData,
  MappingDistributionData,
} from '@/types/analytics';

const prisma = new PrismaClient();

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [
    // Codes
    totalCodes,
    activeCodes,
    customCodes,
    recentCodes,
    codesByType,
    // Mappings
    totalMappings,
    activeMappings,
    totalCodesForMapping,
    mappedCodes,
    recentMappings,
    mappingsByType,
  ] = await Promise.all([
    // Codes queries
    prisma.medicalCode.count(),
    prisma.medicalCode.count({ where: { status: 'ACTIVE' } }),
    prisma.medicalCode.count({ where: { isCustom: true } }),
    prisma.medicalCode.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.medicalCode.groupBy({
      by: ['codeType'],
      _count: { codeType: true },
    }),
    // Mappings queries
    prisma.codeMapping.count(),
    prisma.codeMapping.count({ where: { status: 'ACTIVE' } }),
    prisma.medicalCode.count(),
    prisma.medicalCode.count({
      where: {
        mappings: {
          some: {},
        },
      },
    }),
    prisma.codeMapping.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.codeMapping.groupBy({
      by: ['mappingType'],
      _count: { mappingType: true },
    }),
  ]);

  return {
    codes: {
      total: totalCodes,
      active: activeCodes,
      custom: customCodes,
      recentlyAdded: recentCodes,
      byType: Object.fromEntries(codesByType.map((t) => [t.codeType, t._count.codeType])),
    },
    mappings: {
      total: totalMappings,
      active: activeMappings,
      unmapped: totalCodesForMapping - mappedCodes,
      recentlyCreated: recentMappings,
      byType: Object.fromEntries(mappingsByType.map((t) => [t.mappingType, t._count.mappingType])),
    },
    validation: {
      totalTests: 0, // Placeholder - implement when validation tests are added
      passed: 0,
      failed: 0,
      successRate: 0,
    },
  };
}

/**
 * Get code coverage by type
 */
export async function getCodeCoverage(): Promise<CodeCoverageData[]> {
  const codeTypes = await prisma.medicalCode.groupBy({
    by: ['codeType'],
    _count: { id: true },
  });

  const coverageData = await Promise.all(
    codeTypes.map(async (typeData) => {
      const mappedCount = await prisma.medicalCode.count({
        where: {
          codeType: typeData.codeType,
          mappings: {
            some: {},
          },
        },
      });

      const totalCodes = typeData._count.id;
      const coveragePercentage = totalCodes > 0 ? (mappedCount / totalCodes) * 100 : 0;

      return {
        codeType: typeData.codeType,
        totalCodes,
        mappedCodes: mappedCount,
        coveragePercentage: Math.round(coveragePercentage * 10) / 10,
      };
    })
  );

  return coverageData;
}

/**
 * Get mapping distribution by benefit category
 */
export async function getMappingDistribution(): Promise<MappingDistributionData[]> {
  const mappingsByBenefit = await prisma.codeMapping.groupBy({
    by: ['benefitId'],
    _count: { id: true },
  });

  const total = mappingsByBenefit.reduce((sum, item) => sum + item._count.id, 0);

  const distributionData = await Promise.all(
    mappingsByBenefit.map(async (item) => {
      const benefit = await prisma.benefit.findUnique({
        where: { id: item.benefitId },
        select: { category: true },
      });

      return {
        benefitCategory: benefit?.category || 'Unknown',
        count: item._count.id,
        percentage: total > 0 ? Math.round((item._count.id / total) * 100 * 10) / 10 : 0,
      };
    })
  );

  // Group by category
  const grouped = distributionData.reduce((acc, item) => {
    const existing = acc.find((x) => x.benefitCategory === item.benefitCategory);
    if (existing) {
      existing.count += item.count;
      existing.percentage += item.percentage;
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as MappingDistributionData[]);

  return grouped.sort((a, b) => b.count - a.count);
}

/**
 * Get activity trend over time
 */
export async function getActivityTrend(days: number = 30): Promise<TimeSeriesData[]> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get codes created per day
  const codesCreated = await prisma.medicalCode.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    _count: { id: true },
  });

  // Group by date
  const dataByDate: Record<string, number> = {};

  codesCreated.forEach((item) => {
    const date = item.createdAt.toISOString().split('T')[0];
    dataByDate[date] = (dataByDate[date] || 0) + item._count.id;
  });

  // Fill in missing dates
  const result: TimeSeriesData[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      value: dataByDate[dateStr] || 0,
      label: dateStr,
    });
  }

  return result;
}

/**
 * Get recent activity log
 */
export async function getRecentActivity(limit: number = 50) {
  const activities = await prisma.auditLog.findMany({
    take: limit,
    orderBy: { timestamp: 'desc' },
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      timestamp: true,
      userId: true,
      details: true,
      metadata: true,
    },
  });

  return activities.map((activity) => ({
    id: activity.id,
    timestamp: activity.timestamp,
    activityType: activity.action as any,
    entityType: activity.entityType as any,
    entityId: activity.entityId,
    userId: activity.userId || undefined,
    description: activity.details || '',
    metadata: activity.metadata as Record<string, any>,
  }));
}

