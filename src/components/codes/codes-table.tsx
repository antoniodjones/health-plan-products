/**
 * Data table for displaying medical codes
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
import { CodeTypeBadge } from './code-type-badge';
import { CodeStatusBadge } from './code-status-badge';
import type { MedicalCode } from '@/types/codes';
import { ChevronLeft, ChevronRight, Edit, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface CodesTableProps {
  codes: MedicalCode[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView?: (code: MedicalCode) => void;
  onEdit?: (code: MedicalCode) => void;
  onDelete?: (code: MedicalCode) => void;
}

export function CodesTable({
  codes,
  page,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: CodesTableProps) {
  if (codes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">No codes found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search terms
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
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono font-medium">{code.code}</TableCell>
                <TableCell>
                  <CodeTypeBadge codeType={code.codeType} />
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={code.description}>
                    {code.description}
                  </div>
                </TableCell>
                <TableCell>
                  {code.category && (
                    <span className="rounded-md bg-muted px-2 py-1 text-xs">
                      {code.category}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <CodeStatusBadge status={code.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(code.effectiveDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(code)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(code)}
                        title="Edit code"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(code)}
                        title="Delete code"
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

