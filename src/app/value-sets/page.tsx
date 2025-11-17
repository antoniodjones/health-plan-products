/**
 * Value Sets Management - Story 6.2
 * Browse and manage value sets (code collections for quality measures)
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
import type {
  ValueSet,
  ValueSetSearchResult,
  ValueSetStatistics,
  ValueSetCode,
} from '@/types/quality-measures';
import {
  Plus,
  Search,
  Download,
  RefreshCw,
  FolderOpen,
  FileText,
  Link2,
  Code2,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { ValueSetCodeEditor } from '@/components/quality-measures/value-set-code-editor';

export default function ValueSetsPage() {
  const [valueSets, setValueSets] = useState<ValueSet[]>([]);
  const [statistics, setStatistics] = useState<ValueSetStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'valueSetId' | 'name' | 'effectiveDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedValueSet, setSelectedValueSet] = useState<ValueSet | null>(null);
  const [valueSetCodes, setValueSetCodes] = useState<ValueSetCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  // Fetch value sets
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchValueSets();
    }, search ? 500 : 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, sortBy, sortOrder]);

  // Fetch statistics
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/value-sets/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchValueSets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/value-sets?${params.toString()}`);
      if (response.ok) {
        const data: ValueSetSearchResult = await response.json();
        setValueSets(data.valueSets);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching value sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchValueSetCodes = async (valueSetId: string) => {
    setLoadingCodes(true);
    try {
      const response = await fetch(`/api/value-sets/${valueSetId}/codes`);
      if (response.ok) {
        const data = await response.json();
        setValueSetCodes(data.codes || []);
      }
    } catch (error) {
      console.error('Error fetching value set codes:', error);
    } finally {
      setLoadingCodes(false);
    }
  };

  const handleSort = (column: 'valueSetId' | 'name' | 'effectiveDate') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleViewCodes = async (valueSet: ValueSet) => {
    setSelectedValueSet(valueSet);
    await fetchValueSetCodes(valueSet.id);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Value Sets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage code collections for quality measures
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchValueSets}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Value Set
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Value Sets</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {statistics?.totalValueSets ?? '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="text-green-600">
                    {statistics?.recentlyAdded ? `+${statistics.recentlyAdded}` : '0'}
                  </span>{' '}
                  recently added
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Codes</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {statistics?.totalCodes ?? '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  across all value sets
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Code2 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Codes per Set</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {statistics?.averageCodesPerSet
                    ? Math.round(statistics.averageCodesPerSet)
                    : '...'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  code density
                </p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Link2 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by value set ID, name, or OID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Value Sets List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-gray-500">Loading value sets...</p>
          </div>
        </div>
      ) : valueSets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No value sets found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or create a new value set
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Sortable Column Headers */}
          <div className="flex items-center gap-4 rounded-lg border bg-gray-50 px-6 py-3">
            <button
              onClick={() => handleSort('valueSetId')}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Value Set ID
              {sortBy === 'valueSetId' ? (
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
            <div className="ml-auto text-sm text-gray-500">Codes</div>
          </div>

          {/* Value Set Cards */}
          {valueSets.map((valueSet) => (
            <Card key={valueSet.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-semibold text-lg text-gray-900">
                        {valueSet.valueSetId}
                      </span>
                      {valueSet.purpose && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {valueSet.purpose}
                        </Badge>
                      )}
                      {valueSet.oid && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                          <FileText className="mr-1 h-3 w-3" />
                          OID
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {valueSet.name}
                    </h3>

                    {valueSet.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {valueSet.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      {valueSet.oid && (
                        <span className="font-mono text-xs">OID: {valueSet.oid}</span>
                      )}
                      <span>Version: {valueSet.version}</span>
                      <span>
                        Effective: {format(new Date(valueSet.effectiveDate), 'MMM d, yyyy')}
                      </span>
                      {valueSet.codes && (
                        <span className="font-semibold text-primary">
                          {valueSet.codes.length} codes
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCodes(valueSet)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Codes
                    </Button>
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
      {!loading && valueSets.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, valueSets.length)} results
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

      {/* View Codes Modal */}
      <Dialog open={!!selectedValueSet} onOpenChange={() => setSelectedValueSet(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-mono text-xl">{selectedValueSet?.valueSetId}</div>
                <div className="text-sm font-normal text-gray-500">Value Set Codes</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedValueSet && (
            <div className="space-y-6">
              {/* Value Set Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedValueSet.name}
                </h3>
                {selectedValueSet.description && (
                  <p className="text-sm text-gray-600">{selectedValueSet.description}</p>
                )}
              </div>

              {/* Value Set Code Editor */}
              <ValueSetCodeEditor
                valueSetId={selectedValueSet.id}
                valueSetName={selectedValueSet.name}
                codes={valueSetCodes}
                onCodesUpdated={() => {
                  fetchValueSetCodes(selectedValueSet.id);
                  fetchStatistics();
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

