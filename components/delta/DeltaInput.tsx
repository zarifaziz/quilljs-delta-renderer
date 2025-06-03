'use client';

import { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, RotateCcw, AlertCircle } from 'lucide-react';
import { validateDelta, formatDeltaJson, sampleDeltas, ValidationResult } from '@/lib/deltaValidation';

interface DeltaInputProps {
  value: string;
  onChange: (value: string, validation: ValidationResult) => void;
  className?: string;
}

export function DeltaInput({ value, onChange, className = '' }: DeltaInputProps) {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });
  const [copySuccess, setCopySuccess] = useState(false);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = validateDelta(value);
      setValidation(result);
      onChange(value, result);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onChange]);

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    const deltaValue = newValue || '';
    onChange(deltaValue, validation);
  }, [onChange, validation]);

  const handleClear = useCallback(() => {
    onChange('', { isValid: false, error: 'JSON input is empty' });
  }, [onChange]);

  const handleFormat = useCallback(() => {
    const formatted = formatDeltaJson(value);
    onChange(formatted, validation);
  }, [value, onChange, validation]);

  const handleLoadSample = useCallback((sampleKey: string) => {
    const sample = sampleDeltas[sampleKey as keyof typeof sampleDeltas];
    if (sample) {
      const formatted = JSON.stringify(sample, null, 2);
      onChange(formatted, { isValid: true, delta: sample });
    }
  }, [onChange]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [value]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Delta JSON Input</h2>
        <div className="flex items-center gap-2">
          <Select onValueChange={handleLoadSample}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Examples" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="complex">Complex</SelectItem>
              <SelectItem value="withImage">With Image</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleFormat}
            disabled={!value.trim()}
          >
            Format
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!value.trim()}
          >
            <Copy className="h-4 w-4" />
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!value.trim()}
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Error display */}
      {!validation.isValid && validation.error && (
        <Alert variant="destructive" className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validation.error}</AlertDescription>
        </Alert>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'always',
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-sm text-muted-foreground">
        <span>
          {validation.isValid ? (
            <span className="text-green-600">✓ Valid Delta JSON</span>
          ) : (
            <span className="text-red-600">✗ Invalid JSON</span>
          )}
        </span>
        <span>
          {value.length} characters
        </span>
      </div>
    </div>
  );
} 