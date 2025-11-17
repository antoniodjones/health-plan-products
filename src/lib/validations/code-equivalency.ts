/**
 * Code Equivalency Validation Schemas (Epic 8)
 * Zod schemas for validating code equivalency inputs
 */

import { z } from 'zod';
import {
  EquivalencyCategory,
  EquivalencySource,
  EquivalencyRelationship,
} from '@/types/code-equivalency';

// ============================================================================
// Enum Schemas
// ============================================================================

export const equivalencyCategorySchema = z.nativeEnum(EquivalencyCategory);
export const equivalencySourceSchema = z.nativeEnum(EquivalencySource);
export const equivalencyRelationshipSchema = z.nativeEnum(EquivalencyRelationship);

// ============================================================================
// Code Equivalency Schemas
// ============================================================================

export const createCodeEquivalencySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required').max(1000),
  category: equivalencyCategorySchema,
  source: equivalencySourceSchema.optional().default(EquivalencySource.MANUAL),
  confidence: z.number().min(0).max(1).optional().default(1.0),
  createdBy: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateCodeEquivalencySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  category: equivalencyCategorySchema.optional(),
  source: equivalencySourceSchema.optional(),
  confidence: z.number().min(0).max(1).optional(),
  metadata: z.record(z.any()).optional(),
});

export const codeEquivalencySearchSchema = z.object({
  query: z.string().optional(),
  category: equivalencyCategorySchema.optional(),
  source: equivalencySourceSchema.optional(),
  minConfidence: z.number().min(0).max(1).optional(),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(25),
  sortBy: z.enum(['name', 'category', 'confidence', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// ============================================================================
// Equivalency Mapping Schemas
// ============================================================================

export const createEquivalencyMappingSchema = z.object({
  equivalencyId: z.string().uuid('Invalid equivalency ID'),
  sourceCodeId: z.string().uuid('Invalid source code ID'),
  targetCodeId: z.string().uuid('Invalid target code ID'),
  relationship: equivalencyRelationshipSchema,
  bidirectional: z.boolean().optional().default(true),
  confidence: z.number().min(0).max(1).optional().default(1.0),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
}).refine((data) => {
  // Source and target must be different
  return data.sourceCodeId !== data.targetCodeId;
}, {
  message: 'Source and target codes must be different',
  path: ['targetCodeId'],
}).refine((data) => {
  // If validTo is provided, it must be after validFrom
  if (data.validTo && data.validFrom) {
    return data.validTo > data.validFrom;
  }
  return true;
}, {
  message: 'Valid-to date must be after valid-from date',
  path: ['validTo'],
});

export const updateEquivalencyMappingSchema = z.object({
  relationship: equivalencyRelationshipSchema.optional(),
  bidirectional: z.boolean().optional(),
  confidence: z.number().min(0).max(1).optional(),
  validTo: z.coerce.date().optional(),
});

// ============================================================================
// Query Schemas
// ============================================================================

export const findEquivalentCodesSchema = z.object({
  codeType: z.string().min(1, 'Code type is required'),
  code: z.string().min(1, 'Code is required'),
  includeRelationships: z.array(equivalencyRelationshipSchema).optional(),
});

export const compareCodesSchema = z.object({
  code1: z.object({
    codeType: z.string().min(1),
    code: z.string().min(1),
  }),
  code2: z.object({
    codeType: z.string().min(1),
    code: z.string().min(1),
  }),
});

export const bulkCodeLookupSchema = z.object({
  codes: z.array(z.object({
    codeType: z.string().min(1),
    code: z.string().min(1),
  })).min(1, 'At least one code is required').max(100, 'Maximum 100 codes per request'),
});

// ============================================================================
// Deduplication Schemas
// ============================================================================

export const incomingHealthEventSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  eventSource: z.enum(['claim', 'emr', 'lab', 'rx']),
  eventId: z.string().min(1, 'Event ID is required'),
  eventDate: z.coerce.date(),
  codeType: z.string().min(1, 'Code type is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const deduplicationConfigSchema = z.object({
  temporalWindowHours: z.number().int().positive().max(168).optional().default(72), // max 7 days
  enableCodeEquivalency: z.boolean().optional().default(true),
  sourcePriority: z.array(z.enum(['emr', 'lab', 'claim', 'rx'])).optional().default(['emr', 'lab', 'claim', 'rx']),
  minConfidenceThreshold: z.number().min(0).max(1).optional().default(0.9),
});

// ============================================================================
// Import/Export Schemas
// ============================================================================

export const codeEquivalencyImportRowSchema = z.object({
  sourceCodeType: z.string().min(1, 'Source code type is required'),
  sourceCode: z.string().min(1, 'Source code is required'),
  sourceDescription: z.string().optional(),
  targetCodeType: z.string().min(1, 'Target code type is required'),
  targetCode: z.string().min(1, 'Target code is required'),
  targetDescription: z.string().optional(),
  relationship: equivalencyRelationshipSchema,
  equivalencyName: z.string().optional(),
  equivalencyCategory: equivalencyCategorySchema.optional(),
  confidence: z.number().min(0).max(1).optional().default(1.0),
});

export const codeEquivalencyExportOptionsSchema = z.object({
  category: equivalencyCategorySchema.optional(),
  source: equivalencySourceSchema.optional(),
  minConfidence: z.number().min(0).max(1).optional(),
  format: z.enum(['csv', 'json', 'excel']).default('csv'),
});

// ============================================================================
// Statistics Schemas
// ============================================================================

export const statisticsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  category: equivalencyCategorySchema.optional(),
  source: equivalencySourceSchema.optional(),
});

export const deduplicationStatsQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  groupBy: z.enum(['day', 'week', 'month']).optional().default('day'),
}).refine((data) => {
  return data.endDate >= data.startDate;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateCodeEquivalencyInput = z.infer<typeof createCodeEquivalencySchema>;
export type UpdateCodeEquivalencyInput = z.infer<typeof updateCodeEquivalencySchema>;
export type CodeEquivalencySearchParams = z.infer<typeof codeEquivalencySearchSchema>;
export type CreateEquivalencyMappingInput = z.infer<typeof createEquivalencyMappingSchema>;
export type UpdateEquivalencyMappingInput = z.infer<typeof updateEquivalencyMappingSchema>;
export type FindEquivalentCodesInput = z.infer<typeof findEquivalentCodesSchema>;
export type CompareCodesInput = z.infer<typeof compareCodesSchema>;
export type BulkCodeLookupInput = z.infer<typeof bulkCodeLookupSchema>;
export type IncomingHealthEventInput = z.infer<typeof incomingHealthEventSchema>;
export type DeduplicationConfigInput = z.infer<typeof deduplicationConfigSchema>;
export type CodeEquivalencyImportRow = z.infer<typeof codeEquivalencyImportRowSchema>;
export type CodeEquivalencyExportOptions = z.infer<typeof codeEquivalencyExportOptionsSchema>;
export type StatisticsQuery = z.infer<typeof statisticsQuerySchema>;
export type DeduplicationStatsQuery = z.infer<typeof deduplicationStatsQuerySchema>;

