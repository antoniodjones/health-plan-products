/**
 * API Route: /api/analytics/coverage
 * GET: Get code coverage statistics
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCodeCoverage } from '@/lib/db/analytics';

export async function GET(request: NextRequest) {
  try {
    const coverage = await getCodeCoverage();

    return NextResponse.json(coverage);
  } catch (error: any) {
    console.error('Error fetching code coverage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch code coverage', details: error.message },
      { status: 500 }
    );
  }
}

