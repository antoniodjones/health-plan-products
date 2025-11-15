/**
 * API Route: /api/quality-measures
 * GET: Search and list quality measures
 * POST: Create a new quality measure
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  searchQualityMeasures,
  createQualityMeasure,
} from '@/lib/db/quality-measures';
import {
  qualityMeasureSearchSchema,
  createQualityMeasureSchema,
} from '@/lib/validations/quality-measures';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params = {
      program: searchParams.getAll('program') as any,
      domain: searchParams.getAll('domain') as any,
      status: searchParams.getAll('status') as any,
      search: searchParams.get('search') || undefined,
      steward: searchParams.get('steward') || undefined,
      effectiveYear: searchParams.get('effectiveYear') 
        ? Number(searchParams.get('effectiveYear'))
        : undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
      sortBy: (searchParams.get('sortBy') || 'measureId') as any,
      sortOrder: (searchParams.get('sortOrder') || 'asc') as any,
    };

    // Validate params
    const validatedParams = qualityMeasureSearchSchema.parse(params);

    // Execute search
    const result = await searchQualityMeasures(validatedParams);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching quality measures:', error);
    return NextResponse.json(
      { error: 'Failed to search quality measures', details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createQualityMeasureSchema.parse(body);

    // Create measure
    const measure = await createQualityMeasure(validatedData);

    return NextResponse.json(measure, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quality measure:', error);
    return NextResponse.json(
      { error: 'Failed to create quality measure', details: error.message },
      { status: 400 }
    );
  }
}

