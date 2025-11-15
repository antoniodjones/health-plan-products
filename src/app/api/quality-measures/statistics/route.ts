/**
 * API Route: /api/quality-measures/statistics
 * GET: Get quality measure statistics for dashboard
 */
import { NextRequest, NextResponse } from 'next/server';
import { getQualityMeasureStatistics } from '@/lib/db/quality-measures';

export async function GET(request: NextRequest) {
  try {
    const statistics = await getQualityMeasureStatistics();

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching quality measure statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 400 }
    );
  }
}

