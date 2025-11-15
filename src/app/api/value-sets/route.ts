/**
 * API Route: /api/value-sets
 * GET: Search and list value sets
 * POST: Create a new value set
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  searchValueSets,
  createValueSet,
} from '@/lib/db/value-sets';
import {
  valueSetSearchSchema,
  createValueSetSchema,
} from '@/lib/validations/quality-measures';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params = {
      purpose: searchParams.get('purpose') || undefined,
      search: searchParams.get('search') || undefined,
      oid: searchParams.get('oid') || undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
      sortBy: (searchParams.get('sortBy') || 'name') as any,
      sortOrder: (searchParams.get('sortOrder') || 'asc') as any,
    };

    // Validate params
    const validatedParams = valueSetSearchSchema.parse(params);

    // Execute search
    const result = await searchValueSets(validatedParams);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching value sets:', error);
    return NextResponse.json(
      { error: 'Failed to search value sets', details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createValueSetSchema.parse(body);

    // Create value set
    const valueSet = await createValueSet(validatedData);

    return NextResponse.json(valueSet, { status: 201 });
  } catch (error: any) {
    console.error('Error creating value set:', error);
    return NextResponse.json(
      { error: 'Failed to create value set', details: error.message },
      { status: 400 }
    );
  }
}

