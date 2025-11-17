/**
 * Data table for displaying code-to-benefit mappings
 */
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CodeTypeBadge } from '@/components/codes/code-type-badge';
import { MappingStatusBadge } from './mapping-status-badge';
import type { CodeMapping } from '@/types/mappings';
import { ChevronLeft, ChevronRight, Edit, Trash2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface MappingsTableProps {
  mappings: CodeMapping[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (mapping: CodeMapping) => void;
  onDelete?: (mapping: CodeMapping) => void;
}

export function MappingsTable({
  mappings,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: MappingsTableProps) {
  if (mappings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">No mappings found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or create a new mapping
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medical Code</TableHead>
              <TableHead></TableHead>
              <TableHead>Benefit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono font-medium">
                      {mapping.codeSet?.code}
                    </span>
                    {mapping.codeSet && (
                      <div className="mt-1">
                        <CodeTypeBadge codeType={mapping.codeSet.codeType as any} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{mapping.benefitSegment?.name}</span>
                    {mapping.benefitSegment?.category && (
                      <span className="text-xs text-muted-foreground">
                        {mapping.benefitSegment.category}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {mapping.mappingType.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={mapping.isActive ? 'default' : 'secondary'}>
                    {mapping.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-16 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${mapping.priority}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{mapping.priority}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(mapping.effectiveDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(mapping)}
                        title="Edit mapping"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(mapping)}
                        title="Delete mapping"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ variant, className, children }: any) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${className}`}>
      {children}
    </span>
  );
}

