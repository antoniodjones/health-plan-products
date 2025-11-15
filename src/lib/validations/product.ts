/**
 * Validation schemas for Products
 */
import { z } from 'zod';
import { ProductType, ProductStatus } from '@/types/products';

// Enum schemas
export const productTypeSchema = z.nativeEnum(ProductType);
export const productStatusSchema = z.nativeEnum(ProductStatus);

// Product Schema
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional().nullable(),
  productType: productTypeSchema,
  status: productStatusSchema.default(ProductStatus.DRAFT),
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional().nullable(),
  marketSegment: z.string().max(100).optional().nullable(),
  stateAvailability: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

// Product Search Schema
export const productSearchSchema = z.object({
  productType: z.array(productTypeSchema).optional(),
  status: z.array(productStatusSchema).optional(),
  marketSegment: z.string().optional(),
  search: z.string().optional(),
  effectiveDateFrom: z.coerce.date().optional(),
  effectiveDateTo: z.coerce.date().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(25),
  sortBy: z.enum(['name', 'createdAt', 'effectiveDate', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ProductSearchInput = z.infer<typeof productSearchSchema>;

