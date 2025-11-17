/**
 * Quality Measures Library - Story 6.1
 * Browse and search HEDIS, MIPS, and other quality measures
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramBadge } from '@/components/quality-measures/program-badge';
import { DomainBadge } from '@/components/quality-measures/domain-badge';
import { MeasureStatusBadge } from '@/components/quality-measures/measure-status-badge';
import { MeasureFilters } from '@/components/quality-measures/measure-filters';
import { MeasureLogicViewer } from '@/components/quality-measures/measure-logic-viewer';
import { MeasureCodesViewer } from '@/components/quality-measures/measure-codes-viewer';
import type {
  QualityMeasure,
  QualityMeasureSearchResult,
  QualityMeasureStatistics,
  QualityMeasureFilters as QualityMeasureFiltersType,
} from '@/types/quality-measures';
import {
  Plus,
  Search,
  Download,
  RefreshCw,
  Activity,
  CheckCircle2,
  Target,
  TrendingUp,
  Award,
  Eye,
  Edit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

export default function QualityMeasuresPage() {
  const [measures, setMeasures] = useState<QualityMeasure[]>([]);
  const [statistics, setStatistics] = useState<QualityMeasureStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<QualityMeasureFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'measureId' | 'name' | 'program' | 'domain' | 'effectiveDate'>('measureId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedMeasure, setSelectedMeasure] = useState<QualityMeasure | null>(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (filters.search || '')) {
        setFilters((prev) => ({ ...prev, search }));
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Fetch measures when filters, sorting, or page changes
  useEffect(() => {
    fetchMeasures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, sortBy, sortOrder]);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/quality-measures/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchMeasures = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.program?.length) {
        filters.program.forEach((p) => params.append('program', p));
      }
      if (filters.domain?.length) {
        filters.domain.forEach((d) => params.append('domain', d));
      }
      if (filters.status?.length) {
        filters.status.forEach((s) => params.append('status', s));
      }
      if (filters.steward) params.append('steward', filters.steward);
      if (filters.effectiveYear) params.append('effectiveYear', String(filters.effectiveYear));

      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/quality-measures?${params.toString()}`);
      if (response.ok) {
        const data: QualityMeasureSearchResult = await response.json();
        setMeasures(data.measures);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching measures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: 'measureId' | 'name' | 'program' | 'domain' | 'effectiveDate') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFiltersChange = (newFilters: QualityMeasureFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quality Measures Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse HEDIS, MIPS, and other quality program requirements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchMeasures}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Measure
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Measures</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {statistics?.totalMeasures ?? '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="text-green-600">
                    {statistics?.recentlyAdded ? `+${statistics.recentlyAdded}` : '0'}
                  </span>{' '}
                  recently added
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Measures</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {statistics?.activeCount ?? '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="text-gray-600">{statistics?.draftCount ?? 0}</span> drafts
                </p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">HEDIS Measures</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {statistics?.byProgram?.HEDIS ?? '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="text-blue-600">{statistics?.byProgram?.MIPS ?? 0}</span> MIPS
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Target Rate</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {measures.length > 0
                    ? `${Math.round(
                        measures.reduce((sum, m) => sum + (m.targetRate || 0), 0) / measures.length
                      )}%`
                    : '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">across all measures</p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by measure ID, name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-primary/10' : ''}
        >
          Advanced Filters
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <MeasureFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Measures List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-gray-500">Loading measures...</p>
          </div>
        </div>
      ) : measures.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No measures found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters or create a custom measure
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Sortable Column Headers */}
          <div className="flex items-center gap-4 rounded-lg border bg-gray-50 px-6 py-3">
            <button
              onClick={() => handleSort('measureId')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Measure ID
              {sortBy === 'measureId' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('name')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Name
              {sortBy === 'name' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('program')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Program
              {sortBy === 'program' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('domain')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Domain
              {sortBy === 'domain' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <div className="ml-auto text-sm text-gray-500">Performance</div>
          </div>

          {/* Measure Cards */}
          {measures.map((measure) => (
            <Card key={measure.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-semibold text-lg text-gray-900">
                        {measure.measureId}
                      </span>
                      <ProgramBadge program={measure.program} />
                      <DomainBadge domain={measure.domain} />
                      <MeasureStatusBadge status={measure.status} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {measure.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {measure.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      {measure.steward && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {measure.steward}
                        </span>
                      )}
                      {measure.nqfNumber && (
                        <span>NQF: {measure.nqfNumber}</span>
                      )}
                      {measure.cmsNumber && (
                        <span>CMS: {measure.cmsNumber}</span>
                      )}
                      <span>
                        Effective: {format(new Date(measure.effectiveDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-6">
                    {/* Performance Indicators */}
                    <div className="text-right">
                      {measure.nationalBenchmark && (
                        <div className="text-xs text-gray-500">
                          National: {measure.nationalBenchmark}%
                        </div>
                      )}
                      {measure.targetRate && (
                        <div className="text-sm font-semibold text-primary">
                          Target: {measure.targetRate}%
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMeasure(measure)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && measures.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, measures.length)} of {measures.length} results
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

      {/* View Measure Details Modal */}
      <Dialog open={!!selectedMeasure} onOpenChange={() => setSelectedMeasure(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xl">{selectedMeasure?.measureId}</div>
                  <div className="text-sm font-normal text-gray-500">Quality Measure Details</div>
                </div>
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedMeasure) {
                    window.location.href = `/quality-measures/${selectedMeasure.id}/edit-logic`;
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Logic
              </Button>
            </div>
          </DialogHeader>

          {selectedMeasure && (
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex items-center gap-2">
                <ProgramBadge program={selectedMeasure.program} />
                <DomainBadge domain={selectedMeasure.domain} />
                <MeasureStatusBadge status={selectedMeasure.status} />
              </div>

              {/* Name */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedMeasure.name}</h3>
              </div>

              {/* Tabs for Overview, Logic, Codes, and Products */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="logic">Measure Logic</TabsTrigger>
                  <TabsTrigger value="codes">Billing Codes</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Description */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">Description</h4>
                    <p className="text-gray-900">{selectedMeasure.description}</p>
                  </div>

              {/* Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedMeasure.steward && (
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Steward</h4>
                    <p className="text-gray-900">{selectedMeasure.steward}</p>
                  </div>
                )}

                {selectedMeasure.nqfNumber && (
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">NQF Number</h4>
                    <p className="text-gray-900">{selectedMeasure.nqfNumber}</p>
                  </div>
                )}

                {selectedMeasure.cmsNumber && (
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">CMS Number</h4>
                    <p className="text-gray-900">{selectedMeasure.cmsNumber}</p>
                  </div>
                )}

                {selectedMeasure.reportingMethod && (
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Reporting Method</h4>
                    <p className="text-gray-900">{selectedMeasure.reportingMethod}</p>
                  </div>
                )}

                {selectedMeasure.measureType && (
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Measure Type</h4>
                    <p className="text-gray-900">{selectedMeasure.measureType}</p>
                  </div>
                )}

                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700">Version</h4>
                  <p className="text-gray-900">{selectedMeasure.version}</p>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700">Effective Date</h4>
                  <p className="text-gray-900">
                    {format(new Date(selectedMeasure.effectiveDate), 'MMMM d, yyyy')}
                  </p>
                </div>

                {selectedMeasure.retirementDate && (
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">Retirement Date</h4>
                    <p className="text-gray-900">
                      {format(new Date(selectedMeasure.retirementDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>

                  {/* Performance Targets */}
                  {(selectedMeasure.nationalBenchmark || selectedMeasure.targetRate) && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-700">Performance Targets</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {selectedMeasure.nationalBenchmark && (
                          <div className="rounded-lg border bg-gray-50 p-4">
                            <div className="text-sm text-gray-500">National Benchmark</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedMeasure.nationalBenchmark}%
                            </div>
                          </div>
                        )}
                        {selectedMeasure.targetRate && (
                          <div className="rounded-lg border bg-primary/5 p-4">
                            <div className="text-sm text-gray-500">Target Rate</div>
                            <div className="text-2xl font-bold text-primary">
                              {selectedMeasure.targetRate}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="logic" className="mt-6">
                  <MeasureLogicViewer logic={selectedMeasure.measureLogic || []} />
                </TabsContent>

                <TabsContent value="codes" className="mt-6">
                  <MeasureCodesViewer logic={selectedMeasure.measureLogic || []} />
                </TabsContent>

                <TabsContent value="products" className="mt-6">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">Products using this measure</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {selectedMeasure.productMeasures?.length || 0} products assigned
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t pt-4 mt-6">
                <Button variant="outline" onClick={() => setSelectedMeasure(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Measure
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Specification
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

