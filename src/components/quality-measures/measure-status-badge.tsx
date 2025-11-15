/**
 * Badge component for Quality Measure Status
 */
import { Badge } from '@/components/ui/badge';
import { MeasureStatus } from '@/types/quality-measures';

interface MeasureStatusBadgeProps {
  status: MeasureStatus;
  className?: string;
}

const statusStyles: Record<MeasureStatus, { bg: string; text: string; icon: string }> = {
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', icon: '●' },
  DRAFT: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '◐' },
  RETIRED: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '○' },
  DEPRECATED: { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },
};

export function MeasureStatusBadge({ status, className }: MeasureStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <Badge
      variant="outline"
      className={`${style.bg} ${style.text} border-0 ${className || ''}`}
    >
      <span className="mr-1">{style.icon}</span>
      {status}
    </Badge>
  );
}

