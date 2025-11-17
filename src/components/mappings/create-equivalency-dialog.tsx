/**
 * Create Code Equivalency Dialog
 * Allows users to create new code equivalencies
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, X, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface CodeSearchResult {
  id: string;
  code: string;
  codeType: string;
  description: string;
  category: string;
}

interface CreateEquivalencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateEquivalencyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateEquivalencyDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('LABORATORY');
  const [source, setSource] = useState<string>('MANUAL');
  const [confidence, setConfidence] = useState([100]);
  const [relationship, setRelationship] = useState<string>('EXACT');
  const [bidirectional, setBidirectional] = useState(true);

  // Source code search
  const [sourceCodeSearch, setSourceCodeSearch] = useState('');
  const [sourceCodeResults, setSourceCodeResults] = useState<CodeSearchResult[]>([]);
  const [selectedSourceCode, setSelectedSourceCode] = useState<CodeSearchResult | null>(null);
  const [sourceCodeSearching, setSourceCodeSearching] = useState(false);

  // Target code search
  const [targetCodeSearch, setTargetCodeSearch] = useState('');
  const [targetCodeResults, setTargetCodeResults] = useState<CodeSearchResult[]>([]);
  const [selectedTargetCode, setSelectedTargetCode] = useState<CodeSearchResult | null>(null);
  const [targetCodeSearching, setTargetCodeSearching] = useState(false);

  // Search for codes
  const searchCodes = async (query: string, isSource: boolean) => {
    if (!query || query.length < 2) {
      if (isSource) setSourceCodeResults([]);
      else setTargetCodeResults([]);
      return;
    }

    if (isSource) setSourceCodeSearching(true);
    else setTargetCodeSearching(true);

    try {
      const response = await fetch(`/api/codes?search=${encodeURIComponent(query)}&pageSize=10`);
      if (response.ok) {
        const data = await response.json();
        if (isSource) {
          setSourceCodeResults(data.codes || []);
        } else {
          setTargetCodeResults(data.codes || []);
        }
      }
    } catch (error) {
      console.error('Error searching codes:', error);
    } finally {
      if (isSource) setSourceCodeSearching(false);
      else setTargetCodeSearching(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !selectedSourceCode || !selectedTargetCode) {
      toast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create equivalency
      const equivalencyResponse = await fetch('/api/code-equivalencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category,
          source,
          confidence: confidence[0] / 100, // Convert to 0-1 scale
        }),
      });

      if (!equivalencyResponse.ok) {
        throw new Error('Failed to create equivalency');
      }

      const equivalency = await equivalencyResponse.json();

      // Create mapping
      const mappingResponse = await fetch('/api/equivalency-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equivalencyId: equivalency.id,
          sourceCodeId: selectedSourceCode.id,
          targetCodeId: selectedTargetCode.id,
          relationship,
          bidirectional,
        }),
      });

      if (!mappingResponse.ok) {
        throw new Error('Failed to create mapping');
      }

      // Success!
      toast.success('Equivalency Created', `Successfully created "${name}" equivalency mapping`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating equivalency:', error);
      toast.error('Creation Failed', 'Failed to create equivalency. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleClose = () => {
    setName('');
    setDescription('');
    setCategory('LABORATORY');
    setSource('MANUAL');
    setConfidence([100]);
    setRelationship('EXACT');
    setBidirectional(true);
    setSourceCodeSearch('');
    setTargetCodeSearch('');
    setSourceCodeResults([]);
    setTargetCodeResults([]);
    setSelectedSourceCode(null);
    setSelectedTargetCode(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Code Equivalency</DialogTitle>
          <DialogDescription>
            Create a new equivalency mapping between two medical codes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., HbA1c Test"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this equivalency represents..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LABORATORY">Laboratory</SelectItem>
                    <SelectItem value="PROCEDURE">Procedure</SelectItem>
                    <SelectItem value="DIAGNOSIS">Diagnosis</SelectItem>
                    <SelectItem value="MEDICATION">Medication</SelectItem>
                    <SelectItem value="OBSERVATION">Observation</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="SUPPLY">Supply</SelectItem>
                    <SelectItem value="DME">DME</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="source">Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                    <SelectItem value="CMS_CROSSWALK">CMS Crosswalk</SelectItem>
                    <SelectItem value="LOINC_MAPPING">LOINC Mapping</SelectItem>
                    <SelectItem value="SNOMED_MAPPING">SNOMED Mapping</SelectItem>
                    <SelectItem value="AI_SUGGESTED">AI Suggested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Code Selection */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-4">Code Mapping</h4>

              {/* Source Code */}
              <div className="space-y-2">
                <Label>
                  Source Code <span className="text-red-500">*</span>
                </Label>
                {selectedSourceCode ? (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Badge>{selectedSourceCode.codeType}</Badge>
                    <span className="font-mono font-medium">{selectedSourceCode.code}</span>
                    <span className="text-sm text-gray-600 flex-1">
                      {selectedSourceCode.description}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSourceCode(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        value={sourceCodeSearch}
                        onChange={(e) => {
                          setSourceCodeSearch(e.target.value);
                          searchCodes(e.target.value, true);
                        }}
                        placeholder="Search by code or description..."
                        className="pl-10"
                      />
                    </div>
                    {sourceCodeSearching && (
                      <p className="text-sm text-gray-500">Searching...</p>
                    )}
                    {sourceCodeResults.length > 0 && (
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {sourceCodeResults.map((code) => (
                          <button
                            key={code.id}
                            onClick={() => {
                              setSelectedSourceCode(code);
                              setSourceCodeResults([]);
                              setSourceCodeSearch('');
                            }}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                          >
                            <Badge variant="outline">{code.codeType}</Badge>
                            <span className="font-mono font-medium">{code.code}</span>
                            <span className="text-sm text-gray-600">{code.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow Indicator */}
              {selectedSourceCode && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
              )}

              {/* Target Code */}
              <div className="space-y-2">
                <Label>
                  Target Code <span className="text-red-500">*</span>
                </Label>
                {selectedTargetCode ? (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Badge>{selectedTargetCode.codeType}</Badge>
                    <span className="font-mono font-medium">{selectedTargetCode.code}</span>
                    <span className="text-sm text-gray-600 flex-1">
                      {selectedTargetCode.description}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTargetCode(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        value={targetCodeSearch}
                        onChange={(e) => {
                          setTargetCodeSearch(e.target.value);
                          searchCodes(e.target.value, false);
                        }}
                        placeholder="Search by code or description..."
                        className="pl-10"
                      />
                    </div>
                    {targetCodeSearching && (
                      <p className="text-sm text-gray-500">Searching...</p>
                    )}
                    {targetCodeResults.length > 0 && (
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {targetCodeResults.map((code) => (
                          <button
                            key={code.id}
                            onClick={() => {
                              setSelectedTargetCode(code);
                              setTargetCodeResults([]);
                              setTargetCodeSearch('');
                            }}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                          >
                            <Badge variant="outline">{code.codeType}</Badge>
                            <span className="font-mono font-medium">{code.code}</span>
                            <span className="text-sm text-gray-600">{code.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Relationship & Confidence */}
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="relationship">Relationship Type</Label>
                <Select value={relationship} onValueChange={setRelationship}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXACT">Exact Match</SelectItem>
                    <SelectItem value="BROADER">Broader Than</SelectItem>
                    <SelectItem value="NARROWER">Narrower Than</SelectItem>
                    <SelectItem value="RELATED">Related To</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bidirectional"
                  checked={bidirectional}
                  onChange={(e) => setBidirectional(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="bidirectional" className="cursor-pointer">
                  Bidirectional (works both ways)
                </Label>
              </div>
            </div>

            <div>
              <Label>
                Confidence: {confidence[0]}%
              </Label>
              <Slider
                value={confidence}
                onValueChange={setConfidence}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                How confident are you that these codes are equivalent?
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Equivalency'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

