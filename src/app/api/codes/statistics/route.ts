/**
 * API Route: /api/codes/statistics
 * GET: Get code statistics and analytics
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCodeStatistics } from '@/lib/db/codes';

export async function GET(request: NextRequest) {
  try {
    const statistics = await getCodeStatistics();

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching code statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 500 }
    );
  }
}

