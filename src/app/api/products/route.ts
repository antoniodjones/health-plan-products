/**
 * API Route: /api/products
 * GET: Search and list products
 * POST: Create a new product
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, createProduct } from '@/lib/db/products';
import { productSchema } from '@/lib/validations/product';
import { ProductType, ProductStatus } from '@/types/products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params = {
      productType: searchParams.getAll('productType') as ProductType[],
      status: searchParams.getAll('status') as ProductStatus[],
      marketSegment: searchParams.get('marketSegment') || undefined,
      search: searchParams.get('search') || undefined,
      effectiveDateFrom: searchParams.get('effectiveDateFrom')
        ? new Date(searchParams.get('effectiveDateFrom')!)
        : undefined,
      effectiveDateTo: searchParams.get('effectiveDateTo')
        ? new Date(searchParams.get('effectiveDateTo')!)
        : undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
      sortBy: (searchParams.get('sortBy') || 'createdAt') as any,
      sortOrder: (searchParams.get('sortOrder') || 'desc') as any,
    };

    // Execute search
    const result = await searchProducts(params);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products', details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = productSchema.parse(body);

    // Create product
    const product = await createProduct({
      ...validatedData,
      stateAvailability: validatedData.stateAvailability || [],
      metadata: validatedData.metadata || {},
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 400 }
    );
  }
}

