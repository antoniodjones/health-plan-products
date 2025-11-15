/**
 * Code Library - Enterprise Edition
 * Advanced medical code management with filtering and bulk actions
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CodeTypeBadge } from '@/components/codes/code-type-badge';
import { CodeStatusBadge } from '@/components/codes/code-status-badge';
import { CodeImportWizard } from '@/components/codes/code-import-wizard';
import type {
  MedicalCode,
  CodeSearchResult,
  CodeStatistics,
  CodeType,
  CodeStatus,
  CodeSource,
} from '@/types/codes';
import {
  Plus,
  Search,
  Download,
  Upload,
  RefreshCw,
  Filter,
  X,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Activity,
  CheckCircle2,
  Tag,
  TrendingUp,
  FileCode,
} from 'lucide-react';
import { format } from 'date-fns';

const CODE_TYPES = [
  { value: 'ICD_10', label: 'ICD-10', icon: Activity },
  { value: 'CPT', label: 'CPT', icon: FileCode },
  { value: 'HCPCS', label: 'HCPCS', icon: FileCode },
  { value: 'NDC', label: 'NDC', icon: FileCode },
  { value: 'REVENUE', label: 'Revenue', icon: FileCode },
  { value: 'DRG', label: 'DRG', icon: FileCode },
  { value: 'LOINC', label: 'LOINC', icon: FileCode },
  { value: 'SNOMED', label: 'SNOMED', icon: FileCode },
  { value: 'CUSTOM', label: 'Custom', icon: Tag },
];

const CODE_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DEPRECATED', label: 'Deprecated' },
  { value: 'PENDING', label: 'Pending' },
];

export default function CodesPage() {
  const [codes, setCodes] = useState<MedicalCode[]>([]);
  const [statistics, setStatistics] = useState<CodeStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isCustomOnly, setIsCustomOnly] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [search, selectedTypes, selectedStatuses, isCustomOnly, page]);

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
      if (search) params.append('search', search);
      selectedTypes.forEach((type) => params.append('codeType', type));
      selectedStatuses.forEach((status) => params.append('status', status));
      if (typeof isCustomOnly === 'boolean') params.append('isCustom', String(isCustomOnly));
      params.append('page', String(page));
      params.append('pageSize', '20');

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

  const handleRefresh = () => {
    fetchStatistics();
    fetchCodes();
  };

  const handleImportSuccess = () => {
    fetchStatistics();
    fetchCodes();
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setIsCustomOnly(undefined);
    setSearch('');
    setPage(1);
  };

  const activeFilterCount =
    selectedTypes.length + selectedStatuses.length + (typeof isCustomOnly === 'boolean' ? 1 : 0);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar Filters */}
      {showFilters && (
        <div className="w-64 overflow-auto border-r bg-background">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Code Type Filters */}
          <div className="border-b p-4">
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground">CODE TYPE</h4>
            <div className="space-y-2">
              {CODE_TYPES.map((type) => {
                const count = statistics?.byType[type.value as CodeType] || 0;
                const isSelected = selectedTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filters */}
          <div className="border-b p-4">
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground">STATUS</h4>
            <div className="space-y-2">
              {CODE_STATUSES.map((status) => {
                const isSelected = selectedStatuses.includes(status.value);
                return (
                  <button
                    key={status.value}
                    onClick={() => toggleStatus(status.value)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom/Standard Toggle */}
          <div className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground">TYPE</h4>
            <div className="space-y-2">
              <button
                onClick={() => setIsCustomOnly(undefined)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isCustomOnly === undefined
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted'
                }`}
              >
                All Codes
              </button>
              <button
                onClick={() => setIsCustomOnly(false)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isCustomOnly === false
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setIsCustomOnly(true)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isCustomOnly === true
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted'
                }`}
              >
                <span>Custom</span>
                <span className="text-xs text-muted-foreground">
                  {statistics?.customCount || 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Code Library</h1>
                <p className="text-sm text-muted-foreground">
                  Browse and manage medical codes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setImportOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Codes
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Code
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics */}
        {statistics && (
          <div className="border-b bg-background px-6 py-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Codes</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.totalCodes.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">All types</p>
                    </div>
                    <div className="rounded-lg bg-secondary/10 p-2">
                      <Activity className="h-4 w-4 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Active</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.activeCount.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-success">
                        {statistics.totalCodes > 0
                          ? Math.round((statistics.activeCount / statistics.totalCodes) * 100)
                          : 0}% of total
                      </p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Custom Codes</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.customCount.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Organization-specific</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Recently Added</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.recentlyAdded.toLocaleString()}</p>
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
              placeholder="Search codes by code value, description, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Codes List */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading codes...</p>
              </div>
            </div>
          ) : codes.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
              <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No codes found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or import codes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {codes.map((code) => (
                <Card key={code.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                          <FileCode className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">{code.code}</span>
                            <CodeTypeBadge codeType={code.codeType} />
                            <CodeStatusBadge status={code.status} />
                            {code.isCustom && (
                              <Badge variant="outline" className="text-xs">
                                <Tag className="mr-1 h-3 w-3" />
                                Custom
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {code.description}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            {code.category && <span>Category: {code.category}</span>}
                            <span>Effective: {format(new Date(code.effectiveDate), 'MMM d, yyyy')}</span>
                            <span>Source: {code.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        {code.isCustom && (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && codes.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, codes.length)} results
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

      {/* Import Wizard */}
      <CodeImportWizard
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
