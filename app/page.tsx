'use client';

import { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DeltaInput } from '@/components/delta/DeltaInput';
import { QuillRenderer } from '@/components/delta/QuillRenderer';
import { ImportExport } from '@/components/ImportExport';
import { HelpModal } from '@/components/HelpModal';
import { QuillDelta } from '@/types/quill';
import { ValidationResult } from '@/lib/deltaValidation';

export default function Home() {
  const [deltaInput, setDeltaInput] = useState('');
  const [currentDelta, setCurrentDelta] = useState<QuillDelta | null>(null);

  const handleDeltaInputChange = useCallback((value: string, validation: ValidationResult) => {
    setDeltaInput(value);
    
    if (validation.isValid && validation.delta) {
      setCurrentDelta(validation.delta);
    } else {
      setCurrentDelta(null);
    }
  }, []);

  const handleImport = useCallback((content: string) => {
    setDeltaInput(content);
    // Trigger validation by calling handleDeltaInputChange
    // The DeltaInput component will handle validation internally
  }, []);

  const leftPanel = (
    <div className="h-full flex flex-col">
      {/* Import/Export Section */}
      <div className="p-4 border-b border-border">
        <ImportExport
          deltaInput={deltaInput}
          onImport={handleImport}
        />
      </div>
      
      {/* Delta Input */}
      <div className="flex-1">
        <DeltaInput
          value={deltaInput}
          onChange={handleDeltaInputChange}
          className="h-full"
        />
      </div>
    </div>
  );

  const rightPanel = (
    <div className="h-full flex flex-col">
      {/* Controls Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Delta Preview</div>
          <HelpModal />
        </div>
      </div>
      
      {/* Renderer */}
      <div className="flex-1">
        <QuillRenderer
          delta={currentDelta}
        />
      </div>
    </div>
  );

  return (
    <Layout 
      leftPanel={leftPanel}
      rightPanel={rightPanel}
    />
  );
}
