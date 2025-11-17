'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { MedicalCode, CodeSearchResult, CodeStatistics } from '@/types/codes';
import { Search, RefreshCw } from 'lucide-react';

export default function CodesPage() {
  const [codes, setCodes] = useState<MedicalCode[]>([]);
  const [statistics, setStatistics] = useState<CodeStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fetch codes when search/page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCodes();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

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
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/codes?${params.toString()}`);
      if (response.ok) {
        const data: CodeSearchResult = await response.json();
        setCodes(data.codes);
        setTotalPages(data.totalPages);
      } else {
        console.error('API Error:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Code Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage medical billing codes
          </p>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Total Codes</p>
              <p className="mt-2 text-3xl font-bold">{statistics.totalCodes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="mt-2 text-3xl font-bold">{statistics.activeCodes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="mt-2 text-3xl font-bold">{statistics.inactiveCodes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Code Types</p>
              <p className="mt-2 text-3xl font-bold">{statistics.codeTypeCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search codes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchCodes}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Codes List */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-gray-500">Loading codes...</p>
              </div>
            </div>
          ) : codes.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-xl font-semibold">No Codes Found</p>
                <p className="mt-1 text-sm">Try adjusting your search</p>
              </div>
            </div>
          ) : (
            <>
              {/* Simple Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {codes.map((code) => (
                      <tr key={code.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-semibold">
                          {code.code}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Badge variant="outline">{code.codeType}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {code.description}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {code.category || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Badge className={code.isActive ? 'bg-green-500' : 'bg-red-500'}>
                            {code.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
