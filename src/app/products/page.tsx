/**
 * Products Dashboard & List Page
 * Enterprise landing page with metrics and product management
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Eye,
  Edit,
  Copy,
  MoreVertical,
  Grid,
  List,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

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

  const handleRefresh = () => {
    fetchStatistics();
    fetchProducts();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="text-sm text-muted-foreground">
                Manage health plan products and benefit configurations
              </p>
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
        </div>

        {/* Dashboard Metrics */}
        <div className="border-b bg-background px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Key Metrics
            </h2>
          </div>
          {statistics && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {/* Total Products */}
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Products</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.total}</p>
                      <p className="mt-1 text-xs text-muted-foreground">All configurations</p>
                    </div>
                    <div className="rounded-lg bg-secondary/10 p-2">
                      <Package className="h-4 w-4 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Products */}
              <Card className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Active</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.active}</p>
                      <p className="mt-1 text-xs text-success">
                        {statistics.total > 0 ? Math.round((statistics.active / statistics.total) * 100) : 0}% of total
                      </p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Draft Products */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">In Development</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.draft}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Draft products</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Edit className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recently Created */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Recently Created</p>
                      <p className="mt-1 text-2xl font-bold">{statistics.recentlyCreated}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Last 7 days</p>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avg Benefits per Product */}
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Avg Benefits</p>
                      <p className="mt-1 text-2xl font-bold">24</p>
                      <p className="mt-1 text-xs text-muted-foreground">Per product</p>
                    </div>
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Compliance</p>
                      <p className="mt-1 text-2xl font-bold">98%</p>
                      <p className="mt-1 text-xs text-success">+2% this month</p>
                    </div>
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Search and View Controls */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products by name, type, or market segment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <span className="mr-2">⚙️</span>
              Advanced Filters
            </Button>
            <div className="flex items-center gap-1 border-l pl-4">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products List/Grid */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or create a new product
              </p>
              <Button className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create First Product
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <Card key={product.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Left: Product Info */}
                      <div className="flex flex-1 items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                          <Package className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {product.productType.replace('_', ' ')}
                            </Badge>
                            {product.status === 'ACTIVE' ? (
                              <Badge className="bg-success/10 text-success hover:bg-success/20">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : product.status === 'DRAFT' ? (
                              <Badge className="bg-muted text-muted-foreground">
                                <Edit className="mr-1 h-3 w-3" />
                                Draft
                              </Badge>
                            ) : (
                              <Badge variant="outline">{product.status}</Badge>
                            )}
                          </div>
                          {product.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {product._count?.benefits || 0} benefits
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {product.marketSegment || 'All markets'}
                            </span>
                            <span>
                              Effective: {format(new Date(product.effectiveDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
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
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
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

