/**
 * Statistics cards for code library overview
 */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeStatistics } from '@/types/codes';
import { Activity, CheckCircle2, Tag, TrendingUp } from 'lucide-react';

interface CodeStatsCardsProps {
  statistics: CodeStatistics;
}

export function CodeStatsCards({ statistics }: CodeStatsCardsProps) {
  const stats = [
    {
      title: 'Total Codes',
      value: statistics.totalCodes.toLocaleString(),
      icon: Activity,
      description: 'All medical codes',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Active Codes',
      value: statistics.activeCount.toLocaleString(),
      icon: CheckCircle2,
      description: 'Currently in use',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Custom Codes',
      value: statistics.customCount.toLocaleString(),
      icon: Tag,
      description: 'Organization-specific',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Recently Added',
      value: statistics.recentlyAdded.toLocaleString(),
      icon: TrendingUp,
      description: 'Last 7 days',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

