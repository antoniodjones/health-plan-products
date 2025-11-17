/**
 * Code Equivalency Lookup API Route (Epic 8)
 * GET /api/code-equivalencies/lookup?code=83036&system=CPT
 */

import { NextRequest, NextResponse } from 'next/server';
import { lookupCodeEquivalency, compareCodes, bulkCodeLookup } from '@/lib/db/code-equivalency';
import { bulkCodeLookupSchema, compareCodesSchema } from '@/lib/validations/code-equivalency';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const system = searchParams.get('system');

    if (!code || !system) {
      return NextResponse.json(
        { error: 'Both code and system parameters are required' },
        { status: 400 }
      );
    }

    const result = await lookupCodeEquivalency(system, code);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error looking up code equivalency:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to lookup code equivalency' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's a bulk lookup or compare operation
    if (body.codes) {
      // Bulk lookup
      const validatedData = bulkCodeLookupSchema.parse(body);
      const result = await bulkCodeLookup(validatedData);
      return NextResponse.json(result);
    } else if (body.code1 && body.code2) {
      // Compare codes
      const validatedData = compareCodesSchema.parse(body);
      const result = await compareCodes(validatedData);
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in code equivalency operation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

