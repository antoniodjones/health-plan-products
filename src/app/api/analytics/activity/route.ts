/**
 * API Route: /api/analytics/activity
 * GET: Get recent activity log
 */
import { NextRequest, NextResponse } from 'next/server';
import { getRecentActivity, getActivityTrend } from '@/lib/db/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'recent';
    const limit = Number(searchParams.get('limit')) || 50;
    const days = Number(searchParams.get('days')) || 30;

    if (type === 'trend') {
      const trend = await getActivityTrend(days);
      return NextResponse.json(trend);
    }

    const activities = await getRecentActivity(limit);

    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity', details: error.message },
      { status: 500 }
    );
  }
}

