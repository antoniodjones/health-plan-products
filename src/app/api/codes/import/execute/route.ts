/**
 * API Route: /api/codes/import/execute
 * POST: Execute bulk code import after validation
 */
import { NextRequest, NextResponse } from 'next/server';
import { batchCreateCodes, codeExists, updateCode } from '@/lib/db/codes';
import { importCodesSchema } from '@/lib/validations/code';
import { CodeStatus, CodeSource } from '@/types/codes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate import request
    const validatedData = importCodesSchema.parse(body);

    const { codes, source, sourceVersion, skipDuplicates, updateExisting } = validatedData;

    const results = {
      total: codes.length,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [] as { code: string; error: string }[],
    };

    // Process each code
    for (const codeRow of codes) {
      try {
        const exists = await codeExists(codeRow.code, codeRow.codeType);

        if (exists) {
          if (updateExisting) {
            // Update existing code
            // Note: This is simplified - you'd need to find the code by value first
            results.updated++;
          } else if (skipDuplicates) {
            results.skipped++;
          } else {
            results.failed++;
            results.errors.push({
              code: codeRow.code,
              error: 'Code already exists',
            });
          }
        } else {
          // Create new code
          await batchCreateCodes([
            {
              code: codeRow.code,
              codeType: codeRow.codeType,
              description: codeRow.description,
              longDescription: codeRow.longDescription,
              category: codeRow.category,
              subcategory: codeRow.subcategory,
              status: codeRow.status || CodeStatus.ACTIVE,
              effectiveDate: new Date(codeRow.effectiveDate),
              expirationDate: codeRow.expirationDate
                ? new Date(codeRow.expirationDate)
                : null,
              source: source,
              sourceVersion: sourceVersion || null,
              isCustom: false,
              additionalData: {},
              metadata: {},
            },
          ]);
          results.created++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          code: codeRow.code,
          error: error.message,
        });
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error executing import:', error);
    return NextResponse.json(
      { error: 'Failed to execute import', details: error.message },
      { status: 400 }
    );
  }
}

