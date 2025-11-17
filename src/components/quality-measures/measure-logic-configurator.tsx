/**
 * Measure Logic Configurator (Story 6.3)
 * Configure denominator, numerator, and exclusion logic for quality measures
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Trash2,
  Save,
  TestTube,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface LogicRule {
  id: string;
  valueSetId: string;
  valueSetName: string;
  operator: 'AND' | 'OR' | 'NOT' | 'AT_LEAST_ONE';
  timeframeValue?: number;
  timeframeUnit?: 'DAYS' | 'MONTHS' | 'YEARS';
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  sequence: number;
}

interface MeasureLogicConfiguratorProps {
  measureId?: string;
  existingLogic?: {
    denominator?: LogicRule[];
    numerator?: LogicRule[];
    exclusion?: LogicRule[];
  };
  onSave?: (logic: any) => void;
  onCancel?: () => void;
}

export function MeasureLogicConfigurator({
  measureId,
  existingLogic,
  onSave,
  onCancel,
}: MeasureLogicConfiguratorProps) {
  const [denominatorRules, setDenominatorRules] = useState<LogicRule[]>(
    existingLogic?.denominator || []
  );
  const [numeratorRules, setNumeratorRules] = useState<LogicRule[]>(
    existingLogic?.numerator || []
  );
  const [exclusionRules, setExclusionRules] = useState<LogicRule[]>(
    existingLogic?.exclusion || []
  );

  const [activeTab, setActiveTab] = useState<'denominator' | 'numerator' | 'exclusion'>(
    'denominator'
  );
  const [showValueSetPicker, setShowValueSetPicker] = useState(false);
  const [valueSets, setValueSets] = useState<any[]>([]);

  // Add a new logic rule
  const addRule = (type: 'denominator' | 'numerator' | 'exclusion') => {
    const newRule: LogicRule = {
      id: `rule-${Date.now()}`,
      valueSetId: '',
      valueSetName: '',
      operator: 'AT_LEAST_ONE',
      sequence: 0,
    };

    if (type === 'denominator') {
      setDenominatorRules([...denominatorRules, newRule]);
    } else if (type === 'numerator') {
      setNumeratorRules([...numeratorRules, newRule]);
    } else {
      setExclusionRules([...exclusionRules, newRule]);
    }
  };

  // Remove a logic rule
  const removeRule = (type: 'denominator' | 'numerator' | 'exclusion', ruleId: string) => {
    if (type === 'denominator') {
      setDenominatorRules(denominatorRules.filter((r) => r.id !== ruleId));
    } else if (type === 'numerator') {
      setNumeratorRules(numeratorRules.filter((r) => r.id !== ruleId));
    } else {
      setExclusionRules(exclusionRules.filter((r) => r.id !== ruleId));
    }
  };

  // Update a logic rule
  const updateRule = (
    type: 'denominator' | 'numerator' | 'exclusion',
    ruleId: string,
    updates: Partial<LogicRule>
  ) => {
    const updateFn = (rules: LogicRule[]) =>
      rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r));

    if (type === 'denominator') {
      setDenominatorRules(updateFn(denominatorRules));
    } else if (type === 'numerator') {
      setNumeratorRules(updateFn(numeratorRules));
    } else {
      setExclusionRules(updateFn(exclusionRules));
    }
  };

  // Render a single logic rule editor
  const renderRule = (rule: LogicRule, type: 'denominator' | 'numerator' | 'exclusion') => (
    <Card key={rule.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Logic Rule #{rule.sequence + 1}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeRule(type, rule.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Value Set Selection */}
          <div className="col-span-2">
            <Label>Value Set</Label>
            <Select
              value={rule.valueSetId}
              onValueChange={(value) => {
                const valueSet = valueSets.find((vs) => vs.id === value);
                updateRule(type, rule.id, {
                  valueSetId: value,
                  valueSetName: valueSet?.name || '',
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a value set..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs-diabetes">Diabetes Diagnosis Codes</SelectItem>
                <SelectItem value="vs-hba1c">HbA1c Test Procedures</SelectItem>
                <SelectItem value="vs-colonoscopy">Colonoscopy Procedures</SelectItem>
                <SelectItem value="vs-mammography">Mammography Procedures</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operator */}
          <div>
            <Label>Operator</Label>
            <Select
              value={rule.operator}
              onValueChange={(value: any) => updateRule(type, rule.id, { operator: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AT_LEAST_ONE">At least one</SelectItem>
                <SelectItem value="AND">All required (AND)</SelectItem>
                <SelectItem value="OR">Any one (OR)</SelectItem>
                <SelectItem value="NOT">None (NOT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe */}
          <div>
            <Label>Timeframe</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={rule.timeframeValue || ''}
                onChange={(e) =>
                  updateRule(type, rule.id, {
                    timeframeValue: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-20"
              />
              <Select
                value={rule.timeframeUnit}
                onValueChange={(value: any) =>
                  updateRule(type, rule.id, { timeframeUnit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAYS">Days</SelectItem>
                  <SelectItem value="MONTHS">Months</SelectItem>
                  <SelectItem value="YEARS">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Age Range (Denominator only) */}
          {type === 'denominator' && (
            <>
              <div>
                <Label>Min Age</Label>
                <Input
                  type="number"
                  placeholder="18"
                  value={rule.ageMin || ''}
                  onChange={(e) =>
                    updateRule(type, rule.id, {
                      ageMin: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label>Max Age</Label>
                <Input
                  type="number"
                  placeholder="75"
                  value={rule.ageMax || ''}
                  onChange={(e) =>
                    updateRule(type, rule.id, {
                      ageMax: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </>
          )}

          {/* Gender (Denominator only) */}
          {type === 'denominator' && (
            <div>
              <Label>Gender</Label>
              <Select
                value={rule.gender}
                onValueChange={(value) => updateRule(type, rule.id, { gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Logic Summary */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-900">
            <strong>Summary:</strong>{' '}
            {rule.valueSetName || 'Select a value set'}{' '}
            {rule.operator && `(${rule.operator.toLowerCase()})`}
            {rule.timeframeValue &&
              rule.timeframeUnit &&
              ` within ${rule.timeframeValue} ${rule.timeframeUnit.toLowerCase()}`}
            {rule.ageMin && ` for ages ${rule.ageMin}-${rule.ageMax || '∞'}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  // Validation
  const validateLogic = () => {
    const errors: string[] = [];

    if (denominatorRules.length === 0) {
      errors.push('Denominator logic is required');
    }

    if (numeratorRules.length === 0) {
      errors.push('Numerator logic is required');
    }

    denominatorRules.forEach((rule, idx) => {
      if (!rule.valueSetId) {
        errors.push(`Denominator Rule #${idx + 1}: Value set is required`);
      }
    });

    numeratorRules.forEach((rule, idx) => {
      if (!rule.valueSetId) {
        errors.push(`Numerator Rule #${idx + 1}: Value set is required`);
      }
    });

    exclusionRules.forEach((rule, idx) => {
      if (!rule.valueSetId) {
        errors.push(`Exclusion Rule #${idx + 1}: Value set is required`);
      }
    });

    return errors;
  };

  const handleSave = () => {
    const errors = validateLogic();

    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.join('\n')}`);
      return;
    }

    if (onSave) {
      onSave({
        denominator: denominatorRules,
        numerator: numeratorRules,
        exclusion: exclusionRules,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configure Measure Logic</h2>
          <p className="text-sm text-gray-500 mt-1">
            Define denominator, numerator, and exclusion criteria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <TestTube className="mr-2 h-4 w-4" />
            Test Logic
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Logic
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-cyan-50 border-cyan-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-cyan-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-cyan-900">
                Configuring Measure Logic
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                Define the criteria for each component of the quality measure. Value sets
                contain groups of medical codes. Use operators and timeframes to specify
                when and how codes should be evaluated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="denominator" className="relative">
            Denominator
            {denominatorRules.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {denominatorRules.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="numerator" className="relative">
            Numerator
            {numeratorRules.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {numeratorRules.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="exclusion" className="relative">
            Exclusions
            {exclusionRules.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {exclusionRules.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Denominator Tab */}
        <TabsContent value="denominator" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Denominator Logic</CardTitle>
              <p className="text-sm text-gray-600">
                Define the eligible population for this measure
              </p>
            </CardHeader>
            <CardContent>
              {denominatorRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No denominator rules defined</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add logic rules to define the eligible population
                  </p>
                  <Button className="mt-4" size="sm" onClick={() => addRule('denominator')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Rule
                  </Button>
                </div>
              ) : (
                <>
                  {denominatorRules.map((rule) => renderRule(rule, 'denominator'))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => addRule('denominator')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Denominator Rule
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Numerator Tab */}
        <TabsContent value="numerator" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Numerator Logic</CardTitle>
              <p className="text-sm text-gray-600">
                Define the criteria for measure compliance
              </p>
            </CardHeader>
            <CardContent>
              {numeratorRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No numerator rules defined</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add logic rules to define compliance criteria
                  </p>
                  <Button className="mt-4" size="sm" onClick={() => addRule('numerator')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Rule
                  </Button>
                </div>
              ) : (
                <>
                  {numeratorRules.map((rule) => renderRule(rule, 'numerator'))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => addRule('numerator')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Numerator Rule
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exclusions Tab */}
        <TabsContent value="exclusion" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exclusion Logic (Optional)</CardTitle>
              <p className="text-sm text-gray-600">
                Define criteria for excluding patients from the measure
              </p>
            </CardHeader>
            <CardContent>
              {exclusionRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No exclusions defined</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Exclusions are optional - add them if needed
                  </p>
                  <Button className="mt-4" size="sm" variant="outline" onClick={() => addRule('exclusion')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exclusion Rule
                  </Button>
                </div>
              ) : (
                <>
                  {exclusionRules.map((rule) => renderRule(rule, 'exclusion'))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => addRule('exclusion')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exclusion Rule
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Status */}
      <Card className={validateLogic().length === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {validateLogic().length === 0 ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Measure logic is complete
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    All required components are configured. Ready to save!
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Validation errors ({validateLogic().length})
                  </p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                    {validateLogic().map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

