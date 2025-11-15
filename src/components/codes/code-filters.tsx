/**
 * Filter panel for code library
 */
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeType, CodeStatus, CodeSource, type CodeFilters } from '@/types/codes';
import { Search, Filter, X } from 'lucide-react';

interface CodeFiltersProps {
  filters: CodeFilters;
  onFiltersChange: (filters: CodeFilters) => void;
  onReset: () => void;
}

export function CodeFilters({ filters, onFiltersChange, onReset }: CodeFiltersProps) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search });
  };

  const handleFilterChange = (key: keyof CodeFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)
  ).length;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Code Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">Code Type</label>
            <Select
              value={filters.codeType?.[0]}
              onValueChange={(value) =>
                handleFilterChange('codeType', value ? [value as CodeType] : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(CodeType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <Select
              value={filters.status?.[0]}
              onValueChange={(value) =>
                handleFilterChange('status', value ? [value as CodeStatus] : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(CodeStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div>
            <label className="mb-2 block text-sm font-medium">Source</label>
            <Select
              value={filters.source?.[0]}
              onValueChange={(value) =>
                handleFilterChange('source', value ? [value as CodeSource] : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {Object.values(CodeSource).map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Only */}
          <div>
            <label className="mb-2 block text-sm font-medium">Type</label>
            <Select
              value={
                filters.isCustom === true
                  ? 'custom'
                  : filters.isCustom === false
                  ? 'standard'
                  : 'all'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'isCustom',
                  value === 'custom' ? true : value === 'standard' ? false : undefined
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Codes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Codes</SelectItem>
                <SelectItem value="standard">Standard Codes</SelectItem>
                <SelectItem value="custom">Custom Codes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
            </span>
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

