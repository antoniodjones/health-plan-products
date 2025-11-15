/**
 * Validation logic for code imports
 */
import { ImportCodeRow, ImportValidationError, ImportValidationResult } from '@/types/codes';
import { importCodeRowSchema } from '@/lib/validations/code';
import { codeExists } from '@/lib/db/codes';
import { ZodError } from 'zod';

/**
 * Validate a single import row
 */
async function validateRow(
  row: any,
  rowIndex: number
): Promise<{ valid: boolean; errors: ImportValidationError[]; data?: ImportCodeRow }> {
  const errors: ImportValidationError[] = [];

  try {
    // Validate with Zod schema
    const data = importCodeRowSchema.parse(row);

    // Check for duplicate codes (if needed)
    // This is a simple check - you can expand based on requirements

    return { valid: true, errors: [], data };
  } catch (error) {
    if (error instanceof ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          row: rowIndex,
          field: err.path.join('.'),
          message: err.message,
        });
      });
    } else {
      errors.push({
        row: rowIndex,
        field: 'general',
        message: 'Unexpected validation error',
      });
    }

    return { valid: false, errors };
  }
}

/**
 * Validate batch of import rows
 */
export async function validateImportRows(
  rows: any[]
): Promise<ImportValidationResult> {
  const validRows: ImportCodeRow[] = [];
  const allErrors: ImportValidationError[] = [];

  for (let i = 0; i < rows.length; i++) {
    const { valid, errors, data } = await validateRow(rows[i], i + 1);

    if (valid && data) {
      validRows.push(data);
    } else {
      allErrors.push(...errors);
    }
  }

  return {
    valid: allErrors.length === 0,
    validCount: validRows.length,
    errorCount: allErrors.length,
    errors: allErrors,
    preview: validRows.slice(0, 10), // First 10 valid rows for preview
  };
}

/**
 * Check for duplicate codes in database
 */
export async function checkDuplicates(
  codes: ImportCodeRow[]
): Promise<{ code: string; codeType: string; exists: boolean }[]> {
  const results = await Promise.all(
    codes.map(async (row) => ({
      code: row.code,
      codeType: row.codeType,
      exists: await codeExists(row.code, row.codeType),
    }))
  );

  return results;
}

/**
 * Required headers for import
 */
export const REQUIRED_IMPORT_HEADERS = [
  'code',
  'codeType',
  'description',
  'effectiveDate',
];

/**
 * Optional headers for import
 */
export const OPTIONAL_IMPORT_HEADERS = [
  'longDescription',
  'category',
  'subcategory',
  'expirationDate',
  'status',
];

/**
 * Get import template headers
 */
export function getImportTemplate(): string[] {
  return [...REQUIRED_IMPORT_HEADERS, ...OPTIONAL_IMPORT_HEADERS];
}

