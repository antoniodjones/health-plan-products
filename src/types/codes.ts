/**
 * Type definitions for Code Management System
 */

// Code Types (from Prisma schema)
export enum CodeType {
  ICD_10 = 'ICD_10',
  CPT = 'CPT',
  HCPCS = 'HCPCS',
  NDC = 'NDC',
  REVENUE = 'REVENUE',
  DRG = 'DRG',
  LOINC = 'LOINC',
  SNOMED = 'SNOMED',
  CUSTOM = 'CUSTOM',
}

export enum CodeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
  PENDING = 'PENDING',
}

export enum CodeSource {
  CMS = 'CMS',
  AMA = 'AMA',
  WHO = 'WHO',
  FDA = 'FDA',
  INTERNAL = 'INTERNAL',
  IMPORTED = 'IMPORTED',
}

// Frontend Types
export interface MedicalCode {
  id: string;
  code: string;
  codeType: CodeType;
  description: string;
  longDescription?: string | null;
  category?: string | null;
  subcategory?: string | null;
  status: CodeStatus;
  isActive: boolean; // Database field
  effectiveDate: Date;
  terminationDate?: Date | null; // Database field (replaces expirationDate)
  expirationDate?: Date | null;
  version?: string; // Database field
  sourceSystem?: string | null; // Database field (replaces source)
  source: CodeSource;
  sourceVersion?: string | null;
  additionalData?: Record<string, any>;
  metadata?: Record<string, any>;
  isCustom: boolean;
  customCodePrefix?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeCategory {
  type: CodeType;
  name: string;
  description: string;
  count: number;
  icon: string;
}

export interface CodeFilters {
  codeType?: CodeType[];
  status?: CodeStatus[];
  source?: CodeSource[];
  category?: string;
  search?: string;
  effectiveDateFrom?: Date;
  effectiveDateTo?: Date;
  isCustom?: boolean;
}

export interface CodeSearchParams extends CodeFilters {
  page?: number;
  pageSize?: number;
  sortBy?: 'code' | 'description' | 'effectiveDate' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CodeSearchResult {
  codes: MedicalCode[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Import Types
export interface ImportCodeRow {
  code: string;
  codeType: CodeType;
  description: string;
  longDescription?: string;
  category?: string;
  subcategory?: string;
  effectiveDate: string;
  expirationDate?: string;
  status?: CodeStatus;
}

export interface ImportValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ImportValidationResult {
  valid: boolean;
  validCount: number;
  errorCount: number;
  errors: ImportValidationError[];
  preview: ImportCodeRow[];
}

export interface ImportProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Custom Code Types
export interface CustomCodePrefix {
  id: string;
  prefix: string;
  description: string;
  codeType: CodeType;
  pattern: string;
  nextNumber: number;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomCodeCreation {
  description: string;
  longDescription?: string;
  category?: string;
  subcategory?: string;
  effectiveDate: Date;
  expirationDate?: Date;
  prefixId: string;
  additionalData?: Record<string, any>;
}

// Code Statistics
export interface CodeStatistics {
  totalCodes: number;
  activeCount: number;
  inactiveCount: number;
  customCount: number;
  byType: Record<CodeType, number>;
  bySource: Record<CodeSource, number>;
  recentlyAdded: number;
  recentlyUpdated: number;
}

