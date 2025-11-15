/**
 * Zod validation schemas for Quality Measures
 */
import { z } from 'zod';
import {
  QualityProgram,
  MeasureDomain,
  MeasureStatus,
  LogicType,
} from '@/types/quality-measures';

// Enum schemas
export const qualityProgramSchema = z.nativeEnum(QualityProgram);
export const measureDomainSchema = z.nativeEnum(MeasureDomain);
export const measureStatusSchema = z.nativeEnum(MeasureStatus);
export const logicTypeSchema = z.nativeEnum(LogicType);

// Quality Measure schemas
export const createQualityMeasureSchema = z.object({
  measureId: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  program: qualityProgramSchema,
  domain: measureDomainSchema,
  version: z.string().default('1.0'),
  effectiveDate: z.coerce.date(),
  retirementDate: z.coerce.date().optional(),
  status: measureStatusSchema.default(MeasureStatus.DRAFT),
  nqfNumber: z.string().optional(),
  cmsNumber: z.string().optional(),
  steward: z.string().optional(),
  reportingMethod: z.string().optional(),
  measureType: z.string().optional(),
  nationalBenchmark: z.number().min(0).max(100).optional(),
  targetRate: z.number().min(0).max(100).optional(),
});

export const updateQualityMeasureSchema = z.object({
  id: z.string().uuid(),
  measureId: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  program: qualityProgramSchema.optional(),
  domain: measureDomainSchema.optional(),
  version: z.string().optional(),
  effectiveDate: z.coerce.date().optional(),
  retirementDate: z.coerce.date().optional().nullable(),
  status: measureStatusSchema.optional(),
  nqfNumber: z.string().optional().nullable(),
  cmsNumber: z.string().optional().nullable(),
  steward: z.string().optional().nullable(),
  reportingMethod: z.string().optional().nullable(),
  measureType: z.string().optional().nullable(),
  nationalBenchmark: z.number().min(0).max(100).optional().nullable(),
  targetRate: z.number().min(0).max(100).optional().nullable(),
});

export const qualityMeasureSearchSchema = z.object({
  program: z.array(qualityProgramSchema).optional(),
  domain: z.array(measureDomainSchema).optional(),
  status: z.array(measureStatusSchema).optional(),
  search: z.string().optional(),
  steward: z.string().optional(),
  effectiveYear: z.number().int().min(2000).max(2100).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  sortBy: z.enum(['measureId', 'name', 'program', 'domain', 'effectiveDate']).default('measureId'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Value Set schemas
export const createValueSetSchema = z.object({
  valueSetId: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  oid: z.string().optional(), // e.g., "2.16.840.1.113883.3.464.1003.103.12.1001"
  version: z.string().default('1.0'),
  purpose: z.string().optional(), // "Denominator", "Numerator", "Exclusion"
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional(),
});

export const updateValueSetSchema = z.object({
  id: z.string().uuid(),
  valueSetId: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  oid: z.string().optional().nullable(),
  version: z.string().optional(),
  purpose: z.string().optional().nullable(),
  effectiveDate: z.coerce.date().optional(),
  expirationDate: z.coerce.date().optional().nullable(),
});

export const valueSetSearchSchema = z.object({
  purpose: z.string().optional(),
  search: z.string().optional(),
  oid: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  sortBy: z.enum(['valueSetId', 'name', 'effectiveDate']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Measure Logic schemas
export const createMeasureLogicSchema = z.object({
  measureId: z.string().uuid(),
  logicType: logicTypeSchema,
  sequence: z.number().int().min(0).default(0),
  valueSetId: z.string().uuid().optional(),
  operator: z.enum(['AND', 'OR', 'NOT', 'AT_LEAST_ONE', 'ALL', 'NONE']).optional(),
  timeframeValue: z.number().int().min(1).optional(),
  timeframeUnit: z.enum(['DAYS', 'MONTHS', 'YEARS']).optional(),
  ageMin: z.number().int().min(0).max(120).optional(),
  ageMax: z.number().int().min(0).max(120).optional(),
  gender: z.enum(['M', 'F', 'X']).optional(),
  criteriaJson: z.record(z.any()).optional(),
});

export const updateMeasureLogicSchema = z.object({
  id: z.string().uuid(),
  measureId: z.string().uuid().optional(),
  logicType: logicTypeSchema.optional(),
  sequence: z.number().int().min(0).optional(),
  valueSetId: z.string().uuid().optional().nullable(),
  operator: z.enum(['AND', 'OR', 'NOT', 'AT_LEAST_ONE', 'ALL', 'NONE']).optional().nullable(),
  timeframeValue: z.number().int().min(1).optional().nullable(),
  timeframeUnit: z.enum(['DAYS', 'MONTHS', 'YEARS']).optional().nullable(),
  ageMin: z.number().int().min(0).max(120).optional().nullable(),
  ageMax: z.number().int().min(0).max(120).optional().nullable(),
  gender: z.enum(['M', 'F', 'X']).optional().nullable(),
  criteriaJson: z.record(z.any()).optional().nullable(),
});

// Value Set Code operations
export const addCodesToValueSetSchema = z.object({
  valueSetId: z.string().uuid(),
  codeSetIds: z.array(z.string().uuid()).min(1),
  included: z.boolean().default(true),
  notes: z.string().optional(),
});

export const removeCodesFromValueSetSchema = z.object({
  valueSetId: z.string().uuid(),
  codeSetIds: z.array(z.string().uuid()).min(1),
});

// Product Measure schemas
export const assignMeasureToProductSchema = z.object({
  productId: z.string().uuid(),
  measureId: z.string().uuid(),
  isRequired: z.boolean().default(false),
  reportingYear: z.number().int().min(2000).max(2100),
  targetRate: z.number().min(0).max(100).optional(),
});

export const updateProductMeasureSchema = z.object({
  id: z.string().uuid(),
  isRequired: z.boolean().optional(),
  reportingYear: z.number().int().min(2000).max(2100).optional(),
  targetRate: z.number().min(0).max(100).optional().nullable(),
});

// Bulk operations
export const bulkAssignMeasuresSchema = z.object({
  productId: z.string().uuid(),
  measureIds: z.array(z.string().uuid()).min(1),
  reportingYear: z.number().int().min(2000).max(2100),
  isRequired: z.boolean().default(false),
  targetRate: z.number().min(0).max(100).optional(),
});

export const bulkImportCodesSchema = z.object({
  valueSetId: z.string().uuid(),
  codes: z.array(z.object({
    code: z.string(),
    codeType: z.string(),
    included: z.boolean().default(true),
  })).min(1),
});

// Export types
export type CreateQualityMeasureInput = z.infer<typeof createQualityMeasureSchema>;
export type UpdateQualityMeasureInput = z.infer<typeof updateQualityMeasureSchema>;
export type QualityMeasureSearchParams = z.infer<typeof qualityMeasureSearchSchema>;
export type CreateValueSetInput = z.infer<typeof createValueSetSchema>;
export type UpdateValueSetInput = z.infer<typeof updateValueSetSchema>;
export type ValueSetSearchParams = z.infer<typeof valueSetSearchSchema>;
export type CreateMeasureLogicInput = z.infer<typeof createMeasureLogicSchema>;
export type UpdateMeasureLogicInput = z.infer<typeof updateMeasureLogicSchema>;
export type AddCodesToValueSetInput = z.infer<typeof addCodesToValueSetSchema>;
export type AssignMeasureToProductInput = z.infer<typeof assignMeasureToProductSchema>;
export type BulkAssignMeasuresInput = z.infer<typeof bulkAssignMeasuresSchema>;

