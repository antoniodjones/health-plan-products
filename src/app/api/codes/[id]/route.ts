/**
 * API Route: /api/codes/[id]
 * GET: Get a specific medical code
 * PATCH: Update a medical code
 * DELETE: Delete a medical code
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCodeById, updateCode, deleteCode } from '@/lib/db/codes';
import { medicalCodeSchema } from '@/lib/validations/code';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const code = await getCodeById(params.id);

    if (!code) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    return NextResponse.json(code);
  } catch (error: any) {
    console.error('Error fetching code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch code', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json();

    // Validate input (partial update allowed)
    const validatedData = medicalCodeSchema.partial().parse(body);

    // Update code
    const code = await updateCode(params.id, validatedData);

    return NextResponse.json(code);
  } catch (error: any) {
    console.error('Error updating code:', error);
    return NextResponse.json(
      { error: 'Failed to update code', details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await deleteCode(params.id);

    return NextResponse.json({ success: true, message: 'Code deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting code:', error);
    return NextResponse.json(
      { error: 'Failed to delete code', details: error.message },
      { status: 400 }
    );
  }
}

