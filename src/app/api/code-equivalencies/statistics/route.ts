/**
 * Code Equivalency Statistics API Route (Epic 8)
 * GET /api/code-equivalencies/statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCodeEquivalencyStatistics } from '@/lib/db/code-equivalency';

export async function GET(request: NextRequest) {
  try {
    const statistics = await getCodeEquivalencyStatistics();

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching code equivalency statistics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

