/**
 * Analytics Dashboard - Modern Clean Design
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type {
  DashboardMetrics,
  CodeCoverageData,
  MappingDistributionData,
} from '@/types/analytics';
import {
  Activity,
  CheckCircle2,
  Tag,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Download,
  AlertTriangle,
  Lightbulb,
  X,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [coverage, setCoverage] = useState<CodeCoverageData[]>([]);
  const [distribution, setDistribution] = useState<MappingDistributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, coverageRes, distributionRes] = await Promise.all([
        fetch('/api/analytics/dashboard'),
        fetch('/api/analytics/coverage'),
        fetch('/api/analytics/distribution'),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (coverageRes.ok) setCoverage(await coverageRes.json());
      if (distributionRes.ok) setDistribution(await distributionRes.json());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Codes</p>
                  <p className="mt-2 text-3xl font-bold">{metrics.codes.total.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-gray-500">{metrics.codes.active.toLocaleString()} active</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Mappings</p>
                  <p className="mt-2 text-3xl font-bold">{metrics.mappings.total.toLocaleString()}</p>
                  <div className="mt-1 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unmapped Codes</p>
                  <p className="mt-2 text-3xl font-bold">{metrics.mappings.unmapped.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-red-600">Requires attention</p>
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
                  <p className="text-sm font-medium text-gray-600">Custom Codes</p>
                  <p className="mt-2 text-3xl font-bold">{metrics.codes.custom.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-gray-500">Organization-specific</p>
                </div>
                <div className="rounded-full bg-green-50 p-3">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="font-medium text-amber-900">Unmapped Codes Detected</p>
                  <p className="mt-1 text-sm text-amber-700">
                    127 medical codes are not mapped to any benefit packages. This may impact coverage calculations.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Unmapped Codes
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex gap-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">Low Coverage in ICD-10 Codes</p>
                  <p className="mt-1 text-sm text-red-700">
                    ICD-10 code coverage is at 45%, below the recommended 80% threshold.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Improve Coverage
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Bulk Mapping Suggestion</p>
                  <p className="mt-1 text-sm text-blue-700">
                    234 similar codes can be mapped in bulk to save time. Estimated time savings: 4 hours.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Review Suggestions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Coverage */}
      {coverage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Code Coverage by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coverage.map((item) => (
                <div key={item.codeType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.codeType}</span>
                      <span className="text-sm text-gray-500">
                        {item.mappedCodes.toLocaleString()} / {item.totalCodes.toLocaleString()}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        item.coveragePercentage >= 80
                          ? 'text-green-600'
                          : item.coveragePercentage >= 50
                          ? 'text-blue-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item.coveragePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        item.coveragePercentage >= 80
                          ? 'bg-green-500'
                          : item.coveragePercentage >= 50
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${item.coveragePercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapping Distribution */}
      {distribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mapping Distribution by Benefit Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {distribution.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.benefitCategory}</span>
                      <span className="text-sm text-gray-500">
                        {item.count.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
