/**
 * Badge component for displaying code status
 */
import { Badge } from '@/components/ui/badge';
import { CodeStatus } from '@/types/codes';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

const statusConfig = {
  [CodeStatus.ACTIVE]: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-success/20 text-success dark:bg-success/30',
  },
  [CodeStatus.INACTIVE]: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-muted text-muted-foreground',
  },
  [CodeStatus.DEPRECATED]: {
    label: 'Deprecated',
    icon: AlertCircle,
    className: 'bg-destructive/20 text-destructive dark:bg-destructive/30',
  },
  [CodeStatus.PENDING]: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-secondary/20 text-secondary dark:bg-secondary/30',
  },
};

interface CodeStatusBadgeProps {
  status: CodeStatus;
  showIcon?: boolean;
}

export function CodeStatusBadge({ status, showIcon = true }: CodeStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

