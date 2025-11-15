/**
 * Code Library - Modern Clean Design
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CodeTypeBadge } from '@/components/codes/code-type-badge';
import { CodeImportWizard } from '@/components/codes/code-import-wizard';
import { CodeFilters } from '@/components/codes/code-filters';
import type { MedicalCode, CodeSearchResult, CodeStatistics, CodeFilters as CodeFiltersType } from '@/types/codes';
import {
  Plus,
  Search,
  Download,
  Upload,
  RefreshCw,
  Activity,
  CheckCircle2,
  Tag,
  TrendingUp,
  FileCode,
  Eye,
  Edit,
  Copy,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { format } from 'date-fns';

export default function CodesPage() {
  const [codes, setCodes] = useState<MedicalCode[]>([]);
  const [statistics, setStatistics] = useState<CodeStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CodeFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'code' | 'codeType' | 'category' | 'effectiveDate'>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<MedicalCode | null>(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (filters.search || '')) {
        setFilters((prev) => ({ ...prev, search }));
        setPage(1); // Reset to page 1 on search
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Fetch codes when filters, sorting, or page changes
  useEffect(() => {
    fetchCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, sortBy, sortOrder]);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
  }, []);

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
      
      // Add all filter params
      if (filters.search) params.append('search', filters.search);
      if (filters.codeType?.length) {
        filters.codeType.forEach(type => params.append('codeType', type));
      }
      if (filters.category) params.append('category', filters.category);
      
      // Add sorting params
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
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

  const handleSort = (column: 'code' | 'codeType' | 'category' | 'effectiveDate') => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFiltersChange = (newFilters: CodeFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filters change
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearch('');
    setPage(1);
  };

  const handleImportSuccess = () => {
    fetchStatistics();
    fetchCodes();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Code Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and manage medical codes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchCodes}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import Codes
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Code
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
                  <p className="text-sm font-medium text-gray-600">Total Codes</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.totalCodes.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-purple-50 p-3">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.activeCount.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-gray-600">Custom Codes</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.customCount.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-orange-50 p-3">
                  <Tag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recently Added</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.recentlyAdded.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
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
            placeholder="Search codes by code value, description, or category..."
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
        <CodeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Codes List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-gray-500">Loading codes...</p>
          </div>
        </div>
      ) : codes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No codes found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters or import codes
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Sortable Column Headers */}
          <div className="flex items-center gap-4 rounded-lg border bg-gray-50 px-6 py-3">
            <button
              onClick={() => handleSort('code')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Code
              {sortBy === 'code' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('codeType')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Type
              {sortBy === 'codeType' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('category')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Category
              {sortBy === 'category' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('effectiveDate')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Effective Date
              {sortBy === 'effectiveDate' ? (
                sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <div className="ml-auto text-sm text-gray-500">Actions</div>
          </div>

          {/* Code Cards */}
          {codes.map((code) => (
            <Card key={code.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                      <FileCode className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-900">{code.code}</span>
                        <CodeTypeBadge codeType={code.codeType} />
                        <Badge variant="outline" className={code.isActive ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                          {code.isActive ? '✓ Active' : '✗ Inactive'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{code.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        {code.category && <span>Category: {code.category}</span>}
                        <span>Effective: {format(new Date(code.effectiveDate), 'MMM d, yyyy')}</span>
                        <span>Source: {code.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCode(code)}>
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
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
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

      {/* View Code Details Modal */}
      <Dialog open={!!selectedCode} onOpenChange={() => setSelectedCode(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <FileCode className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-mono text-xl">{selectedCode?.code}</div>
                <div className="text-sm font-normal text-gray-500">Medical Code Details</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedCode && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-2">
                <CodeTypeBadge codeType={selectedCode.codeType} />
                <Badge variant="outline" className={selectedCode.isActive ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                  {selectedCode.isActive ? '✓ Active' : '✗ Inactive'}
                </Badge>
                {selectedCode.isCustom && (
                  <Badge variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    Custom
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
                <p className="text-gray-900">{selectedCode.description}</p>
                {selectedCode.longDescription && selectedCode.longDescription !== selectedCode.description && (
                  <p className="mt-2 text-sm text-gray-600">{selectedCode.longDescription}</p>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-700">Code Type</h3>
                  <p className="text-gray-900">{selectedCode.codeType}</p>
                </div>

                {selectedCode.category && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-700">Category</h3>
                    <p className="text-gray-900">{selectedCode.category}</p>
                  </div>
                )}

                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-700">Effective Date</h3>
                  <p className="text-gray-900">{format(new Date(selectedCode.effectiveDate), 'MMMM d, yyyy')}</p>
                </div>

                {selectedCode.terminationDate && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-700">Termination Date</h3>
                    <p className="text-gray-900">{format(new Date(selectedCode.terminationDate), 'MMMM d, yyyy')}</p>
                  </div>
                )}

                {selectedCode.version && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-700">Version</h3>
                    <p className="text-gray-900">{selectedCode.version}</p>
                  </div>
                )}

                {selectedCode.sourceSystem && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-700">Source System</h3>
                    <p className="text-gray-900">{selectedCode.sourceSystem}</p>
                  </div>
                )}

                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-700">Created</h3>
                  <p className="text-gray-900">{format(new Date(selectedCode.createdAt), 'MMM d, yyyy h:mm a')}</p>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-700">Last Updated</h3>
                  <p className="text-gray-900">{format(new Date(selectedCode.updatedAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>

              {/* Metadata */}
              {selectedCode.metadata && Object.keys(selectedCode.metadata).length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">Additional Metadata</h3>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(selectedCode.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedCode(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Code
                </Button>
                <Button>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Wizard */}
      <CodeImportWizard
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
