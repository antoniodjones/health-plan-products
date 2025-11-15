/**
 * Code-to-Benefit Mappings Page
 * Epic 3: Code-to-Benefit Mapping Configuration
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MappingsTable } from '@/components/mappings/mappings-table';
import type { CodeMapping, CodeMappingSearchResult, MappingStatistics } from '@/types/mappings';
import { Plus, ArrowLeftRight } from 'lucide-react';

export default function MappingsPage() {
  const [mappings, setMappings] = useState<CodeMapping[]>([]);
  const [statistics, setStatistics] = useState<MappingStatistics | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch statistics
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fetch mappings when page changes
  useEffect(() => {
    fetchMappings();
  }, [page]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/mappings/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('pageSize', '25');

      const response = await fetch(`/api/mappings?${params.toString()}`);
      if (response.ok) {
        const data: CodeMappingSearchResult = await response.json();
        setMappings(data.mappings);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching mappings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code-to-Benefit Mappings</h1>
          <p className="text-muted-foreground">
            Map medical codes to benefit configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Bulk Map Codes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Mapping
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Mappings</h3>
            <p className="mt-2 text-2xl font-bold">{statistics.totalMappings.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Active</h3>
            <p className="mt-2 text-2xl font-bold text-success">
              {statistics.activeMappings.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Unmapped Codes</h3>
            <p className="mt-2 text-2xl font-bold text-primary">
              {statistics.unmappedCodes.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Recently Created</h3>
            <p className="mt-2 text-2xl font-bold">{statistics.recentlyCreated.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {loading ? 'Loading...' : `${mappings.length} mappings found`}
          </h2>
        </div>

        <MappingsTable
          mappings={mappings}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={(mapping) => console.log('Edit:', mapping)}
          onDelete={(mapping) => console.log('Delete:', mapping)}
        />
      </div>
    </div>
  );
}

