/**
 * API Route: /api/codes/import/validate
 * POST: Validate uploaded code import file
 */
import { NextRequest, NextResponse } from 'next/server';
import { parseFile, validateHeaders, mapRowToSchema } from '@/lib/utils/csv-parser';
import {
  validateImportRows,
  REQUIRED_IMPORT_HEADERS,
  OPTIONAL_IMPORT_HEADERS,
} from '@/lib/utils/code-import-validator';
import type { ImportCodeRow } from '@/types/codes';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse file
    const { headers, rows } = await parseFile(file);

    // Validate headers
    const headerValidation = validateHeaders(
      headers,
      REQUIRED_IMPORT_HEADERS,
      OPTIONAL_IMPORT_HEADERS
    );

    if (!headerValidation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid file headers',
          missing: headerValidation.missing,
          extra: headerValidation.extra,
        },
        { status: 400 }
      );
    }

    // Map rows to import schema
    const headerMapping: Record<string, string> = {};
    [...REQUIRED_IMPORT_HEADERS, ...OPTIONAL_IMPORT_HEADERS].forEach((header) => {
      const matchingHeader = headers.find(
        (h) => h.toLowerCase().trim() === header.toLowerCase()
      );
      if (matchingHeader) {
        headerMapping[header] = matchingHeader;
      }
    });

    const mappedRows = rows.map((row) =>
      mapRowToSchema<Partial<ImportCodeRow>>(row, headerMapping)
    );

    // Validate rows
    const validationResult = await validateImportRows(mappedRows);

    return NextResponse.json({
      ...validationResult,
      totalRows: rows.length,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error('Error validating import:', error);
    return NextResponse.json(
      { error: 'Failed to validate import file', details: error.message },
      { status: 400 }
    );
  }
}

