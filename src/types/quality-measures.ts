/**
 * TypeScript types for Quality Measures (HEDIS, MIPS, etc.)
 */

// Enums matching Prisma schema
export enum QualityProgram {
  HEDIS = 'HEDIS',
  MIPS = 'MIPS',
  PQRS = 'PQRS',
  NQF = 'NQF',
  CMS_STAR = 'CMS_STAR',
  CUSTOM = 'CUSTOM',
}

export enum MeasureDomain {
  EFFECTIVENESS_OF_CARE = 'EFFECTIVENESS_OF_CARE',
  ACCESS_AVAILABILITY = 'ACCESS_AVAILABILITY',
  EXPERIENCE_OF_CARE = 'EXPERIENCE_OF_CARE',
  UTILIZATION = 'UTILIZATION',
  HEALTH_PLAN_DESCRIPTIVE = 'HEALTH_PLAN_DESCRIPTIVE',
  CLINICAL_DATA_SYSTEMS = 'CLINICAL_DATA_SYSTEMS',
  PREVENTION = 'PREVENTION',
  CHRONIC_CARE = 'CHRONIC_CARE',
  BEHAVIORAL_HEALTH = 'BEHAVIORAL_HEALTH',
  PATIENT_SAFETY = 'PATIENT_SAFETY',
}

export enum MeasureStatus {
  ACTIVE = 'ACTIVE',
  RETIRED = 'RETIRED',
  DRAFT = 'DRAFT',
  DEPRECATED = 'DEPRECATED',
}

export enum LogicType {
  DENOMINATOR = 'DENOMINATOR',
  NUMERATOR = 'NUMERATOR',
  EXCLUSION = 'EXCLUSION',
  EXCEPTION = 'EXCEPTION',
  STRATIFICATION = 'STRATIFICATION',
}

// Quality Measure
export interface QualityMeasure {
  id: string;
  measureId: string;
  name: string;
  description: string;
  program: QualityProgram;
  domain: MeasureDomain;
  version: string;
  effectiveDate: Date;
  retirementDate?: Date | null;
  status: MeasureStatus;
  
  // Metadata
  nqfNumber?: string | null;
  cmsNumber?: string | null;
  steward?: string | null;
  
  // Reporting
  reportingMethod?: string | null;
  measureType?: string | null;
  
  // Performance
  nationalBenchmark?: number | null;
  targetRate?: number | null;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  measureLogic?: MeasureLogic[];
  productMeasures?: ProductMeasure[];
}

// Value Set
export interface ValueSet {
  id: string;
  valueSetId: string;
  name: string;
  description?: string | null;
  oid?: string | null;
  version: string;
  purpose?: string | null;
  effectiveDate: Date;
  expirationDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  codes?: ValueSetCode[];
  measureLogic?: MeasureLogic[];
}

// Value Set Code (link between value sets and codes)
export interface ValueSetCode {
  id: string;
  valueSetId: string;
  codeSetId: string;
  included: boolean;
  notes?: string | null;
  createdAt: Date;
  
  // Relations (optional)
  valueSet?: ValueSet;
  codeSet?: {
    id: string;
    code: string;
    codeType: string;
    description: string;
    category?: string | null;
  };
}

// Measure Logic
export interface MeasureLogic {
  id: string;
  measureId: string;
  logicType: LogicType;
  sequence: number;
  
  // Value Set Reference
  valueSetId?: string | null;
  
  // Logic Operators
  operator?: string | null;
  timeframeValue?: number | null;
  timeframeUnit?: string | null;
  
  // Demographics
  ageMin?: number | null;
  ageMax?: number | null;
  gender?: string | null;
  
  // Additional Criteria
  criteriaJson?: Record<string, any> | null;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  measure?: QualityMeasure;
  valueSet?: ValueSet;
}

// Product Measure (link between products and measures)
export interface ProductMeasure {
  id: string;
  productId: string;
  measureId: string;
  isRequired: boolean;
  reportingYear: number;
  targetRate?: number | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  product?: {
    id: string;
    productId: string;
    name: string;
  };
  measure?: QualityMeasure;
}

// Search/Filter Types
export interface QualityMeasureFilters {
  program?: QualityProgram[];
  domain?: MeasureDomain[];
  status?: MeasureStatus[];
  search?: string;
  steward?: string;
  effectiveYear?: number;
  page?: number;
  pageSize?: number;
  sortBy?: 'measureId' | 'name' | 'program' | 'domain' | 'effectiveDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ValueSetFilters {
  purpose?: string;
  search?: string;
  oid?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'valueSetId' | 'name' | 'effectiveDate';
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface QualityMeasureSearchResult {
  measures: QualityMeasure[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ValueSetSearchResult {
  valueSets: ValueSet[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Statistics
export interface QualityMeasureStatistics {
  totalMeasures: number;
  activeCount: number;
  draftCount: number;
  retiredCount: number;
  byProgram: Record<QualityProgram, number>;
  byDomain: Record<MeasureDomain, number>;
  bySteward: Record<string, number>;
  recentlyAdded: number;
  recentlyUpdated: number;
}

export interface ValueSetStatistics {
  totalValueSets: number;
  totalCodes: number;
  averageCodesPerSet: number;
  byPurpose: Record<string, number>;
  recentlyAdded: number;
}

// Create/Update Types
export interface CreateQualityMeasureInput {
  measureId: string;
  name: string;
  description: string;
  program: QualityProgram;
  domain: MeasureDomain;
  version?: string;
  effectiveDate: Date;
  retirementDate?: Date;
  status?: MeasureStatus;
  nqfNumber?: string;
  cmsNumber?: string;
  steward?: string;
  reportingMethod?: string;
  measureType?: string;
  nationalBenchmark?: number;
  targetRate?: number;
}

export interface UpdateQualityMeasureInput extends Partial<CreateQualityMeasureInput> {
  id: string;
}

export interface CreateValueSetInput {
  valueSetId: string;
  name: string;
  description?: string;
  oid?: string;
  version?: string;
  purpose?: string;
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface UpdateValueSetInput extends Partial<CreateValueSetInput> {
  id: string;
}

export interface CreateMeasureLogicInput {
  measureId: string;
  logicType: LogicType;
  sequence?: number;
  valueSetId?: string;
  operator?: string;
  timeframeValue?: number;
  timeframeUnit?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  criteriaJson?: Record<string, any>;
}

export interface AddCodesToValueSetInput {
  valueSetId: string;
  codeSetIds: string[];
  included?: boolean;
  notes?: string;
}

// Measure Logic Summary (for display)
export interface MeasureLogicSummary {
  measureId: string;
  denominator: {
    description: string;
    valueSets: string[];
    ageRange?: { min?: number; max?: number };
    gender?: string;
  };
  numerator: {
    description: string;
    options: Array<{
      valueSets: string[];
      timeframe?: { value: number; unit: string };
      operator?: string;
    }>;
  };
  exclusions: {
    description: string;
    valueSets: string[];
  };
}

