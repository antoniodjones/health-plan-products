/**
 * Dashboard - Main Landing Page
 * Real-time insights and quick actions
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Package,
  FileCode,
  Link2,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Upload,
  Download,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time insights and quick actions for your platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="mt-2 text-3xl font-bold">24</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">12%</span>
                  <span className="ml-1 text-gray-600">vs last month</span>
                </div>
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
                <p className="text-sm font-medium text-gray-600">Medical Codes</p>
                <p className="mt-2 text-3xl font-bold">12,847</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">8%</span>
                  <span className="ml-1 text-gray-600">vs last month</span>
                </div>
              </div>
              <div className="rounded-full bg-purple-50 p-3">
                <FileCode className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Mappings</p>
                <p className="mt-2 text-3xl font-bold">3,492</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">18%</span>
                  <span className="ml-1 text-gray-600">vs last month</span>
                </div>
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <Link2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Rate</p>
                <p className="mt-2 text-3xl font-bold">87%</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-600">2%</span>
                  <span className="ml-1 text-gray-600">vs last month</span>
                </div>
              </div>
              <div className="rounded-full bg-orange-50 p-3">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-50 p-3">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Product</h3>
                  <p className="text-sm text-gray-500">Add new health plan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-50 p-3">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Import Codes</h3>
                  <p className="text-sm text-gray-500">Bulk upload medical codes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-50 p-3">
                  <Link2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Mapping</h3>
                  <p className="text-sm text-gray-500">Link codes to benefits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-50 p-3">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-500">Performance insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alerts & Notifications</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">127 unmapped codes detected</p>
                  <p className="mt-1 text-sm text-red-700">
                    Medical codes require mapping to benefit packages
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Review Codes
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="font-medium text-amber-900">Low coverage in ICD-10 codes</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Coverage is at 45%, below the 80% threshold
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Improve Coverage
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Bulk mapping suggestion available</p>
                  <p className="mt-1 text-sm text-blue-700">
                    234 similar codes can be mapped in bulk
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Review Suggestions
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Created new product', item: 'Medicare Advantage Plan 2024', time: '2 hours ago', icon: Package },
                { action: 'Imported medical codes', item: '1,247 ICD-10 codes', time: '5 hours ago', icon: FileCode },
                { action: 'Updated code mapping', item: 'CPT codes to Primary Care', time: '1 day ago', icon: Link2 },
                { action: 'Generated analytics report', item: 'Q4 2024 Performance', time: '2 days ago', icon: Activity },
                { action: 'Created benefit package', item: 'Preventive Care Bundle', time: '3 days ago', icon: CheckCircle2 },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                    <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

