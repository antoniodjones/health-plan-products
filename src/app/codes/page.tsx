/**
 * Code Library Page
 * Epic 1: Code Set Data Management
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CodeFilters } from '@/components/codes/code-filters';
import { CodesTable } from '@/components/codes/codes-table';
import { CodeStatsCards } from '@/components/codes/code-stats-cards';
import type {
  MedicalCode,
  CodeFilters as CodeFiltersType,
  CodeSearchResult,
  CodeStatistics,
} from '@/types/codes';
import { Plus, Upload, Download } from 'lucide-react';

export default function CodesPage() {
  const [codes, setCodes] = useState<MedicalCode[]>([]);
  const [statistics, setStatistics] = useState<CodeStatistics | null>(null);
  const [filters, setFilters] = useState<CodeFiltersType>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch statistics
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fetch codes when filters or page changes
  useEffect(() => {
    fetchCodes();
  }, [filters, page]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/codes/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.codeType) {
        filters.codeType.forEach((type) => params.append('codeType', type));
      }
      if (filters.status) {
        filters.status.forEach((status) => params.append('status', status));
      }
      if (filters.source) {
        filters.source.forEach((source) => params.append('source', source));
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (typeof filters.isCustom === 'boolean') {
        params.append('isCustom', String(filters.isCustom));
      }
      params.append('page', String(page));
      params.append('pageSize', '25');

      const response = await fetch(`/api/codes?${params.toString()}`);
      if (response.ok) {
        const data: CodeSearchResult = await response.json();
        setCodes(data.codes);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: CodeFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Library</h1>
          <p className="text-muted-foreground">
            Browse and manage standard medical codes and custom codes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="secondary">
            <Upload className="mr-2 h-4 w-4" />
            Import Codes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Code
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && <CodeStatsCards statistics={statistics} />}

      {/* Filters */}
      <CodeFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {loading ? 'Loading...' : `${codes.length} codes found`}
          </h2>
        </div>

        <CodesTable
          codes={codes}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onView={(code) => console.log('View:', code)}
          onEdit={(code) => console.log('Edit:', code)}
          onDelete={(code) => console.log('Delete:', code)}
        />
      </div>
    </div>
  );
}

