/**
 * Badge component for Quality Measure Domains
 */
import { Badge } from '@/components/ui/badge';
import { MeasureDomain } from '@/types/quality-measures';

interface DomainBadgeProps {
  domain: MeasureDomain;
  className?: string;
}

const domainLabels: Record<MeasureDomain, string> = {
  EFFECTIVENESS_OF_CARE: 'Effectiveness of Care',
  ACCESS_AVAILABILITY: 'Access & Availability',
  EXPERIENCE_OF_CARE: 'Experience of Care',
  UTILIZATION: 'Utilization',
  HEALTH_PLAN_DESCRIPTIVE: 'Health Plan Descriptive',
  CLINICAL_DATA_SYSTEMS: 'Clinical Data Systems',
  PREVENTION: 'Prevention',
  CHRONIC_CARE: 'Chronic Care',
  BEHAVIORAL_HEALTH: 'Behavioral Health',
  PATIENT_SAFETY: 'Patient Safety',
};

export function DomainBadge({ domain, className }: DomainBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`bg-slate-50 text-slate-700 border-slate-200 ${className || ''}`}
    >
      {domainLabels[domain]}
    </Badge>
  );
}

