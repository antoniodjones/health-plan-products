/**
 * Badge component for displaying mapping status
 */
import { Badge } from '@/components/ui/badge';
import { MappingStatus } from '@/types/mappings';
import { CheckCircle2, XCircle, Edit, Clock } from 'lucide-react';

const statusConfig = {
  [MappingStatus.ACTIVE]: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-success/20 text-success dark:bg-success/30',
  },
  [MappingStatus.INACTIVE]: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-muted text-muted-foreground',
  },
  [MappingStatus.DRAFT]: {
    label: 'Draft',
    icon: Edit,
    className: 'bg-secondary/20 text-secondary dark:bg-secondary/30',
  },
  [MappingStatus.PENDING_REVIEW]: {
    label: 'Pending Review',
    icon: Clock,
    className: 'bg-primary/20 text-primary dark:bg-primary/30',
  },
};

interface MappingStatusBadgeProps {
  status: MappingStatus;
  showIcon?: boolean;
}

export function MappingStatusBadge({ status, showIcon = true }: MappingStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

