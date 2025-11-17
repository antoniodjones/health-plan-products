/**
 * Code Equivalency Types (Epic 8)
 * Type definitions for code equivalency mappings and deduplication
 */

import { Prisma } from '@prisma/client';

// ============================================================================
// Prisma Extended Types
// ============================================================================

export type CodeEquivalency = Prisma.CodeEquivalencyGetPayload<{
  include: {
    mappings: {
      include: {
        sourceCode: true;
        targetCode: true;
      };
    };
  };
}>;

export type EquivalencyMapping = Prisma.EquivalencyMappingGetPayload<{
  include: {
    sourceCode: true;
    targetCode: true;
    equivalency: true;
  };
}>;

export type DeduplicationEvent = Prisma.DeduplicationEventGetPayload<{}>;

// ============================================================================
// Enums
// ============================================================================

export enum EquivalencyCategory {
  LABORATORY = 'LABORATORY',
  PROCEDURE = 'PROCEDURE',
  DIAGNOSIS = 'DIAGNOSIS',
  MEDICATION = 'MEDICATION',
  OBSERVATION = 'OBSERVATION',
  SERVICE = 'SERVICE',
  SUPPLY = 'SUPPLY',
  DME = 'DME',
}

export enum EquivalencySource {
  MANUAL = 'MANUAL',
  CMS_CROSSWALK = 'CMS_CROSSWALK',
  NLM_UMLS = 'NLM_UMLS',
  AI_SUGGESTED = 'AI_SUGGESTED',
  IMPORTED = 'IMPORTED',
}

export enum EquivalencyRelationship {
  EXACT = 'EXACT',
  BROADER = 'BROADER',
  NARROWER = 'NARROWER',
  RELATED = 'RELATED',
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateCodeEquivalencyInput {
  name: string;
  description: string;
  category: EquivalencyCategory;
  source?: EquivalencySource;
  confidence?: number;
  createdBy?: string;
  metadata?: Record<string, any>;
}

export interface CreateEquivalencyMappingInput {
  equivalencyId: string;
  sourceCodeId: string;
  targetCodeId: string;
  relationship: EquivalencyRelationship;
  bidirectional?: boolean;
  confidence?: number;
  validFrom?: Date;
  validTo?: Date;
}

export interface UpdateCodeEquivalencyInput {
  name?: string;
  description?: string;
  category?: EquivalencyCategory;
  source?: EquivalencySource;
  confidence?: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// Query & Search Types
// ============================================================================

export interface CodeEquivalencySearchParams {
  query?: string;
  category?: EquivalencyCategory;
  source?: EquivalencySource;
  minConfidence?: number;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'category' | 'confidence' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CodeEquivalencySearchResult {
  equivalencies: CodeEquivalency[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FindEquivalentCodesInput {
  codeType: string;
  code: string;
  includeRelationships?: EquivalencyRelationship[];
}

export interface EquivalentCodeResult {
  codeType: string;
  code: string;
  description: string;
  relationship: EquivalencyRelationship;
  confidence: number;
  equivalencyId: string;
  equivalencyName: string;
}

export interface CodeEquivalencyLookupResult {
  found: boolean;
  equivalency?: {
    id: string;
    name: string;
    category: EquivalencyCategory;
    confidence: number;
    mappings: {
      codeType: string;
      code: string;
      description: string;
      relationship: EquivalencyRelationship;
    }[];
  };
}

export interface CompareCodesInput {
  code1: {
    codeType: string;
    code: string;
  };
  code2: {
    codeType: string;
    code: string;
  };
}

export interface CompareCodesResult {
  areEquivalent: boolean;
  equivalencyId?: string;
  equivalencyName?: string;
  relationship?: EquivalencyRelationship;
  confidence?: number;
}

export interface BulkCodeLookupInput {
  codes: {
    codeType: string;
    code: string;
  }[];
}

export interface BulkCodeLookupResult {
  results: {
    codeType: string;
    code: string;
    found: boolean;
    equivalency?: CodeEquivalencyLookupResult['equivalency'];
  }[];
}

// ============================================================================
// Deduplication Types
// ============================================================================

export interface IncomingHealthEvent {
  memberId: string;
  eventSource: 'claim' | 'emr' | 'lab' | 'rx';
  eventId: string;
  eventDate: Date;
  codeType: string;
  code: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface DeduplicationCheckResult {
  isDuplicate: boolean;
  matchType?: 'exact_code' | 'equivalent_code' | 'temporal_proximity' | 'none';
  confidence: number;
  primaryEvent?: {
    id: string;
    source: string;
    eventId: string;
    eventDate: Date;
    code: string;
  };
  duplicateCount: number;
}

export interface DeduplicationServiceConfig {
  temporalWindowHours: number; // default: 72
  enableCodeEquivalency: boolean; // default: true
  sourcePriority: ('emr' | 'lab' | 'claim' | 'rx')[]; // default: ['emr', 'lab', 'claim', 'rx']
  minConfidenceThreshold: number; // default: 0.9
}

// ============================================================================
// Statistics & Analytics Types
// ============================================================================

export interface CodeEquivalencyStatistics {
  totalEquivalencies: number;
  byCategory: {
    category: EquivalencyCategory;
    count: number;
  }[];
  bySource: {
    source: EquivalencySource;
    count: number;
  }[];
  totalMappings: number;
  averageConfidence: number;
  coverageRate: number; // % of active codes with equivalencies
}

export interface DeduplicationStatistics {
  totalEventsReceived: number;
  uniqueEvents: number;
  duplicatesPrevented: number;
  deduplicationRate: number; // percentage
  alertsAvoided: number;
  timeSavedMinutes: number;
  byMatchType: {
    matchType: string;
    count: number;
    percentage: number;
  }[];
  bySource: {
    source: string;
    received: number;
    duplicates: number;
  }[];
}

// ============================================================================
// Import/Export Types
// ============================================================================

export interface CodeEquivalencyImportRow {
  sourceCodeType: string;
  sourceCode: string;
  sourceDescription?: string;
  targetCodeType: string;
  targetCode: string;
  targetDescription?: string;
  relationship: EquivalencyRelationship;
  equivalencyName?: string;
  equivalencyCategory?: EquivalencyCategory;
  confidence?: number;
}

export interface CodeEquivalencyImportResult {
  successCount: number;
  errorCount: number;
  errors: {
    row: number;
    code: string;
    message: string;
  }[];
  equivalenciesCreated: number;
  mappingsCreated: number;
}

export interface CodeEquivalencyExportOptions {
  category?: EquivalencyCategory;
  source?: EquivalencySource;
  minConfidence?: number;
  format: 'csv' | 'json' | 'excel';
}

// ============================================================================
// Network Graph Types (for visualization)
// ============================================================================

export interface CodeEquivalencyNode {
  id: string;
  codeType: string;
  code: string;
  description: string;
  category: string;
  group: number; // for graph coloring
}

export interface CodeEquivalencyEdge {
  source: string; // node id
  target: string; // node id
  relationship: EquivalencyRelationship;
  confidence: number;
  bidirectional: boolean;
}

export interface CodeEquivalencyGraph {
  nodes: CodeEquivalencyNode[];
  edges: CodeEquivalencyEdge[];
  orphanNodes: CodeEquivalencyNode[]; // codes without equivalencies
}

