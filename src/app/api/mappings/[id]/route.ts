/**
 * API Route: /api/mappings/[id]
 * GET: Get a specific mapping
 * PATCH: Update a mapping
 * DELETE: Delete a mapping
 */
import { NextRequest, NextResponse } from 'next/server';
import { getMappingById, updateMapping, deleteMapping } from '@/lib/db/mappings';
import { codeMappingSchema } from '@/lib/validations/mapping';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const mapping = await getMappingById(params.id);

    if (!mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    return NextResponse.json(mapping);
  } catch (error: any) {
    console.error('Error fetching mapping:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mapping', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json();

    // Validate input (partial update allowed)
    const validatedData = codeMappingSchema.partial().parse(body);

    // Update mapping
    const mapping = await updateMapping(params.id, validatedData);

    return NextResponse.json(mapping);
  } catch (error: any) {
    console.error('Error updating mapping:', error);
    return NextResponse.json(
      { error: 'Failed to update mapping', details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await deleteMapping(params.id);

    return NextResponse.json({ success: true, message: 'Mapping deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting mapping:', error);
    return NextResponse.json(
      { error: 'Failed to delete mapping', details: error.message },
      { status: 400 }
    );
  }
}

