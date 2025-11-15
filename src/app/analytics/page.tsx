/**
 * Analytics Dashboard - Enterprise Edition
 * Comprehensive insights with tabbed views and visualizations
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  TrendingDown,
  RefreshCw,
  Download,
  AlertTriangle,
  Lightbulb,
  X,
} from 'lucide-react';

type InsightTab = 'all' | 'critical' | 'warnings' | 'opportunities' | 'insights';

interface Insight {
  id: string;
  type: 'critical' | 'warning' | 'opportunity' | 'info';
  title: string;
  description: string;
  actionLabel?: string;
  dismissible?: boolean;
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [coverage, setCoverage] = useState<CodeCoverageData[]>([]);
  const [distribution, setDistribution] = useState<MappingDistributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<InsightTab>('all');
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

  // Mock insights data
  const allInsights: Insight[] = [
    {
      id: 'unmapped-codes',
      type: 'warning',
      title: 'Unmapped Codes Detected',
      description: '127 medical codes are not mapped to any benefit packages. This may impact coverage calculations.',
      actionLabel: 'View Unmapped Codes',
      dismissible: true,
    },
    {
      id: 'coverage-gap',
      type: 'critical',
      title: 'Low Coverage in ICD-10 Codes',
      description: 'ICD-10 code coverage is at 45%, below the recommended 80% threshold.',
      actionLabel: 'Improve Coverage',
      dismissible: false,
    },
    {
      id: 'mapping-opportunity',
      type: 'opportunity',
      title: 'Bulk Mapping Suggestion',
      description: '234 similar codes can be mapped in bulk to save time. Estimated time savings: 4 hours.',
      actionLabel: 'Review Suggestions',
      dismissible: true,
    },
    {
      id: 'compliance-update',
      type: 'info',
      title: 'Quarterly Compliance Review Due',
      description: 'Schedule a compliance review for Q4 2024 benefit configurations.',
      actionLabel: 'Schedule Review',
      dismissible: true,
    },
    {
      id: 'performance-trend',
      type: 'opportunity',
      title: 'Mapping Velocity Increased',
      description: 'Your team mapped 45% more codes this month compared to last month.',
      actionLabel: 'View Trends',
      dismissible: true,
    },
  ];

  const filteredInsights = allInsights.filter((insight) => {
    if (dismissedInsights.has(insight.id)) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'critical') return insight.type === 'critical';
    if (activeTab === 'warnings') return insight.type === 'warning';
    if (activeTab === 'opportunities') return insight.type === 'opportunity';
    if (activeTab === 'insights') return insight.type === 'info';
    return false;
  });

  const getInsightCount = (type: InsightTab): number => {
    if (type === 'all') return allInsights.filter((i) => !dismissedInsights.has(i.id)).length;
    return allInsights.filter((i) => {
      if (dismissedInsights.has(i.id)) return false;
      if (type === 'critical') return i.type === 'critical';
      if (type === 'warnings') return i.type === 'warning';
      if (type === 'opportunities') return i.type === 'opportunity';
      if (type === 'insights') return i.type === 'info';
      return false;
    }).length;
  };

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

  const handleDismissInsight = (id: string) => {
    setDismissedInsights((prev) => new Set([...prev, id]));
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
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Real-time insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
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
        </div>

        {/* Overview Metrics */}
        {metrics && (
          <div className="border-b bg-background px-6 py-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Key Metrics
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Codes</p>
                      <p className="mt-1 text-2xl font-bold">{metrics.codes.total.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {metrics.codes.active.toLocaleString()} active
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/10 p-2">
                      <Activity className="h-4 w-4 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Mappings</p>
                      <p className="mt-1 text-2xl font-bold">{metrics.mappings.total.toLocaleString()}</p>
                      <p className="mt-1 flex items-center text-xs text-success">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +12% this month
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Unmapped Codes</p>
                      <p className="mt-1 text-2xl font-bold">{metrics.mappings.unmapped.toLocaleString()}</p>
                      <p className="mt-1 flex items-center text-xs text-destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Requires attention
                      </p>
                    </div>
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Custom Codes</p>
                      <p className="mt-1 text-2xl font-bold">{metrics.codes.custom.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Organization-specific</p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-2">
                      <Tag className="h-4 w-4 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Alerts & Insights Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Alerts & Insights</h2>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="mb-4 flex items-center gap-2 border-b">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                  {getInsightCount('all') > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getInsightCount('all')}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('critical')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'critical'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  Critical
                  {getInsightCount('critical') > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getInsightCount('critical')}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('warnings')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'warnings'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Warnings
                  {getInsightCount('warnings') > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getInsightCount('warnings')}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'opportunities'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Opportunities
                  {getInsightCount('opportunities') > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getInsightCount('opportunities')}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'insights'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Lightbulb className="h-4 w-4" />
                  Insights
                  {getInsightCount('insights') > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getInsightCount('insights')}
                    </Badge>
                  )}
                </button>
              </div>

              {/* Insights List */}
              <div className="space-y-3">
                {filteredInsights.map((insight) => (
                  <Alert
                    key={insight.id}
                    variant={insight.type === 'critical' || insight.type === 'warning' ? 'destructive' : 'default'}
                    className={`relative ${
                      insight.type === 'warning'
                        ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20'
                        : insight.type === 'opportunity'
                        ? 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20'
                        : insight.type === 'info'
                        ? 'border-primary/50 bg-primary/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === 'critical' ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : insight.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      ) : insight.type === 'opportunity' ? (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Lightbulb className="h-5 w-5 text-primary" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{insight.title}</h4>
                            <AlertDescription className="mt-1">{insight.description}</AlertDescription>
                          </div>
                          {insight.dismissible && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDismissInsight(insight.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {insight.actionLabel && (
                          <Button variant="outline" size="sm" className="mt-3">
                            {insight.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
                {filteredInsights.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                    <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
                    <p className="text-lg font-medium">All clear!</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      No {activeTab === 'all' ? 'alerts' : activeTab} at this time
                    </p>
                  </div>
                )}
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
