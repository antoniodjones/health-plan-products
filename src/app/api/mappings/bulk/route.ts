/**
 * API Route: /api/mappings/bulk
 * POST: Create multiple mappings in bulk
 */
import { NextRequest, NextResponse } from 'next/server';
import { bulkCreateMappings, checkMappingConflicts } from '@/lib/db/mappings';
import { bulkMappingSchema } from '@/lib/validations/mapping';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = bulkMappingSchema.parse(body);

    // Check for conflicts
    const conflictChecks = await Promise.all(
      validatedData.medicalCodeIds.map(async (codeId) => {
        const conflicts = await checkMappingConflicts(
          codeId,
          validatedData.benefitId,
          validatedData.effectiveDate,
          validatedData.expirationDate
        );
        return { codeId, conflicts };
      })
    );

    const hasConflicts = conflictChecks.some((check) => check.conflicts.length > 0);

    if (hasConflicts) {
      return NextResponse.json(
        {
          error: 'Mapping conflicts detected',
          conflictDetails: conflictChecks
            .filter((c) => c.conflicts.length > 0)
            .map((c) => ({
              codeId: c.codeId,
              conflicts: c.conflicts.map((conflict) => ({
                id: conflict.id,
                effectiveDate: conflict.effectiveDate,
                expirationDate: conflict.expirationDate,
              })),
            })),
        },
        { status: 409 }
      );
    }

    // Create mappings
    const mappingInputs = validatedData.medicalCodeIds.map((codeId) => ({
      mappingType: validatedData.mappingType,
      status: 'DRAFT' as const,
      effectiveDate: validatedData.effectiveDate,
      expirationDate: validatedData.expirationDate || null,
      priority: validatedData.priority,
      rules: validatedData.rules || {},
      metadata: {},
      medicalCode: {
        connect: { id: codeId },
      },
      benefit: {
        connect: { id: validatedData.benefitId },
      },
    }));

    const mappings = await bulkCreateMappings(mappingInputs);

    return NextResponse.json(
      {
        success: true,
        created: mappings.length,
        mappings,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating bulk mappings:', error);
    return NextResponse.json(
      { error: 'Failed to create bulk mappings', details: error.message },
      { status: 400 }
    );
  }
}

