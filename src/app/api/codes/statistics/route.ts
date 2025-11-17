/**
 * API Route: /api/codes/statistics
 * SIMPLIFIED
 */
import { NextResponse } from 'next/server';
import { getCodeStatistics } from '@/lib/db/codes';

export async function GET() {
  try {
    const statistics = await getCodeStatistics();
    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('❌ /api/codes/statistics - Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 500 }
    );
  }
}
