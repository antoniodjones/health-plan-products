/**
 * Code Mappings Page - Benefit & Equivalency Mappings (Epic 8)
 * Unified page for both benefit mappings and code equivalencies
 */
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EquivalencyMappings } from '@/components/mappings/equivalency-mappings';
import { BenefitMappings } from '@/components/mappings/benefit-mappings';
import { Link2, DollarSign } from 'lucide-react';

export default function MappingsPage() {
  const [activeTab, setActiveTab] = useState('benefit');

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Code Mappings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage benefit mappings and code equivalencies in one unified interface
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="benefit" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Benefit Mappings
          </TabsTrigger>
          <TabsTrigger value="equivalency" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Equivalency Mappings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="benefit" className="mt-6">
          <BenefitMappings />
        </TabsContent>

        <TabsContent value="equivalency" className="mt-6">
          <EquivalencyMappings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
