/**
 * Edit Measure Logic Page (Story 6.3)
 * Configure denominator, numerator, and exclusion logic
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MeasureLogicConfigurator } from '@/components/quality-measures/measure-logic-configurator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, RefreshCw } from 'lucide-react';

export default function EditMeasureLogicPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [measure, setMeasure] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeasure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchMeasure = async () => {
    try {
      const response = await fetch(`/api/quality-measures/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMeasure(data);
      }
    } catch (error) {
      console.error('Error fetching measure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (logic: any) => {
    try {
      // In a real implementation, you would save the logic to the API
      console.log('Saving logic:', logic);
      alert('Measure logic saved successfully!');
      router.push('/quality-measures');
    } catch (error) {
      console.error('Error saving logic:', error);
      alert('Failed to save measure logic');
    }
  };

  const handleCancel = () => {
    router.push('/quality-measures');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-4 text-sm text-gray-500">Loading measure...</p>
        </div>
      </div>
    );
  }

  if (!measure) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">Measure not found</p>
            <p className="text-sm text-gray-500 mt-2">
              The requested quality measure could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Measure Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-gray-900">{measure.name}</h1>
                <Badge>{measure.measureId}</Badge>
                <Badge variant="outline">{measure.program}</Badge>
              </div>
              <p className="text-sm text-gray-600">{measure.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurator */}
      <MeasureLogicConfigurator
        measureId={measure.id}
        existingLogic={{
          denominator: measure.logic?.filter((l: any) => l.logicType === 'DENOMINATOR') || [],
          numerator: measure.logic?.filter((l: any) => l.logicType === 'NUMERATOR') || [],
          exclusion: measure.logic?.filter((l: any) => l.logicType === 'EXCLUSION') || [],
        }}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

