/**
 * Multi-step wizard for importing codes from CSV/Excel
 */
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { ImportValidationResult, ImportProgress } from '@/types/codes';

interface CodeImportWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type WizardStep = 'upload' | 'validate' | 'confirm' | 'import' | 'complete';

export function CodeImportWizard({ open, onClose, onSuccess }: CodeImportWizardProps) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
      }
    },
  });

  const handleValidate = async () => {
    if (!file) return;

    setStep('validate');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/codes/import/validate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Validation failed');
      }

      const result = await response.json();
      setValidationResult(result);

      if (result.valid || result.validCount > 0) {
        setStep('confirm');
      } else {
        setError('No valid codes found in file');
        setStep('upload');
      }
    } catch (err: any) {
      setError(err.message);
      setStep('upload');
    }
  };

  const handleImport = async () => {
    if (!validationResult) return;

    setStep('import');
    setError(null);

    try {
      // Extract valid codes from validation result
      const codes = validationResult.preview; // In a real app, send all valid codes

      const response = await fetch('/api/codes/import/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codes,
          source: 'IMPORTED',
          skipDuplicates: true,
          updateExisting: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }

      const result = await response.json();
      setImportProgress({
        total: result.total,
        processed: result.total,
        successful: result.created + result.updated,
        failed: result.failed,
        status: 'completed',
      });

      setStep('complete');
    } catch (err: any) {
      setError(err.message);
      setStep('confirm');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/codes/import/template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'code-import-template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download template');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setValidationResult(null);
    setImportProgress(null);
    setError(null);
    onClose();
  };

  const handleComplete = () => {
    if (onSuccess) onSuccess();
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Medical Codes</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file containing medical codes to import
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Step {step === 'upload' ? 1 : step === 'validate' ? 2 : step === 'confirm' ? 3 : 4} of 4</span>
          </div>
          <Progress
            value={
              step === 'upload' ? 25 : step === 'validate' ? 50 : step === 'confirm' ? 75 : 100
            }
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground" />
              {file ? (
                <div className="text-center">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-medium">Drop your file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV, XLSX, and XLS files
                  </p>
                </div>
              )}
            </div>

            <Button variant="outline" onClick={handleDownloadTemplate} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleValidate} disabled={!file}>
                Validate File
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Validating */}
        {step === 'validate' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-medium">Validating file...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && validationResult && (
          <div className="space-y-4">
            <Alert variant={validationResult.valid ? 'default' : 'destructive'}>
              {validationResult.valid ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {validationResult.valid
                  ? 'All codes validated successfully'
                  : `Found ${validationResult.errorCount} validation errors`}
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total Rows</dt>
                  <dd className="text-2xl font-bold">{validationResult.validCount + validationResult.errorCount}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Valid Codes</dt>
                  <dd className="text-2xl font-bold text-success">{validationResult.validCount}</dd>
                </div>
                {validationResult.errorCount > 0 && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Errors</dt>
                    <dd className="text-2xl font-bold text-destructive">{validationResult.errorCount}</dd>
                  </div>
                )}
              </dl>
            </div>

            {validationResult.errorCount > 0 && validationResult.errors.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Validation Errors:</h4>
                <ul className="space-y-1 text-sm">
                  {validationResult.errors.slice(0, 10).map((error, i) => (
                    <li key={i} className="text-destructive">
                      Row {error.row}, {error.field}: {error.message}
                    </li>
                  ))}
                  {validationResult.errors.length > 10 && (
                    <li className="text-muted-foreground">
                      ...and {validationResult.errors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={validationResult.validCount === 0}>
                Import {validationResult.validCount} Codes
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Importing */}
        {step === 'import' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-medium">Importing codes...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 'complete' && importProgress && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold">Import Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Successfully imported {importProgress.successful} codes
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total</dt>
                  <dd className="text-2xl font-bold">{importProgress.total}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Successful</dt>
                  <dd className="text-2xl font-bold text-success">{importProgress.successful}</dd>
                </div>
                {importProgress.failed > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Failed</dt>
                    <dd className="text-2xl font-bold text-destructive">{importProgress.failed}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleComplete}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

