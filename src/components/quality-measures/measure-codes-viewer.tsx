/**
 * Measure Codes Viewer Component
 * Shows all billing codes (ICD-10, CPT, HCPCS, NDC) used by a quality measure
 * Grouped by logic type (Denominator, Numerator, Exclusion)
 */
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MeasureLogic, LogicType } from '@/types/quality-measures';
import { Users, CheckCircle, XCircle, Plus, Trash2, Code2, FileText } from 'lucide-react';

interface MeasureCodesViewerProps {
  logic: MeasureLogic[];
}

const logicTypeConfig: Record<LogicType, { icon: any; label: string; color: string; bg: string; description: string }> = {
  DENOMINATOR: { 
    icon: Users, 
    label: 'Denominator', 
    color: 'text-blue-700', 
    bg: 'bg-blue-50 border-blue-200',
    description: 'Codes that identify eligible members for this measure'
  },
  NUMERATOR: { 
    icon: CheckCircle, 
    label: 'Numerator', 
    color: 'text-green-700', 
    bg: 'bg-green-50 border-green-200',
    description: 'Codes that indicate the member met the measure requirement'
  },
  EXCLUSION: { 
    icon: XCircle, 
    label: 'Exclusion', 
    color: 'text-red-700', 
    bg: 'bg-red-50 border-red-200',
    description: 'Codes that exclude members from the measure'
  },
  EXCEPTION: { 
    icon: XCircle, 
    label: 'Exception', 
    color: 'text-yellow-700', 
    bg: 'bg-yellow-50 border-yellow-200',
    description: 'Codes that provide valid exceptions'
  },
  STRATIFICATION: { 
    icon: Code2, 
    label: 'Stratification', 
    color: 'text-purple-700', 
    bg: 'bg-purple-50 border-purple-200',
    description: 'Codes used for measure stratification'
  },
};

const codeTypeColors: Record<string, { bg: string; text: string }> = {
  ICD_10_CM: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ICD_10_PCS: { bg: 'bg-blue-100', text: 'text-blue-700' },
  CPT: { bg: 'bg-green-100', text: 'text-green-700' },
  HCPCS: { bg: 'bg-purple-100', text: 'text-purple-700' },
  NDC: { bg: 'bg-orange-100', text: 'text-orange-700' },
  LOINC: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  SNOMED: { bg: 'bg-pink-100', text: 'text-pink-700' },
  DRG: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  REVENUE_CODE: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  CUSTOM: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export function MeasureCodesViewer({ logic }: MeasureCodesViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<LogicType>>(new Set(['DENOMINATOR', 'NUMERATOR', 'EXCLUSION']));

  // Group logic by type and collect all codes
  const groupedLogic = logic.reduce((acc, item) => {
    if (!acc[item.logicType]) {
      acc[item.logicType] = [];
    }
    acc[item.logicType].push(item);
    return acc;
  }, {} as Record<LogicType, MeasureLogic[]>);

  const toggleSection = (logicType: LogicType) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(logicType)) {
      newExpanded.delete(logicType);
    } else {
      newExpanded.add(logicType);
    }
    setExpandedSections(newExpanded);
  };

  if (logic.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Code2 className="mb-4 h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-900">No codes configured</p>
          <p className="mt-2 text-sm text-gray-500">
            This measure doesn't have any billing codes configured yet
          </p>
          <Button className="mt-4" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Codes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(groupedLogic).map(([logicType, items]) => {
          const config = logicTypeConfig[logicType as LogicType];
          const Icon = config.icon;
          const totalCodes = items.reduce((sum, item) => {
            return sum + (item.valueSet?.codes?.length || 0);
          }, 0);

          return (
            <Card key={logicType} className={`border-l-4 ${config.bg}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{config.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{totalCodes}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {items.length} value {items.length === 1 ? 'set' : 'sets'}
                    </p>
                  </div>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Code Lists */}
      {Object.entries(groupedLogic).map(([logicType, items]) => {
        const config = logicTypeConfig[logicType as LogicType];
        const Icon = config.icon;
        const isExpanded = expandedSections.has(logicType as LogicType);

        // Collect all unique codes from all value sets in this logic type
        const allCodes = items.flatMap(item => 
          item.valueSet?.codes?.map(vsCode => ({
            ...vsCode,
            valueSetName: item.valueSet?.name,
            valueSetId: item.valueSet?.valueSetId,
          })) || []
        );

        return (
          <Card key={logicType} className={`border-l-4 ${config.bg}`}>
            <CardContent className="p-6">
              {/* Header */}
              <button
                onClick={() => toggleSection(logicType as LogicType)}
                className="w-full flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2">
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-lg font-bold ${config.color}`}>
                      {config.label} ({allCodes.length} codes)
                    </h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Codes
                  </Button>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Codes List */}
              {isExpanded && (
                <div className="space-y-3">
                  {allCodes.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <Code2 className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">No codes in this value set</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Add Codes" to configure</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Group by value set */}
                      {items.map((item) => {
                        const valueSets = item.valueSet;
                        if (!valueSets || !valueSets.codes || valueSets.codes.length === 0) return null;

                        return (
                          <div key={item.id} className="space-y-2">
                            {/* Value Set Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-semibold text-gray-700">
                                {valueSets.name}
                              </span>
                              <Badge variant="outline" className="text-xs font-mono">
                                {valueSets.valueSetId}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                ({valueSets.codes.length} codes)
                              </span>
                            </div>

                            {/* Codes Grid */}
                            <div className="grid gap-2 sm:grid-cols-2">
                              {valueSets.codes.map((vsCode) => {
                                const codeSet = vsCode.codeSet;
                                if (!codeSet) return null;

                                const colorConfig = codeTypeColors[codeSet.codeType] || codeTypeColors.CUSTOM;

                                return (
                                  <div
                                    key={vsCode.id}
                                    className="flex items-start justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-semibold text-gray-900">
                                          {codeSet.code}
                                        </span>
                                        <Badge 
                                          variant="outline" 
                                          className={`${colorConfig.bg} ${colorConfig.text} border-0 text-xs`}
                                        >
                                          {codeSet.codeType}
                                        </Badge>
                                        {vsCode.included ? (
                                          <Badge className="bg-green-100 text-green-700 text-xs">
                                            ✓
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">
                                            ✗
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 line-clamp-2">
                                        {codeSet.description}
                                      </p>
                                      {vsCode.notes && (
                                        <p className="mt-1 text-xs text-gray-500 italic">
                                          Note: {vsCode.notes}
                                        </p>
                                      )}
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700 ml-2"
                                      onClick={() => {
                                        // Handle remove code
                                        console.log('Remove code:', codeSet.code);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Actions */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
        <div>
          <p className="text-sm font-medium text-gray-900">Configure Billing Codes</p>
          <p className="text-xs text-gray-500">
            Add or remove codes to define measure eligibility and compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Import from CSV
          </Button>
          <Button variant="outline" size="sm">
            Export All Codes
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Value Set
          </Button>
        </div>
      </div>
    </div>
  );
}

