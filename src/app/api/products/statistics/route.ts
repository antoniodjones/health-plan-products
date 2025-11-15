/**
 * API Route: /api/products/statistics
 * GET: Get product statistics
 */
import { NextRequest, NextResponse } from 'next/server';
import { getProductStatistics } from '@/lib/db/products';

export async function GET(request: NextRequest) {
  try {
    const statistics = await getProductStatistics();

    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching product statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 500 }
    );
  }
}

