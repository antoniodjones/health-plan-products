/**
 * Validation schemas for Code Management
 * SIMPLIFIED - Only validates fields that exist in database
 */
import { z } from 'zod';
import { CodeType } from '@/types/codes';

// Code Type Enum
export const codeTypeSchema = z.nativeEnum(CodeType);

// Search/Filter Schema - Minimal
export const codeSearchSchema = z.object({
  search: z.string().optional(),
  codeType: z.array(codeTypeSchema).optional(),
  category: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

export type CodeSearchInput = z.infer<typeof codeSearchSchema>;

// Create Code Schema - For future use
export const createCodeSchema = z.object({
  code: z.string().min(1).max(50),
  codeType: codeTypeSchema,
  description: z.string().min(1).max(500),
  longDescription: z.string().max(2000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  isActive: z.boolean().default(true),
  effectiveDate: z.coerce.date(),
  terminationDate: z.coerce.date().optional().nullable(),
  version: z.string().default('1.0'),
  sourceSystem: z.string().max(100).optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
});

export type CreateCodeInput = z.infer<typeof createCodeSchema>;
