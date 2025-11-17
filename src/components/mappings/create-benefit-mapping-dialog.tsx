/**
 * Create Benefit Mapping Dialog
 * Allows users to create new code-to-benefit mappings
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
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface CodeSearchResult {
  id: string;
  code: string;
  codeType: string;
  description: string;
  category: string;
}

interface BenefitSearchResult {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface CreateBenefitMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBenefitMappingDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateBenefitMappingDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState([50]);
  const [notes, setNotes] = useState('');

  // Code search
  const [codeSearch, setCodeSearch] = useState('');
  const [codeResults, setCodeResults] = useState<CodeSearchResult[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeSearchResult | null>(null);
  const [codeSearching, setCodeSearching] = useState(false);

  // Benefit search
  const [benefitSearch, setBenefitSearch] = useState('');
  const [benefitResults, setBenefitResults] = useState<BenefitSearchResult[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitSearchResult | null>(null);
  const [benefitSearching, setBenefitSearching] = useState(false);

  // Search for codes
  const searchCodes = async (query: string) => {
    if (!query || query.length < 2) {
      setCodeResults([]);
      return;
    }

    setCodeSearching(true);
    try {
      const response = await fetch(`/api/codes?search=${encodeURIComponent(query)}&pageSize=10`);
      if (response.ok) {
        const data = await response.json();
        setCodeResults(data.codes || []);
      }
    } catch (error) {
      console.error('Error searching codes:', error);
    } finally {
      setCodeSearching(false);
    }
  };

  // Search for benefits
  const searchBenefits = async (query: string) => {
    if (!query || query.length < 2) {
      setBenefitResults([]);
      return;
    }

    setBenefitSearching(true);
    try {
      // For now, use mock data until benefit segments API exists
      // TODO: Replace with actual API call when benefit segments are implemented
      const mockBenefits: BenefitSearchResult[] = [
        {
          id: '1',
          name: 'Preventive Care',
          category: 'Medical',
          description: 'Preventive services covered at 100%',
        },
        {
          id: '2',
          name: 'Diagnostic Services',
          category: 'Medical',
          description: 'Diagnostic procedures and tests',
        },
        {
          id: '3',
          name: 'Laboratory Services',
          category: 'Medical',
          description: 'Lab tests and pathology',
        },
        {
          id: '4',
          name: 'Specialty Office Visits',
          category: 'Medical',
          description: 'Visits to specialists',
        },
      ].filter(
        (b) =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          b.description.toLowerCase().includes(query.toLowerCase())
      );
      setBenefitResults(mockBenefits);
    } catch (error) {
      console.error('Error searching benefits:', error);
    } finally {
      setBenefitSearching(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedCode || !selectedBenefit) {
      toast.error('Validation Error', 'Please select both a code and a benefit segment');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeSetId: selectedCode.id,
          benefitSegmentId: selectedBenefit.id,
          mappingType: 'BENEFIT',
          priority: priority[0],
          isActive: true,
          metadata: notes ? { notes } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create mapping');
      }

      toast.success('Mapping Created', `Successfully mapped ${selectedCode.code} to ${selectedBenefit.name}`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating mapping:', error);
      toast.error('Creation Failed', 'Failed to create mapping. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleClose = () => {
    setCodeSearch('');
    setBenefitSearch('');
    setCodeResults([]);
    setBenefitResults([]);
    setSelectedCode(null);
    setSelectedBenefit(null);
    setPriority([50]);
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Benefit Mapping</DialogTitle>
          <DialogDescription>
            Map a medical code to a benefit segment for coverage determination
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Code Selection */}
          <div className="space-y-2">
            <Label>
              Medical Code <span className="text-red-500">*</span>
            </Label>
            {selectedCode ? (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Badge>{selectedCode.codeType}</Badge>
                <span className="font-mono font-medium">{selectedCode.code}</span>
                <span className="text-sm text-gray-600 flex-1">{selectedCode.description}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCode(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={codeSearch}
                    onChange={(e) => {
                      setCodeSearch(e.target.value);
                      searchCodes(e.target.value);
                    }}
                    placeholder="Search by code or description..."
                    className="pl-10"
                  />
                </div>
                {codeSearching && <p className="text-sm text-gray-500">Searching...</p>}
                {codeResults.length > 0 && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {codeResults.map((code) => (
                      <button
                        key={code.id}
                        onClick={() => {
                          setSelectedCode(code);
                          setCodeResults([]);
                          setCodeSearch('');
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

          {/* Benefit Segment Selection */}
          <div className="space-y-2">
            <Label>
              Benefit Segment <span className="text-red-500">*</span>
            </Label>
            {selectedBenefit ? (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Badge variant="outline">{selectedBenefit.category}</Badge>
                <span className="font-medium">{selectedBenefit.name}</span>
                <span className="text-sm text-gray-600 flex-1">
                  {selectedBenefit.description}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBenefit(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={benefitSearch}
                    onChange={(e) => {
                      setBenefitSearch(e.target.value);
                      searchBenefits(e.target.value);
                    }}
                    placeholder="Search benefit segments..."
                    className="pl-10"
                  />
                </div>
                {benefitSearching && <p className="text-sm text-gray-500">Searching...</p>}
                {benefitResults.length > 0 && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {benefitResults.map((benefit) => (
                      <button
                        key={benefit.id}
                        onClick={() => {
                          setSelectedBenefit(benefit);
                          setBenefitResults([]);
                          setBenefitSearch('');
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                      >
                        <Badge variant="outline">{benefit.category}</Badge>
                        <div className="flex-1">
                          <p className="font-medium">{benefit.name}</p>
                          <p className="text-sm text-gray-500">{benefit.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority: {priority[0]}</Label>
            <Slider
              value={priority}
              onValueChange={setPriority}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
            <p className="text-xs text-gray-500">
              Higher priority mappings take precedence when multiple mappings exist
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this mapping..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Mapping'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

