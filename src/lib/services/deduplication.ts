/**
 * Deduplication Service (Epic 8)
 * Prevents duplicate health event alerts and interventions
 */

import { PrismaClient } from '@prisma/client';
import type {
  IncomingHealthEvent,
  DeduplicationCheckResult,
  DeduplicationServiceConfig,
  DeduplicationStatistics,
} from '@/types/code-equivalency';
import { findEquivalentCodes } from '@/lib/db/code-equivalency';

// Prisma client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Default configuration
const DEFAULT_CONFIG: DeduplicationServiceConfig = {
  temporalWindowHours: 72, // 3 days
  enableCodeEquivalency: true,
  sourcePriority: ['emr', 'lab', 'claim', 'rx'],
  minConfidenceThreshold: 0.9,
};

// ============================================================================
// Core Deduplication Logic
// ============================================================================

export async function checkForDuplicate(
  event: IncomingHealthEvent,
  config: Partial<DeduplicationServiceConfig> = {}
): Promise<DeduplicationCheckResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Step 1: Find existing events for the same member within temporal window
  const windowStart = new Date(event.eventDate);
  windowStart.setHours(windowStart.getHours() - finalConfig.temporalWindowHours);

  const existingEvents = await prisma.deduplicationEvent.findMany({
    where: {
      memberId: event.memberId,
      primaryEventDate: {
        gte: windowStart,
        lte: event.eventDate,
      },
    },
    orderBy: {
      primaryEventDate: 'desc',
    },
  });

  // Step 2: Check for exact code match
  const exactMatch = existingEvents.find(
    (e) =>
      e.primaryCodeType === event.codeType &&
      e.primaryCode === event.code &&
      e.primaryEventSource !== event.eventSource // Different source
  );

  if (exactMatch) {
    // Update the existing deduplication event
    await updateDeduplicationEvent(exactMatch.id, event);

    return {
      isDuplicate: true,
      matchType: 'exact_code',
      confidence: 1.0,
      primaryEvent: {
        id: exactMatch.id,
        source: exactMatch.primaryEventSource,
        eventId: exactMatch.primaryEventId,
        eventDate: exactMatch.primaryEventDate,
        code: exactMatch.primaryCode,
      },
      duplicateCount: exactMatch.duplicateCount + 1,
    };
  }

  // Step 3: Check for equivalent codes (if enabled)
  if (finalConfig.enableCodeEquivalency) {
    const equivalentCodesResult = await findEquivalentCodes({
      codeType: event.codeType,
      code: event.code,
    });

    for (const existingEvent of existingEvents) {
      // Check if the existing event's code is equivalent to the incoming event's code
      const isEquivalent = equivalentCodesResult.some(
        (eq) =>
          eq.codeType === existingEvent.primaryCodeType &&
          eq.code === existingEvent.primaryCode &&
          eq.confidence >= finalConfig.minConfidenceThreshold
      );

      if (isEquivalent && existingEvent.primaryEventSource !== event.eventSource) {
        // Found an equivalent code match
        const equivalentCodeInfo = equivalentCodesResult.find(
          (eq) =>
            eq.codeType === existingEvent.primaryCodeType &&
            eq.code === existingEvent.primaryCode
        )!;

        await updateDeduplicationEvent(existingEvent.id, event);

        return {
          isDuplicate: true,
          matchType: 'equivalent_code',
          confidence: equivalentCodeInfo.confidence,
          primaryEvent: {
            id: existingEvent.id,
            source: existingEvent.primaryEventSource,
            eventId: existingEvent.primaryEventId,
            eventDate: existingEvent.primaryEventDate,
            code: existingEvent.primaryCode,
          },
          duplicateCount: existingEvent.duplicateCount + 1,
        };
      }
    }
  }

  // Step 4: Check for temporal proximity (same member, similar time, different sources)
  const temporalMatch = existingEvents.find((e) => {
    const timeDiff = Math.abs(event.eventDate.getTime() - e.primaryEventDate.getTime());
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff <= 24 && e.primaryEventSource !== event.eventSource;
  });

  if (temporalMatch) {
    // Temporal proximity match (lower confidence)
    await updateDeduplicationEvent(temporalMatch.id, event);

    return {
      isDuplicate: true,
      matchType: 'temporal_proximity',
      confidence: 0.7,
      primaryEvent: {
        id: temporalMatch.id,
        source: temporalMatch.primaryEventSource,
        eventId: temporalMatch.primaryEventId,
        eventDate: temporalMatch.primaryEventDate,
        code: temporalMatch.primaryCode,
      },
      duplicateCount: temporalMatch.duplicateCount + 1,
    };
  }

  // No duplicate found - this is a new unique event
  return {
    isDuplicate: false,
    matchType: 'none',
    confidence: 0,
    duplicateCount: 0,
  };
}

// ============================================================================
// Event Management
// ============================================================================

