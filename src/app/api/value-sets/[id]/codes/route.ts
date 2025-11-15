/**
 * API Route: /api/value-sets/[id]/codes
 * GET: Get all codes in a value set
 * POST: Add codes to a value set
 * DELETE: Remove codes from a value set
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  getValueSetCodes,
  addCodesToValueSet,
  removeCodesFromValueSet,
} from '@/lib/db/value-sets';
import {
  addCodesToValueSetSchema,
  removeCodesFromValueSetSchema,
} from '@/lib/validations/quality-measures';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const codes = await getValueSetCodes(params.id);

    return NextResponse.json({ codes, total: codes.length });
  } catch (error: any) {
    console.error('Error fetching value set codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch value set codes', details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = addCodesToValueSetSchema.parse({
      valueSetId: params.id,
      ...body,
    });

    // Add codes
    const count = await addCodesToValueSet(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: `${count} codes added to value set`,
        count,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding codes to value set:', error);
    return NextResponse.json(
      { error: 'Failed to add codes to value set', details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = removeCodesFromValueSetSchema.parse({
      valueSetId: params.id,
      ...body,
    });

    // Remove codes
    const count = await removeCodesFromValueSet(validatedData);

    return NextResponse.json({
      success: true,
      message: `${count} codes removed from value set`,
      count,
    });
  } catch (error: any) {
    console.error('Error removing codes from value set:', error);
    return NextResponse.json(
      { error: 'Failed to remove codes from value set', details: error.message },
      { status: 400 }
    );
  }
}

