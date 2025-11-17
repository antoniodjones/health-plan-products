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
  mappingType: string;
  isActive: boolean;
  priority: number;
  rules?: Record<string, any>;
  metadata?: Record<string, any>;
  
  // Code Set relation
  codeSetId: string;
  codeSet?: {
    id: string;
    code: string;
    codeType: string;
    description: string;
  };
  
  // Benefit Segment relation
  benefitSegmentId: string;
  benefitSegment?: {
    id: string;
    name: string;
    category: string;
  };
  
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
  codeSetIds: string[];
  benefitSegmentId: string;
  mappingType: string;
  priority?: number;
  rules?: Record<string, any>;
}

// Mapping conflicts
export interface MappingConflict {
  codeId: string;
  code: string;
  existingMappings: {
    id: string;
    benefitSegmentId: string;
    benefitName: string;
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

