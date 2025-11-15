/**
 * API Route: /api/codes/categories
 * GET: Get all code categories
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCodeCategories } from '@/lib/db/codes';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codeType = searchParams.get('codeType') || undefined;

    const categories = await getCodeCategories(codeType);

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}

