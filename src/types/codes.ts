/**
 * Type definitions for Code Management System
 * ALIGNED WITH PRISMA SCHEMA - NO EXTRA FIELDS
 */

// Prisma Enums (from schema)
export enum CodeType {
  CPT = 'CPT',
  HCPCS = 'HCPCS',
  ICD_10_CM = 'ICD_10_CM',
  ICD_10_PCS = 'ICD_10_PCS',
  NDC = 'NDC',
  LOINC = 'LOINC',
  SNOMED = 'SNOMED',
  DRG = 'DRG',
  REVENUE_CODE = 'REVENUE_CODE',
  CUSTOM = 'CUSTOM',
}

// Frontend Type - MATCHES CodeSet model exactly
export interface MedicalCode {
  id: string;
  code: string;
  codeType: CodeType;
  description: string;
  longDescription?: string | null;
  category?: string | null;
  isActive: boolean;
  effectiveDate: Date;
  terminationDate?: Date | null;
  version: string;
  sourceSystem?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

// Simple search filters
export interface CodeFilters {
  search?: string;
  codeType?: CodeType[];
  category?: string[];
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Response
export interface CodeSearchResult {
  codes: MedicalCode[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Statistics
export interface CodeStatistics {
  totalCodes: number;
  activeCodes: number;
  inactiveCodes: number;
  codeTypeCount: number;
  byType: Record<string, number>;
}
