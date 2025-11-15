/**
 * API Route: /api/analytics/distribution
 * GET: Get mapping distribution by benefit category
 */
import { NextRequest, NextResponse } from 'next/server';
import { getMappingDistribution } from '@/lib/db/analytics';

export async function GET(request: NextRequest) {
  try {
    const distribution = await getMappingDistribution();

    return NextResponse.json(distribution);
  } catch (error: any) {
    console.error('Error fetching mapping distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mapping distribution', details: error.message },
      { status: 500 }
    );
  }
}

