/**
 * API Route: /api/mappings
 * GET: Search and list code mappings
 * POST: Create a new code mapping
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchMappings, createMapping, checkMappingConflicts } from '@/lib/db/mappings';
import { codeMappingSchema } from '@/lib/validations/mapping';
import { MappingType, MappingStatus } from '@/types/mappings';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params = {
      mappingType: searchParams.getAll('mappingType') as MappingType[],
      status: searchParams.getAll('status') as MappingStatus[],
      codeType: searchParams.getAll('codeType'),
      benefitCategory: searchParams.get('benefitCategory') || undefined,
      search: searchParams.get('search') || undefined,
      effectiveDateFrom: searchParams.get('effectiveDateFrom')
        ? new Date(searchParams.get('effectiveDateFrom')!)
        : undefined,
      effectiveDateTo: searchParams.get('effectiveDateTo')
        ? new Date(searchParams.get('effectiveDateTo')!)
        : undefined,
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
      sortBy: (searchParams.get('sortBy') || 'effectiveDate') as any,
      sortOrder: (searchParams.get('sortOrder') || 'desc') as any,
    };

    // Execute search
    const result = await searchMappings(params);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching mappings:', error);
    return NextResponse.json(
      { error: 'Failed to search mappings', details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = codeMappingSchema.parse(body);

    // Check for conflicts
    const conflicts = await checkMappingConflicts(
      validatedData.medicalCodeId,
      validatedData.benefitId,
      validatedData.effectiveDate,
      validatedData.expirationDate
    );

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: 'Mapping conflicts detected',
          conflicts: conflicts.map((c) => ({
            id: c.id,
            effectiveDate: c.effectiveDate,
            expirationDate: c.expirationDate,
          })),
        },
        { status: 409 }
      );
    }

    // Create mapping
    const mapping = await createMapping({
      mappingType: validatedData.mappingType,
      status: validatedData.status,
      effectiveDate: validatedData.effectiveDate,
      expirationDate: validatedData.expirationDate || null,
      priority: validatedData.priority,
      rules: validatedData.rules || {},
      metadata: validatedData.metadata || {},
      medicalCode: {
        connect: { id: validatedData.medicalCodeId },
      },
      benefit: {
        connect: { id: validatedData.benefitId },
      },
    });

    return NextResponse.json(mapping, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mapping:', error);
    return NextResponse.json(
      { error: 'Failed to create mapping', details: error.message },
      { status: 400 }
    );
  }
}

