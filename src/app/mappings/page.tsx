/**
 * Code-to-Benefit Mappings - Modern Clean Design
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MappingStatusBadge } from '@/components/mappings/mapping-status-badge';
import { CodeTypeBadge } from '@/components/codes/code-type-badge';
import type { CodeMapping, CodeMappingSearchResult, MappingStatistics } from '@/types/mappings';
import {
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  ArrowRight,
  Link2,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ArrowLeftRight,
} from 'lucide-react';
import { format } from 'date-fns';

export default function MappingsPage() {
  const [mappings, setMappings] = useState<CodeMapping[]>([]);
  const [statistics, setStatistics] = useState<MappingStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchMappings();
  }, []);

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
      if (search) params.append('search', search);
      params.append('page', String(page));
      params.append('pageSize', '20');

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

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Code-to-Benefit Mappings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure relationships between medical codes and benefit packages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchMappings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Bulk Map Codes
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Mapping
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mappings</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.totalMappings.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <Link2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.activeMappings.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-green-50 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unmapped Codes</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.unmappedCodes.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-red-50 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft Mappings</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.draftMappings.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-orange-50 p-3">
                  <Edit className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search mappings by code, benefit name, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Advanced Filters</Button>
      </div>

      {/* Mappings List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-gray-500">Loading mappings...</p>
          </div>
        </div>
      ) : mappings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Link2 className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No mappings found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or create a new mapping
            </p>
            <Button className="mt-4" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create First Mapping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mappings.map((mapping) => (
            <Card key={mapping.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Mapping Visualization */}
                  <div className="flex items-center gap-6">
                    {/* Medical Code */}
                    <div className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">{mapping.medicalCode?.code}</p>
                        {mapping.medicalCode && (
                          <CodeTypeBadge codeType={mapping.medicalCode.codeType as any} showIcon={false} />
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="h-6 w-6 text-blue-600" />

                    {/* Benefit */}
                    <div className="flex items-center gap-3 rounded-lg border bg-blue-50 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{mapping.benefit?.name}</p>
                        {mapping.benefit?.category && (
                          <p className="text-xs text-gray-600">{mapping.benefit.category}</p>
                        )}
                      </div>
                    </div>

                    {/* Status and Metadata */}
                    <div>
                      <div className="flex items-center gap-2">
                        <MappingStatusBadge status={mapping.status} />
                        {mapping.priority !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            Priority: {mapping.priority}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <span>Effective: {format(new Date(mapping.effectiveDate), 'MMM d, yyyy')}</span>
                        {mapping.expirationDate && (
                          <span className="ml-3">
                            Expires: {format(new Date(mapping.expirationDate), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && mappings.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, mappings.length)} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
