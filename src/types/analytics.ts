/**
 * Type definitions for Analytics and Reporting
 */

// Dashboard Metrics
export interface DashboardMetrics {
  codes: {
    total: number;
    active: number;
    custom: number;
    recentlyAdded: number;
    byType: Record<string, number>;
  };
  mappings: {
    total: number;
    active: number;
    unmapped: number;
    recentlyCreated: number;
    byType: Record<string, number>;
  };
  validation: {
    totalTests: number;
    passed: number;
    failed: number;
    successRate: number;
  };
}

// Time Series Data
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface TrendData {
  period: 'day' | 'week' | 'month' | 'year';
  data: TimeSeriesData[];
}

// Code Coverage
export interface CodeCoverageData {
  codeType: string;
  totalCodes: number;
  mappedCodes: number;
  coveragePercentage: number;
}

// Mapping Distribution
export interface MappingDistributionData {
  benefitCategory: string;
  count: number;
  percentage: number;
}

// Validation Results
export interface ValidationTestResult {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning';
  timestamp: Date;
  details?: string;
  affectedCodes?: number;
}

export interface ValidationReport {
  id: string;
  name: string;
  runDate: Date;
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  successRate: number;
  tests: ValidationTestResult[];
  summary: string;
}

// Activity Log
export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  activityType: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'VALIDATE';
  entityType: 'CODE' | 'MAPPING' | 'BENEFIT' | 'PRODUCT';
  entityId: string;
  userId?: string;
  userName?: string;
  description: string;
  metadata?: Record<string, any>;
}

// Analytics Filters
export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  codeType?: string[];
  benefitCategory?: string;
  entityType?: string;
}

