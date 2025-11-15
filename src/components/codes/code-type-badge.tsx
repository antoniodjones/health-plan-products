/**
 * Badge component for displaying code types with icons
 */
import { Badge } from '@/components/ui/badge';
import { CodeType } from '@/types/codes';
import {
  Activity,
  Pill,
  FileText,
  Syringe,
  DollarSign,
  Building2,
  TestTube,
  Dna,
  Tag,
} from 'lucide-react';

const codeTypeConfig = {
  [CodeType.ICD_10]: {
    label: 'ICD-10',
    icon: Activity,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  [CodeType.CPT]: {
    label: 'CPT',
    icon: FileText,
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  [CodeType.HCPCS]: {
    label: 'HCPCS',
    icon: Syringe,
    className: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  },
  [CodeType.NDC]: {
    label: 'NDC',
    icon: Pill,
    className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  },
  [CodeType.REVENUE]: {
    label: 'Revenue',
    icon: DollarSign,
    className: 'bg-success/20 text-success dark:bg-success/30',
  },
  [CodeType.DRG]: {
    label: 'DRG',
    icon: Building2,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  },
  [CodeType.LOINC]: {
    label: 'LOINC',
    icon: TestTube,
    className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  },
  [CodeType.SNOMED]: {
    label: 'SNOMED',
    icon: Dna,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  },
  [CodeType.CUSTOM]: {
    label: 'Custom',
    icon: Tag,
    className: 'bg-primary/20 text-primary dark:bg-primary/30',
  },
};

interface CodeTypeBadgeProps {
  codeType: CodeType;
  showIcon?: boolean;
}

export function CodeTypeBadge({ codeType, showIcon = true }: CodeTypeBadgeProps) {
  const config = codeTypeConfig[codeType];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

