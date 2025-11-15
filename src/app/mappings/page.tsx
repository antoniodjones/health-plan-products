/**
 * Code-to-Benefit Mappings - Enterprise Edition
 * Visual relationship management with bulk actions
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
  Filter,
  X,
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
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [search, page]);

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

  const handleRefresh = () => {
    fetchStatistics();
    fetchMappings();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Code-to-Benefit Mappings</h1>
              <p className="text-sm text-muted-foreground">
                Configure relationships between medical codes and benefit packages
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="secondary" size="sm">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Bulk Map Codes
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Mapping
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics */}
        {statistics && (
          <div className="border-b bg-background px-6 py-4">
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Mappings</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.totalMappings.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">All relationships</p>
                    </div>
                    <div className="rounded-lg bg-secondary/10 p-2">
                      <Link2 className="h-4 w-4 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Active</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.activeMappings.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-success">
                        {statistics.totalMappings > 0
                          ? Math.round((statistics.activeMappings / statistics.totalMappings) * 100)
                          : 0}% of total
                      </p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Unmapped Codes</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.unmappedCodes.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-destructive">Requiring attention</p>
                    </div>
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Draft Mappings</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.draftMappings.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">In development</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Edit className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Recently Created</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.recentlyCreated.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Last 7 days</p>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="border-b bg-background px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search mappings by code, benefit name, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Mappings List */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading mappings...</p>
              </div>
            </div>
          ) : mappings.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
              <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No mappings found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or create a new mapping
              </p>
              <Button className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create First Mapping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mappings.map((mapping) => (
                <Card key={mapping.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Mapping Visualization */}
                      <div className="flex flex-1 items-center gap-4">
                        {/* Medical Code */}
                        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                            <Activity className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-mono font-semibold">{mapping.medicalCode?.code}</p>
                            {mapping.medicalCode && (
                              <CodeTypeBadge codeType={mapping.medicalCode.codeType as any} showIcon={false} />
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center gap-1">
                          <ArrowRight className="h-6 w-6 text-primary" />
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {mapping.mappingType.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Benefit */}
                        <div className="flex items-center gap-3 rounded-lg border bg-primary/5 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{mapping.benefit?.name}</p>
                            {mapping.benefit?.category && (
                              <p className="text-xs text-muted-foreground">{mapping.benefit.category}</p>
                            )}
                          </div>
                        </div>

                        {/* Status and Metadata */}
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <MappingStatusBadge status={mapping.status} />
                            {mapping.priority !== undefined && (
                              <Badge variant="outline" className="text-xs">
                                Priority: {mapping.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
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
                        <Button variant="ghost" size="sm" className="text-destructive">
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
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
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
                <span className="text-sm">
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
      </div>
    </div>
  );
}
