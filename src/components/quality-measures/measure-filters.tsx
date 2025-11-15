/**
 * Advanced filters component for Quality Measures
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QualityProgram, MeasureDomain, MeasureStatus, QualityMeasureFilters } from '@/types/quality-measures';
import { X } from 'lucide-react';

interface MeasureFiltersProps {
  filters: QualityMeasureFilters;
  onFiltersChange: (filters: QualityMeasureFilters) => void;
  onReset: () => void;
}

const programOptions: { value: QualityProgram; label: string }[] = [
  { value: QualityProgram.HEDIS, label: 'HEDIS' },
  { value: QualityProgram.MIPS, label: 'MIPS' },
  { value: QualityProgram.PQRS, label: 'PQRS' },
  { value: QualityProgram.NQF, label: 'NQF' },
  { value: QualityProgram.CMS_STAR, label: 'CMS Star' },
  { value: QualityProgram.CUSTOM, label: 'Custom' },
];

const domainOptions: { value: MeasureDomain; label: string }[] = [
  { value: MeasureDomain.EFFECTIVENESS_OF_CARE, label: 'Effectiveness of Care' },
  { value: MeasureDomain.PREVENTION, label: 'Prevention' },
  { value: MeasureDomain.CHRONIC_CARE, label: 'Chronic Care' },
  { value: MeasureDomain.BEHAVIORAL_HEALTH, label: 'Behavioral Health' },
  { value: MeasureDomain.ACCESS_AVAILABILITY, label: 'Access & Availability' },
  { value: MeasureDomain.EXPERIENCE_OF_CARE, label: 'Experience of Care' },
  { value: MeasureDomain.UTILIZATION, label: 'Utilization' },
  { value: MeasureDomain.PATIENT_SAFETY, label: 'Patient Safety' },
];

const statusOptions: { value: MeasureStatus; label: string }[] = [
  { value: MeasureStatus.ACTIVE, label: 'Active' },
  { value: MeasureStatus.DRAFT, label: 'Draft' },
  { value: MeasureStatus.RETIRED, label: 'Retired' },
  { value: MeasureStatus.DEPRECATED, label: 'Deprecated' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function MeasureFilters({ filters, onFiltersChange, onReset }: MeasureFiltersProps) {
  const [selectedProgram, setSelectedProgram] = useState<QualityProgram | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState<MeasureDomain | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MeasureStatus | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [steward, setSteward] = useState('');

  useEffect(() => {
    const newFilters: QualityMeasureFilters = {};

    if (selectedProgram !== 'all') {
      newFilters.program = [selectedProgram];
    }

    if (selectedDomain !== 'all') {
      newFilters.domain = [selectedDomain];
    }

    if (selectedStatus !== 'all') {
      newFilters.status = [selectedStatus];
    }

    if (selectedYear !== 'all') {
      newFilters.effectiveYear = selectedYear;
    }

    if (steward.trim()) {
      newFilters.steward = steward.trim();
    }

    onFiltersChange(newFilters);
  }, [selectedProgram, selectedDomain, selectedStatus, selectedYear, steward, onFiltersChange]);

  const handleReset = () => {
    setSelectedProgram('all');
    setSelectedDomain('all');
    setSelectedStatus('all');
    setSelectedYear('all');
    setSteward('');
    onReset();
  };

  const hasActiveFilters =
    selectedProgram !== 'all' ||
    selectedDomain !== 'all' ||
    selectedStatus !== 'all' ||
    selectedYear !== 'all' ||
    steward.trim() !== '';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Program Filter */}
          <div className="space-y-2">
            <Label htmlFor="program-filter">Program</Label>
            <Select
              value={selectedProgram}
              onValueChange={(value) => setSelectedProgram(value as QualityProgram | 'all')}
            >
              <SelectTrigger id="program-filter">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain Filter */}
          <div className="space-y-2">
            <Label htmlFor="domain-filter">Domain</Label>
            <Select
              value={selectedDomain}
              onValueChange={(value) => setSelectedDomain(value as MeasureDomain | 'all')}
            >
              <SelectTrigger id="domain-filter">
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domainOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as MeasureStatus | 'all')}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Effective Year Filter */}
          <div className="space-y-2">
            <Label htmlFor="year-filter">Effective Year</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(value === 'all' ? 'all' : parseInt(value))}
            >
              <SelectTrigger id="year-filter">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Steward Filter */}
          <div className="space-y-2">
            <Label htmlFor="steward-filter">Steward</Label>
            <Select
              value={steward || 'all'}
              onValueChange={(value) => setSteward(value === 'all' ? '' : value)}
            >
              <SelectTrigger id="steward-filter">
                <SelectValue placeholder="All Stewards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stewards</SelectItem>
                <SelectItem value="NCQA">NCQA</SelectItem>
                <SelectItem value="CMS">CMS</SelectItem>
                <SelectItem value="NQF">NQF</SelectItem>
                <SelectItem value="AMA">AMA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {selectedProgram !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                Program: {programOptions.find((o) => o.value === selectedProgram)?.label}
              </span>
            )}
            {selectedDomain !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                Domain: {domainOptions.find((o) => o.value === selectedDomain)?.label}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                Status: {statusOptions.find((o) => o.value === selectedStatus)?.label}
              </span>
            )}
            {selectedYear !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                Year: {selectedYear}
              </span>
            )}
            {steward.trim() && (
              <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700">
                Steward: {steward}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

