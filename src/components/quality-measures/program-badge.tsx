/**
 * Badge component for Quality Measure Programs (HEDIS, MIPS, etc.)
 */
import { Badge } from '@/components/ui/badge';
import { QualityProgram } from '@/types/quality-measures';

interface ProgramBadgeProps {
  program: QualityProgram;
  className?: string;
}

const programStyles: Record<QualityProgram, { bg: string; text: string; label: string }> = {
  HEDIS: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'HEDIS' },
  MIPS: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'MIPS' },
  PQRS: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'PQRS' },
  NQF: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'NQF' },
  CMS_STAR: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'CMS Star' },
  CUSTOM: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Custom' },
};

export function ProgramBadge({ program, className }: ProgramBadgeProps) {
  const style = programStyles[program];

  return (
    <Badge
      variant="outline"
      className={`${style.bg} ${style.text} border-0 ${className || ''}`}
    >
      {style.label}
    </Badge>
  );
}

