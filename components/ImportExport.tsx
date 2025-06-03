'use client';

import { Button } from '@/components/ui/button';
import { Download, Upload, X } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ImportExportProps {
  deltaInput: string;
  onImport: (content: string) => void;
  className?: string;
}

export function ImportExport({ deltaInput, onImport, className = '' }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000); // Auto-hide after 4 seconds
  };

  const validateAndProcessFile = useCallback((file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      showNotification('error', 'Please select a valid JSON file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File is too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Validate JSON format
        JSON.parse(content);
        
        onImport(content);
        showNotification('success', `Successfully imported ${file.name}`);
      } catch (error) {
        console.error('Import error:', error);
        showNotification('error', 'Invalid JSON file format');
      }
    };

    reader.onerror = () => {
      showNotification('error', 'Failed to read file');
    };

    reader.readAsText(file);
  }, [onImport]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndProcessFile(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (!file) {
      showNotification('error', 'No file dropped');
      return;
    }

    if (files.length > 1) {
      showNotification('error', 'Please drop only one file at a time');
      return;
    }

    validateAndProcessFile(file);
  }, [validateAndProcessFile]);

  const handleExport = () => {
    try {
      if (!deltaInput.trim()) {
        showNotification('error', 'No Delta content to export');
        return;
      }

      // Validate that the content is valid JSON before exporting
      JSON.parse(deltaInput);

      const blob = new Blob([deltaInput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      a.href = url;
      a.download = `delta-${timestamp}.json`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('success', 'Delta JSON exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('error', 'Failed to export: Invalid JSON content');
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <TooltipProvider>
      <div className={`space-y-3 ${className}`}>
        {/* Drag & Drop Zone + Import/Export Buttons */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm text-muted-foreground text-center">
              {isDragOver ? (
                <span className="text-primary font-medium">Drop JSON file here</span>
              ) : (
                <span>Drag & drop JSON file or use buttons below</span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImportClick}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import Delta JSON from file (Ctrl+O)</p>
                </TooltipContent>
              </Tooltip>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,application/json"
                className="hidden"
              />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={!deltaInput.trim()}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!deltaInput.trim() 
                      ? 'No content to export' 
                      : 'Export Delta JSON to file (Ctrl+S)'
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <Alert variant={notification.type === 'error' ? 'destructive' : 'default'}>
            <div className="flex items-center justify-between">
              <AlertDescription className="text-sm">
                {notification.message}
              </AlertDescription>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissNotification}
                    className="h-auto p-1 ml-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dismiss notification</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </Alert>
        )}
      </div>
    </TooltipProvider>
  );
} 