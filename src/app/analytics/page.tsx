/**
 * Analytics Dashboard Page
 * Epic 4: Validation & Analytics
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  BarChart3,
  PieChart,
  AlertCircle,
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
      <div className="container mx-auto flex items-center justify-center py-24">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor code management performance and coverage metrics
        </p>
      </div>

      {/* Overview Metrics */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
              <div className="rounded-lg bg-secondary/10 p-2">
                <Activity className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.codes.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.codes.active.toLocaleString()} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mappings</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.mappings.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.mappings.active.toLocaleString()} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unmapped Codes</CardTitle>
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.mappings.unmapped.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custom Codes</CardTitle>
              <div className="rounded-lg bg-success/10 p-2">
                <Tag className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.codes.custom.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Organization-specific</p>
            </CardContent>
          </Card>
        </div>
      )}

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
                      <span className="font-medium">{item.codeType}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.mappedCodes.toLocaleString()} / {item.totalCodes.toLocaleString()}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        item.coveragePercentage >= 80
                          ? 'text-success'
                          : item.coveragePercentage >= 50
                          ? 'text-primary'
                          : 'text-destructive'
                      }`}
                    >
                      {item.coveragePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${
                        item.coveragePercentage >= 80
                          ? 'bg-success'
                          : item.coveragePercentage >= 50
                          ? 'bg-primary'
                          : 'bg-destructive'
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
                      <span className="text-sm font-medium">{item.benefitCategory}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-secondary transition-all"
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

      {/* Code Types Breakdown */}
      {metrics && Object.keys(metrics.codes.byType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Codes by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(metrics.codes.byType).map(([type, count]) => (
                <div key={type} className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">{type}</p>
                  <p className="mt-2 text-2xl font-bold">{count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapping Types Breakdown */}
      {metrics && Object.keys(metrics.mappings.byType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mappings by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(metrics.mappings.byType).map(([type, count]) => (
                <div key={type} className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {type.replace('_', ' ')}
                  </p>
                  <p className="mt-2 text-2xl font-bold">{count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

