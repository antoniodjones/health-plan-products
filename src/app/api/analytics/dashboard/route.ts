/**
 * API Route: /api/analytics/dashboard
 * GET: Get dashboard metrics and KPIs
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/db/analytics';

export async function GET(request: NextRequest) {
  try {
    const metrics = await getDashboardMetrics();

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics', details: error.message },
      { status: 500 }
    );
  }
}

