/**
 * Badge component for displaying product status
 */
import { Badge } from '@/components/ui/badge';
import { ProductStatus } from '@/types/products';
import { CheckCircle2, XCircle, Edit, Eye, Archive, Clock } from 'lucide-react';

const statusConfig = {
  [ProductStatus.DRAFT]: {
    label: 'Draft',
    icon: Edit,
    className: 'bg-muted text-muted-foreground',
  },
  [ProductStatus.IN_REVIEW]: {
    label: 'In Review',
    icon: Eye,
    className: 'bg-secondary/20 text-secondary dark:bg-secondary/30',
  },
  [ProductStatus.APPROVED]: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-success/20 text-success dark:bg-success/30',
  },
  [ProductStatus.ACTIVE]: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-success/20 text-success dark:bg-success/30',
  },
  [ProductStatus.INACTIVE]: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-muted text-muted-foreground',
  },
  [ProductStatus.ARCHIVED]: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-muted text-muted-foreground',
  },
};

interface ProductStatusBadgeProps {
  status: ProductStatus;
  showIcon?: boolean;
}

export function ProductStatusBadge({ status, showIcon = true }: ProductStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