export async function recordUniqueEvent(event: IncomingHealthEvent): Promise<string> {
  const deduplicationEvent = await prisma.deduplicationEvent.create({
    data: {
      memberId: event.memberId,
      primaryEventSource: event.eventSource,
      primaryEventId: event.eventId,
      primaryEventDate: event.eventDate,
      primaryCodeType: event.codeType,
      primaryCode: event.code,
      primaryDescription: event.description,
      duplicateCount: 0,
      duplicateSources: [],
      duplicateEventIds: [],
      matchingCriteria: 'new_event',
      confidence: 1.0,
      metadata: event.metadata,
    },
  });

  return deduplicationEvent.id;
}

async function updateDeduplicationEvent(
  deduplicationEventId: string,
  newEvent: IncomingHealthEvent
): Promise<void> {
  const existing = await prisma.deduplicationEvent.findUnique({
    where: { id: deduplicationEventId },
  });

  if (!existing) return;

  // Update duplicate tracking
  const newSources = [...new Set([...existing.duplicateSources, newEvent.eventSource])];
  const newEventIds = [...existing.duplicateEventIds, newEvent.eventId];

  await prisma.deduplicationEvent.update({
    where: { id: deduplicationEventId },
    data: {
      duplicateCount: existing.duplicateCount + 1,
      duplicateSources: newSources,
      duplicateEventIds: newEventIds,
      alertsAvoided: existing.alertsAvoided + 1,
      timeSavedMinutes: existing.timeSavedMinutes + 5, // Estimate: 5 min per prevented duplicate alert
    },
  });
}

// ============================================================================
// Statistics & Analytics
// ============================================================================

export async function getDeduplicationStatistics(
  startDate?: Date,
  endDate?: Date
): Promise<DeduplicationStatistics> {
  const where: any = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [allEvents, totalReceived, byMatchType, bySource] = await Promise.all([
    // Get all deduplication events
    prisma.deduplicationEvent.findMany({
      where,
      select: {
        duplicateCount: true,
        matchingCriteria: true,
        primaryEventSource: true,
        alertsAvoided: true,
        timeSavedMinutes: true,
      },
    }),

    // Total events received (sum of primary + duplicates)
    prisma.deduplicationEvent.aggregate({
      where,
      _sum: {
        duplicateCount: true,
      },
    }),

    // Group by matching criteria
    prisma.deduplicationEvent.groupBy({
      by: ['matchingCriteria'],
      where,
      _count: true,
    }),

    // Group by source
    prisma.deduplicationEvent.groupBy({
      by: ['primaryEventSource'],
      where,
      _count: true,
    }),
  ]);

  const uniqueEvents = allEvents.length;
  const totalReceivedCount = uniqueEvents + (totalReceived._sum.duplicateCount || 0);
  const duplicatesPrevented = totalReceived._sum.duplicateCount || 0;
  const deduplicationRate =
    totalReceivedCount > 0 ? (duplicatesPrevented / totalReceivedCount) * 100 : 0;

  const totalAlertsAvoided = allEvents.reduce((sum, e) => sum + e.alertsAvoided, 0);
  const totalTimeSaved = allEvents.reduce((sum, e) => sum + e.timeSavedMinutes, 0);

  return {
    totalEventsReceived: totalReceivedCount,
    uniqueEvents,
    duplicatesPrevented,
    deduplicationRate: parseFloat(deduplicationRate.toFixed(2)),
    alertsAvoided: totalAlertsAvoided,
    timeSavedMinutes: totalTimeSaved,
    byMatchType: byMatchType.map((item) => ({
      matchType: item.matchingCriteria,
      count: item._count,
      percentage: parseFloat(((item._count / uniqueEvents) * 100).toFixed(2)),
    })),
    bySource: bySource.map((item) => {
      const sourceEvents = allEvents.filter((e) => e.primaryEventSource === item.primaryEventSource);
      const sourceDuplicates = sourceEvents.reduce((sum, e) => sum + e.duplicateCount, 0);
      return {
        source: item.primaryEventSource,
        received: item._count + sourceDuplicates,
        duplicates: sourceDuplicates,
      };
    }),
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

export async function getMemberDeduplicationHistory(
  memberId: string,
  limit: number = 50
) {
  return await prisma.deduplicationEvent.findMany({
    where: { memberId },
    orderBy: { primaryEventDate: 'desc' },
    take: limit,
  });
}

export async function getHighImpactDeduplication(limit: number = 10) {
  // Find deduplication events that prevented the most duplicate alerts
  return await prisma.deduplicationEvent.findMany({
    where: {
      duplicateCount: {
        gte: 2, // At least 2 duplicates prevented
      },
    },
    orderBy: {
      alertsAvoided: 'desc',
    },
    take: limit,
  });
}

export async function clearOldDeduplicationEvents(daysOld: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.deduplicationEvent.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}

