/**
 * Deduplication Check API Route (Epic 8)
 * POST /api/deduplication/check - Check if an incoming event is a duplicate
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkForDuplicate, recordUniqueEvent } from '@/lib/services/deduplication';
import { incomingHealthEventSchema } from '@/lib/validations/code-equivalency';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedEvent = incomingHealthEventSchema.parse(body);

    // Check for duplicate
    const result = await checkForDuplicate(validatedEvent);

    // If not a duplicate, optionally record it
    const shouldRecord = request.nextUrl.searchParams.get('record') === 'true';
    let eventId: string | undefined;

    if (!result.isDuplicate && shouldRecord) {
      eventId = await recordUniqueEvent(validatedEvent);
    }

    return NextResponse.json({
      ...result,
      ...(eventId && { recordedEventId: eventId }),
    });
  } catch (error: any) {
    console.error('Error checking for duplicate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check for duplicate' },
      { status: 500 }
    );
  }
}

