/**
 * Code Equivalency Mappings Component (Epic 8)
 * Display and manage code equivalencies
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CodeTypeBadge } from '@/components/codes/code-type-badge';
import { CreateEquivalencyDialog } from './create-equivalency-dialog';
import type {
  CodeEquivalency,
  CodeEquivalencySearchResult,
  CodeEquivalencyStatistics,
} from '@/types/code-equivalency';
import {
  Plus,
  Search,
  RefreshCw,
  ArrowLeftRight,
  Link2,
  Eye,
  Trash2,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export function EquivalencyMappings() {
  const [equivalencies, setEquivalencies] = useState<CodeEquivalency[]>([]);
  const [statistics, setStatistics] = useState<CodeEquivalencyStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedEquivalency, setSelectedEquivalency] = useState<CodeEquivalency | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchEquivalencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPage(1);
        fetchEquivalencies();
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/code-equivalencies/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching equivalency statistics:', error);
    }
  };

  const fetchEquivalencies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('query', search);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/code-equivalencies?${params.toString()}`);
      if (response.ok) {
        const data: CodeEquivalencySearchResult = await response.json();
        setEquivalencies(data.equivalencies);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching equivalencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (equivalency: CodeEquivalency) => {
    setSelectedEquivalency(equivalency);
    setDetailModalOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      LABORATORY: 'bg-blue-100 text-blue-700',
      PROCEDURE: 'bg-green-100 text-green-700',
      DIAGNOSIS: 'bg-purple-100 text-purple-700',
      MEDICATION: 'bg-orange-100 text-orange-700',
      OBSERVATION: 'bg-cyan-100 text-cyan-700',
      SERVICE: 'bg-pink-100 text-pink-700',
      SUPPLY: 'bg-yellow-100 text-yellow-700',
      DME: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Equivalencies</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statistics.totalEquivalencies.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {statistics.totalMappings} mappings
                  </p>
                </div>
                <Link2 className="h-5 w-5 text-cyan-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Coverage Rate</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statistics.coverageRate}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    of active codes mapped
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg Confidence</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {(statistics.averageConfidence * 100).toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    mapping accuracy
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Top Category</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statistics.byCategory[0]?.category || 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {statistics.byCategory[0]?.count || 0} equivalencies
                  </p>
                </div>
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search equivalencies by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchEquivalencies}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Equivalency
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Equivalency Dialog */}
      <CreateEquivalencyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          fetchEquivalencies();
          fetchStatistics();
        }}
      />

      {/* Equivalencies List */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : equivalencies.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Link2 className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">No equivalencies found</p>
              <p className="mt-2 text-sm text-gray-500">
                {search ? 'Try adjusting your search' : 'Create your first code equivalency'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {equivalencies.map((equiv) => (
                <div
                  key={equiv.id}
                  className="flex items-start justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{equiv.name}</h3>
                      <Badge className={getCategoryColor(equiv.category)}>
                        {equiv.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {equiv.source.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(equiv.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3">{equiv.description}</p>

                    {/* Code Mappings */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {equiv.mappings.slice(0, 4).map((mapping, idx) => (
                        <div key={mapping.id} className="flex items-center gap-1">
                          {idx > 0 && (
                            <ArrowLeftRight className="h-3 w-3 text-gray-400 mx-1" />
                          )}
                          <div className="flex items-center gap-1 rounded-md border bg-gray-50 px-2 py-1">
                            <CodeTypeBadge codeType={mapping.sourceCode.codeType} />
                            <span className="text-xs font-mono font-semibold">
                              {mapping.sourceCode.code}
                            </span>
                          </div>
                          {idx === 0 && mapping.targetCode && (
                            <>
                              <ArrowLeftRight className="h-3 w-3 text-gray-400 mx-1" />
                              <div className="flex items-center gap-1 rounded-md border bg-gray-50 px-2 py-1">
                                <CodeTypeBadge codeType={mapping.targetCode.codeType} />
                                <span className="text-xs font-mono font-semibold">
                                  {mapping.targetCode.code}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {equiv.mappings.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{equiv.mappings.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailModal(equiv)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEquivalency?.name}</DialogTitle>
          </DialogHeader>
          {selectedEquivalency && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Description</h4>
                <p className="text-sm text-gray-600">{selectedEquivalency.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700">Category</h4>
                  <Badge className={getCategoryColor(selectedEquivalency.category)}>
                    {selectedEquivalency.category}
                  </Badge>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700">Source</h4>
                  <p className="text-sm text-gray-600">
                    {selectedEquivalency.source.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-700">Confidence</h4>
                  <p className="text-sm text-gray-600">
                    {(selectedEquivalency.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Code Mappings</h4>
                <div className="space-y-2">
                  {selectedEquivalency.mappings.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="flex items-center gap-4 rounded-lg border bg-gray-50 p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CodeTypeBadge codeType={mapping.sourceCode.codeType} />
                          <span className="font-mono font-semibold">
                            {mapping.sourceCode.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {mapping.sourceCode.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline" className="mt-1 text-xs">
                          {mapping.relationship}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CodeTypeBadge codeType={mapping.targetCode.codeType} />
                          <span className="font-mono font-semibold">
                            {mapping.targetCode.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {mapping.targetCode.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

