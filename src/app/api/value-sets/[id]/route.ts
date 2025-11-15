/**
 * API Route: /api/value-sets/[id]
 * GET: Get a single value set
 * PUT: Update a value set
 * DELETE: Delete a value set
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  getValueSetById,
  updateValueSet,
  deleteValueSet,
} from '@/lib/db/value-sets';
import { updateValueSetSchema } from '@/lib/validations/quality-measures';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const valueSet = await getValueSetById(params.id);

    if (!valueSet) {
      return NextResponse.json(
        { error: 'Value set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(valueSet);
  } catch (error: any) {
    console.error('Error fetching value set:', error);
    return NextResponse.json(
      { error: 'Failed to fetch value set', details: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = updateValueSetSchema.parse({
      id: params.id,
      ...body,
    });

    // Update value set
    const valueSet = await updateValueSet(validatedData);

    return NextResponse.json(valueSet);
  } catch (error: any) {
    console.error('Error updating value set:', error);
    return NextResponse.json(
      { error: 'Failed to update value set', details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteValueSet(params.id);

    return NextResponse.json({ success: true, message: 'Value set deleted' });
  } catch (error: any) {
    console.error('Error deleting value set:', error);
    return NextResponse.json(
      { error: 'Failed to delete value set', details: error.message },
      { status: 400 }
    );
  }
}

