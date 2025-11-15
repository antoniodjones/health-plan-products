/**
 * Type definitions for Products
 */

export enum ProductType {
  HMO = 'HMO',
  PPO = 'PPO',
  EPO = 'EPO',
  POS = 'POS',
  HDHP = 'HDHP',
  INDEMNITY = 'INDEMNITY',
  MEDICARE_ADVANTAGE = 'MEDICARE_ADVANTAGE',
  MEDICAID = 'MEDICAID',
  DENTAL = 'DENTAL',
  VISION = 'VISION',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  productType: ProductType;
  status: ProductStatus;
  effectiveDate: Date;
  expirationDate?: Date | null;
  marketSegment?: string | null;
  stateAvailability?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  
  // Relations
  benefits?: any[];
  _count?: {
    benefits?: number;
  };
}

export interface ProductFilters {
  productType?: ProductType[];
  status?: ProductStatus[];
  marketSegment?: string;
  search?: string;
  effectiveDateFrom?: Date;
  effectiveDateTo?: Date;
}

export interface ProductSearchParams extends ProductFilters {
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'createdAt' | 'effectiveDate' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductStatistics {
  total: number;
  active: number;
  draft: number;
  byType: Record<ProductType, number>;
  byMarketSegment: Record<string, number>;
  recentlyCreated: number;
}

