/**
 * Deduplication Statistics API Route (Epic 8)
 * GET /api/deduplication/statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDeduplicationStatistics } from '@/lib/services/deduplication';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const statistics = await getDeduplicationStatistics(startDate, endDate);

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching deduplication statistics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

