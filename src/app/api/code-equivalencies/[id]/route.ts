/**
 * Code Equivalency Detail API Routes (Epic 8)
 * GET /api/code-equivalencies/[id] - Get specific equivalency
 * PUT /api/code-equivalencies/[id] - Update equivalency
 * DELETE /api/code-equivalencies/[id] - Delete equivalency
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCodeEquivalencyById,
  updateCodeEquivalency,
  deleteCodeEquivalency,
} from '@/lib/db/code-equivalency';
import { updateCodeEquivalencySchema } from '@/lib/validations/code-equivalency';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equivalency = await getCodeEquivalencyById(params.id);

    if (!equivalency) {
      return NextResponse.json(
        { error: 'Equivalency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(equivalency);
  } catch (error: any) {
    console.error('Error fetching code equivalency:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch code equivalency' },
      { status: 500 }
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
    const validatedData = updateCodeEquivalencySchema.parse(body);

    // Update equivalency
    const equivalency = await updateCodeEquivalency(params.id, validatedData);

    return NextResponse.json(equivalency);
  } catch (error: any) {
    console.error('Error updating code equivalency:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update code equivalency' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCodeEquivalency(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting code equivalency:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete code equivalency' },
      { status: 500 }
    );
  }
}

