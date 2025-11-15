/**
 * Products Page
 * Clean, modern product management
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Product, ProductSearchResult, ProductStatistics } from '@/types/products';
import {
  Plus,
  Search,
  Download,
  Upload,
  RefreshCw,
  Package,
  CheckCircle2,
  Edit,
  Eye,
  Copy,
  MoreVertical,
  FileText,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchProducts();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/products/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data: ProductSearchResult = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage health plan products and benefit configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchProducts}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.total}</p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.active}</p>
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
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.draft}</p>
                </div>
                <div className="rounded-full bg-orange-50 p-3">
                  <Edit className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.recentlyCreated}</p>
                </div>
                <div className="rounded-full bg-purple-50 p-3">
                  <FileText className="h-6 w-6 text-purple-600" />
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
            placeholder="Search products by name, type, or market segment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Advanced Filters</Button>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No products found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or create a new product
            </p>
            <Button className="mt-4" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <Badge variant="outline">{product.productType.replace('_', ' ')}</Badge>
                        {product.status === 'ACTIVE' ? (
                          <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">{product.status}</Badge>
                        )}
                      </div>
                      {product.description && (
                        <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {product._count?.benefits || 0} benefits
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {product.marketSegment || 'All markets'}
                        </span>
                        <span>
                          Effective: {format(new Date(product.effectiveDate), 'MMM d, yyyy')}
                        </span>
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
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, products.length)} of {products.length} products
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
