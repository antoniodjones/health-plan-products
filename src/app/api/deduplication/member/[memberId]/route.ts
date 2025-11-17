/**
 * Member Deduplication History API Route (Epic 8)
 * GET /api/deduplication/member/[memberId] - Get deduplication history for a member
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMemberDeduplicationHistory } from '@/lib/services/deduplication';

export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const history = await getMemberDeduplicationHistory(params.memberId, limit);

    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Error fetching member deduplication history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

