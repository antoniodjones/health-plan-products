/**
 * Value Set Code Editor (Story 6.2 Extension)
 * Add, remove, and manage codes within a value set
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeTypeBadge } from '@/components/codes/code-type-badge';
import {
  Plus,
  Search,
  Trash2,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Code {
  id: string;
  code: string;
  codeType: string;
  description: string;
}

interface ValueSetCodeEditorProps {
  valueSetId: string;
  valueSetName: string;
  codes: any[];
  onCodesUpdated?: () => void;
}

export function ValueSetCodeEditor({
  valueSetId,
  valueSetName,
  codes: initialCodes,
  onCodesUpdated,
}: ValueSetCodeEditorProps) {
  const [codes, setCodes] = useState(initialCodes);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchResults, setSearchResults] = useState<Code[]>([]);
  const [codeSearch, setCodeSearch] = useState('');
  const [codeTypeFilter, setCodeTypeFilter] = useState('ALL');
  const [searching, setSearching] = useState(false);

  // Search for codes to add
  const handleSearchCodes = async () => {
    if (!codeSearch) return;

    setSearching(true);
    try {
      const params = new URLSearchParams();
      params.append('search', codeSearch);
      if (codeTypeFilter !== 'ALL') {
        params.append('codeType', codeTypeFilter);
      }
      params.append('pageSize', '50');

      const response = await fetch(`/api/codes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out codes already in the value set
        const existingCodeIds = new Set(codes.map((c: any) => c.codeSet?.id || c.id));
        const filtered = data.codes.filter((c: any) => !existingCodeIds.has(c.id));
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching codes:', error);
    } finally {
      setSearching(false);
    }
  };

  // Add code to value set
  const handleAddCode = async (codeId: string) => {
    try {
      const response = await fetch(`/api/value-sets/${valueSetId}/codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSetId: codeId, included: true }),
      });

      if (response.ok) {
        // Refresh codes
        if (onCodesUpdated) {
          onCodesUpdated();
        }
        // Remove from search results
        setSearchResults(searchResults.filter((c) => c.id !== codeId));
      }
    } catch (error) {
      console.error('Error adding code:', error);
    }
  };

  // Remove code from value set
  const handleRemoveCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to remove this code from the value set?')) {
      return;
    }

    try {
      const response = await fetch(`/api/value-sets/${valueSetId}/codes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSetId: codeId }),
      });

      if (response.ok) {
        // Refresh codes
        if (onCodesUpdated) {
          onCodesUpdated();
        }
      }
    } catch (error) {
      console.error('Error removing code:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Codes in Value Set ({codes.length})
          </h3>
          <p className="text-sm text-gray-600">{valueSetName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Codes
          </Button>
        </div>
      </div>

      {/* Codes Table */}
      {codes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No codes in this value set</p>
            <p className="mt-2 text-sm text-gray-500">
              Add codes to define criteria for quality measure logic
            </p>
            <Button className="mt-4" size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Code
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {codes.map((codeEntry: any) => {
                    const code = codeEntry.codeSet || codeEntry;
                    return (
                      <tr key={code.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="font-mono font-semibold text-gray-900">
                            {code.code}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <CodeTypeBadge codeType={code.codeType} />
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">{code.description}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={codeEntry.included !== false ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {codeEntry.included !== false ? 'Included' : 'Excluded'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCode(code.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Codes Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Codes to Value Set</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Interface */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label>Search Codes</Label>
                <Input
                  placeholder="Search by code or description..."
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchCodes();
                    }
                  }}
                />
              </div>
              <div>
                <Label>Code Type</Label>
                <Select value={codeTypeFilter} onValueChange={setCodeTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="ICD_10_CM">ICD-10-CM</SelectItem>
                    <SelectItem value="CPT">CPT</SelectItem>
                    <SelectItem value="HCPCS">HCPCS</SelectItem>
                    <SelectItem value="LOINC">LOINC</SelectItem>
                    <SelectItem value="NDC">NDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={handleSearchCodes} disabled={searching}>
              <Search className="mr-2 h-4 w-4" />
              {searching ? 'Searching...' : 'Search Codes'}
            </Button>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Search Results ({searchResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {searchResults.map((code) => (
                      <div
                        key={code.id}
                        className="flex items-center justify-between rounded-lg border bg-white p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <CodeTypeBadge codeType={code.codeType} />
                          <div className="flex-1 min-w-0">
                            <p className="font-mono font-semibold text-gray-900">{code.code}</p>
                            <p className="text-sm text-gray-600 truncate">{code.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddCode(code.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {searchResults.length === 0 && codeSearch && !searching && (
              <Card className="bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="mb-4 h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">No codes found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

