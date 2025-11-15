/**
 * API Route: /api/value-sets/statistics
 * GET: Get value set statistics for dashboard
 */
import { NextRequest, NextResponse } from 'next/server';
import { getValueSetStatistics } from '@/lib/db/value-sets';

export async function GET(request: NextRequest) {
  try {
    const statistics = await getValueSetStatistics();

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching value set statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 400 }
    );
  }
}

