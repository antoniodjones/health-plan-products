/**
 * CSV/Excel parser utilities for code imports
 */
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
}

/**
 * Parse CSV file
 */
export async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];
        resolve({ headers, rows });
      },
      error: (error) => {
        reject(new Error(`CSV parse error: ${error.message}`));
      },
    });
  });
}

/**
 * Parse Excel file (.xlsx, .xls)
 */
export async function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'));
          return;
        }

        // First row as headers
        const headers = (jsonData[0] as any[]).map(String);

        // Remaining rows as data
        const rows = (jsonData.slice(1) as any[][]).map((row) => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        resolve({ headers, rows });
      } catch (error: any) {
        reject(new Error(`Excel parse error: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse file based on extension
 */
export async function parseFile(file: File): Promise<ParsedData> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

/**
 * Validate headers match expected schema
 */
export function validateHeaders(
  headers: string[],
  requiredHeaders: string[],
  optionalHeaders: string[] = []
): { valid: boolean; missing: string[]; extra: string[] } {
  const headersSet = new Set(headers.map((h) => h.toLowerCase().trim()));
  const requiredSet = new Set(requiredHeaders.map((h) => h.toLowerCase()));
  const optionalSet = new Set(optionalHeaders.map((h) => h.toLowerCase()));

  const missing: string[] = [];
  requiredSet.forEach((header) => {
    if (!headersSet.has(header)) {
      missing.push(header);
    }
  });

  const extra: string[] = [];
  headersSet.forEach((header) => {
    if (!requiredSet.has(header) && !optionalSet.has(header)) {
      extra.push(header);
    }
  });

  return {
    valid: missing.length === 0,
    missing,
    extra,
  };
}

/**
 * Map row data to expected schema
 */
export function mapRowToSchema<T>(
  row: Record<string, any>,
  mapping: Record<string, string>
): T {
  const mapped: Record<string, any> = {};

  Object.entries(mapping).forEach(([targetKey, sourceKey]) => {
    const value = row[sourceKey];
    if (value !== undefined && value !== null && value !== '') {
      mapped[targetKey] = value;
    }
  });

  return mapped as T;
}

/**
 * Clean and normalize cell values
 */
export function cleanValue(value: any): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const str = String(value).trim();
  return str === '' ? undefined : str;
}

