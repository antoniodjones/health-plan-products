/**
 * Validation schemas for Code Management
 */
import { z } from 'zod';
import { CodeType, CodeStatus, CodeSource } from '@/types/codes';

// Enum schemas
export const codeTypeSchema = z.nativeEnum(CodeType);
export const codeStatusSchema = z.nativeEnum(CodeStatus);
export const codeSourceSchema = z.nativeEnum(CodeSource);

// Medical Code Schema
export const medicalCodeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  codeType: codeTypeSchema,
  description: z.string().min(1, 'Description is required').max(500),
  longDescription: z.string().max(2000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  subcategory: z.string().max(100).optional().nullable(),
  status: codeStatusSchema.default(CodeStatus.ACTIVE),
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional().nullable(),
  source: codeSourceSchema.default(CodeSource.INTERNAL),
  sourceVersion: z.string().max(50).optional().nullable(),
  additionalData: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  isCustom: z.boolean().default(false),
  customCodePrefix: z.string().max(20).optional().nullable(),
});

export type MedicalCodeInput = z.infer<typeof medicalCodeSchema>;

// Custom Code Prefix Schema
export const customCodePrefixSchema = z.object({
  prefix: z.string().min(1, 'Prefix is required').max(10),
  description: z.string().min(1, 'Description is required').max(200),
  codeType: codeTypeSchema,
  pattern: z.string().min(1, 'Pattern is required').max(50),
  nextNumber: z.number().int().positive().default(1),
});

export type CustomCodePrefixInput = z.infer<typeof customCodePrefixSchema>;

// Custom Code Creation Schema
export const customCodeCreationSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  longDescription: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional(),
  prefixId: z.string().uuid('Invalid prefix ID'),
  additionalData: z.record(z.any()).optional(),
});

export type CustomCodeCreationInput = z.infer<typeof customCodeCreationSchema>;

// Search/Filter Schema
export const codeSearchSchema = z.object({
  codeType: z.array(codeTypeSchema).optional(),
  status: z.array(codeStatusSchema).optional(),
  source: z.array(codeSourceSchema).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  effectiveDateFrom: z.coerce.date().optional(),
  effectiveDateTo: z.coerce.date().optional(),
  isCustom: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(25),
  sortBy: z.enum(['code', 'description', 'effectiveDate', 'updatedAt']).default('code'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type CodeSearchInput = z.infer<typeof codeSearchSchema>;

// Import Validation Schema
export const importCodeRowSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  codeType: codeTypeSchema,
  description: z.string().min(1, 'Description is required').max(500),
  longDescription: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  effectiveDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  expirationDate: z.string().optional(),
  status: codeStatusSchema.optional(),
});

export type ImportCodeRowInput = z.infer<typeof importCodeRowSchema>;

// Batch import schema
export const importCodesSchema = z.object({
  codes: z.array(importCodeRowSchema).min(1, 'At least one code required').max(10000, 'Maximum 10,000 codes per import'),
  source: codeSourceSchema.default(CodeSource.IMPORTED),
  sourceVersion: z.string().optional(),
  skipDuplicates: z.boolean().default(true),
  updateExisting: z.boolean().default(false),
});

export type ImportCodesInput = z.infer<typeof importCodesSchema>;

