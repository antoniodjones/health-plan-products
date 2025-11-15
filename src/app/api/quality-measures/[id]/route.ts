/**
 * API Route: /api/quality-measures/[id]
 * GET: Get a single quality measure
 * PUT: Update a quality measure
 * DELETE: Delete a quality measure
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  getQualityMeasureById,
  updateQualityMeasure,
  deleteQualityMeasure,
} from '@/lib/db/quality-measures';
import { updateQualityMeasureSchema } from '@/lib/validations/quality-measures';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const measure = await getQualityMeasureById(params.id);

    if (!measure) {
      return NextResponse.json(
        { error: 'Quality measure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(measure);
  } catch (error: any) {
    console.error('Error fetching quality measure:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality measure', details: error.message },
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
    const validatedData = updateQualityMeasureSchema.parse({
      id: params.id,
      ...body,
    });

    // Update measure
    const measure = await updateQualityMeasure(validatedData);

    return NextResponse.json(measure);
  } catch (error: any) {
    console.error('Error updating quality measure:', error);
    return NextResponse.json(
      { error: 'Failed to update quality measure', details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteQualityMeasure(params.id);

    return NextResponse.json({ success: true, message: 'Quality measure deleted' });
  } catch (error: any) {
    console.error('Error deleting quality measure:', error);
    return NextResponse.json(
      { error: 'Failed to delete quality measure', details: error.message },
      { status: 400 }
    );
  }
}

