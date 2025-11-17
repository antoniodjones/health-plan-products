/**
 * API Route: /api/codes
 * SIMPLIFIED - Basic CRUD only
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchCodes } from '@/lib/db/codes';
import { codeSearchSchema } from '@/lib/validations/code';
import { CodeType } from '@/types/codes';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse params - SIMPLE
    const params = {
      search: searchParams.get('search') || undefined,
      codeType: searchParams.getAll('codeType') as CodeType[],
      category: searchParams.getAll('category'),
      isActive: searchParams.get('isActive')
        ? searchParams.get('isActive') === 'true'
        : undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
    };

    console.log('📥 /api/codes - Params:', params);

    // Validate
    const validated = codeSearchSchema.parse(params);

    // Query
    const result = await searchCodes(validated);

    console.log('✅ /api/codes - Found:', result.total, 'codes');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ /api/codes - Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch codes', details: error.message },
      { status: 500 }
    );
  }
}
