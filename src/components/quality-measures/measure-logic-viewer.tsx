/**
 * Measure Logic Viewer Component
 * Displays denominator, numerator, exclusion logic for quality measures
 */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MeasureLogic, LogicType } from '@/types/quality-measures';
import { Users, CheckCircle, XCircle, Filter, Calendar, Hash } from 'lucide-react';

interface MeasureLogicViewerProps {
  logic: MeasureLogic[];
}

const logicTypeConfig: Record<LogicType, { icon: any; label: string; color: string; bg: string }> = {
  DENOMINATOR: { 
    icon: Users, 
    label: 'Denominator', 
    color: 'text-blue-700', 
    bg: 'bg-blue-50 border-blue-200' 
  },
  NUMERATOR: { 
    icon: CheckCircle, 
    label: 'Numerator', 
    color: 'text-green-700', 
    bg: 'bg-green-50 border-green-200' 
  },
  EXCLUSION: { 
    icon: XCircle, 
    label: 'Exclusion', 
    color: 'text-red-700', 
    bg: 'bg-red-50 border-red-200' 
  },
  EXCEPTION: { 
    icon: Filter, 
    label: 'Exception', 
    color: 'text-yellow-700', 
    bg: 'bg-yellow-50 border-yellow-200' 
  },
  STRATIFICATION: { 
    icon: Hash, 
    label: 'Stratification', 
    color: 'text-purple-700', 
    bg: 'bg-purple-50 border-purple-200' 
  },
};

export function MeasureLogicViewer({ logic }: MeasureLogicViewerProps) {
  // Group logic by type
  const groupedLogic = logic.reduce((acc, item) => {
    if (!acc[item.logicType]) {
      acc[item.logicType] = [];
    }
    acc[item.logicType].push(item);
    return acc;
  }, {} as Record<LogicType, MeasureLogic[]>);

  // Sort each group by sequence
  Object.keys(groupedLogic).forEach((type) => {
    groupedLogic[type as LogicType].sort((a, b) => a.sequence - b.sequence);
  });

  const renderLogicItem = (item: MeasureLogic) => {
    const criteria = item.criteriaJson as any;
    
    return (
      <div key={item.id} className="space-y-3 rounded-lg border bg-white p-4">
        {/* Age Range */}
        {(item.ageMin !== null || item.ageMax !== null) && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Age Range</div>
              <div className="text-sm text-gray-900">
                {item.ageMin !== null && item.ageMax !== null
                  ? `${item.ageMin}-${item.ageMax} years`
                  : item.ageMin !== null
                  ? `≥ ${item.ageMin} years`
                  : `≤ ${item.ageMax} years`}
              </div>
            </div>
          </div>
        )}

        {/* Gender */}
        {item.gender && (
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Gender</div>
              <div className="text-sm text-gray-900">
                {item.gender === 'M' ? 'Male' : item.gender === 'F' ? 'Female' : 'Any'}
              </div>
            </div>
          </div>
        )}

        {/* Value Set */}
        {item.valueSet && (
          <div className="flex items-start gap-3">
            <Filter className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Value Set</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm text-gray-900">{item.valueSet.valueSetId}</span>
                <Badge variant="outline" className="text-xs">
                  {item.valueSet.name}
                </Badge>
                {item.valueSet.codes && (
                  <span className="text-xs text-gray-500">
                    ({item.valueSet.codes.length} codes)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Operator */}
        {item.operator && (
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 flex items-center justify-center text-gray-400 mt-0.5">
              <span className="text-xs font-bold">&</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Operator</div>
              <Badge variant="outline" className="mt-1">
                {item.operator}
              </Badge>
            </div>
          </div>
        )}

        {/* Timeframe */}
        {item.timeframeValue && item.timeframeUnit && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Timeframe</div>
              <div className="text-sm text-gray-900">
                Within {item.timeframeValue} {item.timeframeUnit.toLowerCase()}
              </div>
            </div>
          </div>
        )}

        {/* Additional Criteria */}
        {criteria && (
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Additional Criteria</div>
            {criteria.description && (
              <div className="text-sm text-gray-900 mb-2">{criteria.description}</div>
            )}
            {Object.entries(criteria).map(([key, value]) => {
              if (key === 'description') return null;
              return (
                <div key={key} className="flex justify-between text-xs py-1">
                  <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-gray-900 font-medium">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (logic.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Filter className="mb-4 h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-900">No logic defined</p>
          <p className="mt-2 text-sm text-gray-500">
            Measure logic has not been configured yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedLogic).map(([logicType, items]) => {
        const config = logicTypeConfig[logicType as LogicType];
        const Icon = config.icon;

        return (
          <Card key={logicType} className={`border-l-4 ${config.bg}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-lg bg-white p-2`}>
                  <Icon className={`h-6 w-6 ${config.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${config.color}`}>{config.label}</h3>
                  <p className="text-sm text-gray-600">
                    {items.length} {items.length === 1 ? 'rule' : 'rules'} defined
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {items.map(renderLogicItem)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

