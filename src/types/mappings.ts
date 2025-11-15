/**
 * Type definitions for Code-to-Benefit Mappings
 */

export enum MappingType {
  CODE_TO_BENEFIT = 'CODE_TO_BENEFIT',
  CODE_TO_LIMIT = 'CODE_TO_LIMIT',
  CODE_TO_EXCLUSION = 'CODE_TO_EXCLUSION',
  CODE_TO_AUTHORIZATION = 'CODE_TO_AUTHORIZATION',
}

export enum MappingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

// Frontend Types
export interface CodeMapping {
  id: string;
  mappingType: MappingType;
  status: MappingStatus;
  effectiveDate: Date;
  expirationDate?: Date | null;
  priority: number;
  
  // Medical Code relation
  medicalCodeId: string;
  medicalCode?: {
    id: string;
    code: string;
    codeType: string;
    description: string;
  };
  
  // Benefit relation
  benefitId: string;
  benefit?: {
    id: string;
    name: string;
    category: string;
  };
  
  // Mapping rules
  rules?: Record<string, any>;
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface CodeMappingFilters {
  mappingType?: MappingType[];
  status?: MappingStatus[];
  codeType?: string[];
  benefitCategory?: string;
  search?: string;
  effectiveDateFrom?: Date;
  effectiveDateTo?: Date;
}

export interface CodeMappingSearchParams extends CodeMappingFilters {
  page?: number;
  pageSize?: number;
  sortBy?: 'effectiveDate' | 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CodeMappingSearchResult {
  mappings: CodeMapping[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Bulk mapping creation
export interface BulkMappingInput {
  medicalCodeIds: string[];
  benefitId: string;
  mappingType: MappingType;
  effectiveDate: Date;
  expirationDate?: Date;
  priority?: number;
  rules?: Record<string, any>;
}

// Mapping conflicts
export interface MappingConflict {
  codeId: string;
  code: string;
  existingMappings: {
    id: string;
    benefitId: string;
    benefitName: string;
    effectiveDate: Date;
    expirationDate?: Date;
  }[];
  conflictType: 'duplicate' | 'overlap' | 'priority';
}

// Mapping validation
export interface MappingValidationResult {
  valid: boolean;
  conflicts: MappingConflict[];
  warnings: string[];
}

// Mapping statistics
export interface MappingStatistics {
  totalMappings: number;
  activeMappings: number;
  draftMappings: number;
  byType: Record<MappingType, number>;
  byBenefitCategory: Record<string, number>;
  unmappedCodes: number;
  recentlyCreated: number;
}

