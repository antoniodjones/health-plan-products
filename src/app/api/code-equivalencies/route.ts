/**
 * Code Equivalencies API Routes (Epic 8)
 * GET /api/code-equivalencies - Search equivalencies
 * POST /api/code-equivalencies - Create new equivalency
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createCodeEquivalency,
  searchCodeEquivalencies,
  getCodeEquivalencyStatistics,
} from '@/lib/db/code-equivalency';
import {
  createCodeEquivalencySchema,
  codeEquivalencySearchSchema,
} from '@/lib/validations/code-equivalency';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      source: searchParams.get('source') || undefined,
      minConfidence: searchParams.get('minConfidence')
        ? parseFloat(searchParams.get('minConfidence')!)
        : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      pageSize: searchParams.get('pageSize')
        ? parseInt(searchParams.get('pageSize')!)
        : 25,
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
    };

    // Validate parameters
    const validatedParams = codeEquivalencySearchSchema.parse(params);

    // Search equivalencies
    const results = await searchCodeEquivalencies(validatedParams);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error searching code equivalencies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search code equivalencies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createCodeEquivalencySchema.parse(body);

    // Create equivalency
    const equivalency = await createCodeEquivalency(validatedData);

    return NextResponse.json(equivalency, { status: 201 });
  } catch (error: any) {
    console.error('Error creating code equivalency:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create code equivalency' },
      { status: 500 }
    );
  }
}

