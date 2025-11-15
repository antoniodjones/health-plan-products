/**
 * API Route: /api/codes/import/template
 * GET: Download CSV template for code imports
 */
import { NextRequest, NextResponse } from 'next/server';
import { getImportTemplate } from '@/lib/utils/code-import-validator';

export async function GET(request: NextRequest) {
  try {
    const headers = getImportTemplate();

    // Create sample row
    const sampleRow = [
      'J44.0',
      'ICD_10',
      'Chronic obstructive pulmonary disease with acute lower respiratory infection',
      'Full diagnostic description here',
      'Respiratory',
      'COPD',
      '2024-01-01',
      '',
      'ACTIVE',
    ];

    // Build CSV content
    const csvRows = [headers.join(','), sampleRow.join(',')];
    const csvContent = csvRows.join('\n');

    // Return as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="code-import-template.csv"',
      },
    });
  } catch (error: any) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template', details: error.message },
      { status: 500 }
    );
  }
}

