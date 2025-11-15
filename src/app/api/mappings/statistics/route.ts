/**
 * API Route: /api/mappings/statistics
 * GET: Get mapping statistics
 */
import { NextRequest, NextResponse } from 'next/server';
import { getMappingStatistics } from '@/lib/db/mappings';

export async function GET(request: NextRequest) {
  try {
    const statistics = await getMappingStatistics();

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching mapping statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 500 }
    );
  }
}

