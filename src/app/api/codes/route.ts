/**
 * API Route: /api/codes
 * GET: Search and list medical codes
 * POST: Create a new medical code
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchCodes, createCode, getCodeStatistics } from '@/lib/db/codes';
import { codeSearchSchema, medicalCodeSchema } from '@/lib/validations/code';
import { CodeType, CodeStatus, CodeSource } from '@/types/codes';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params = {
      codeType: searchParams.getAll('codeType') as CodeType[],
      status: searchParams.getAll('status') as CodeStatus[],
      source: searchParams.getAll('source') as CodeSource[],
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      effectiveDateFrom: searchParams.get('effectiveDateFrom')
        ? new Date(searchParams.get('effectiveDateFrom')!)
        : undefined,
      effectiveDateTo: searchParams.get('effectiveDateTo')
        ? new Date(searchParams.get('effectiveDateTo')!)
        : undefined,
      isCustom: searchParams.get('isCustom')
        ? searchParams.get('isCustom') === 'true'
        : undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
      sortBy: (searchParams.get('sortBy') || 'code') as any,
      sortOrder: (searchParams.get('sortOrder') || 'asc') as any,
    };

    // Validate params
    const validatedParams = codeSearchSchema.parse(params);

    // Execute search
    const result = await searchCodes(validatedParams);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching codes:', error);
    return NextResponse.json(
      { error: 'Failed to search codes', details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = medicalCodeSchema.parse(body);

    // Create code
    const code = await createCode({
      ...validatedData,
      additionalData: validatedData.additionalData || {},
      metadata: validatedData.metadata || {},
    });

    return NextResponse.json(code, { status: 201 });
  } catch (error: any) {
    console.error('Error creating code:', error);
    return NextResponse.json(
      { error: 'Failed to create code', details: error.message },
      { status: 400 }
    );
  }
}

