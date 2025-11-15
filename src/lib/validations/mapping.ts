/**
 * Validation schemas for Code-to-Benefit Mappings
 */
import { z } from 'zod';
import { MappingType, MappingStatus } from '@/types/mappings';

// Enum schemas
export const mappingTypeSchema = z.nativeEnum(MappingType);
export const mappingStatusSchema = z.nativeEnum(MappingStatus);

// Code Mapping Schema
export const codeMappingSchema = z.object({
  mappingType: mappingTypeSchema,
  status: mappingStatusSchema.default(MappingStatus.DRAFT),
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional().nullable(),
  priority: z.number().int().min(0).max(100).default(50),
  medicalCodeId: z.string().uuid('Invalid medical code ID'),
  benefitId: z.string().uuid('Invalid benefit ID'),
  rules: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CodeMappingInput = z.infer<typeof codeMappingSchema>;

// Bulk Mapping Schema
export const bulkMappingSchema = z.object({
  medicalCodeIds: z.array(z.string().uuid()).min(1, 'At least one code required'),
  benefitId: z.string().uuid('Invalid benefit ID'),
  mappingType: mappingTypeSchema,
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional(),
  priority: z.number().int().min(0).max(100).default(50),
  rules: z.record(z.any()).optional(),
});

export type BulkMappingInput = z.infer<typeof bulkMappingSchema>;

// Mapping Search Schema
export const mappingSearchSchema = z.object({
  mappingType: z.array(mappingTypeSchema).optional(),
  status: z.array(mappingStatusSchema).optional(),
  codeType: z.array(z.string()).optional(),
  benefitCategory: z.string().optional(),
  search: z.string().optional(),
  effectiveDateFrom: z.coerce.date().optional(),
  effectiveDateTo: z.coerce.date().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(25),
  sortBy: z.enum(['effectiveDate', 'priority', 'createdAt']).default('effectiveDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type MappingSearchInput = z.infer<typeof mappingSearchSchema>;

