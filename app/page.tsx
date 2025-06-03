'use client';

import { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DeltaInput } from '@/components/delta/DeltaInput';
import { QuillRenderer } from '@/components/delta/QuillRenderer';
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

  const leftPanel = (
    <DeltaInput
      value={deltaInput}
      onChange={handleDeltaInputChange}
    />
  );

  const rightPanel = (
    <QuillRenderer
      delta={currentDelta}
      readOnly={true}
    />
  );

  return (
    <Layout 
      leftPanel={leftPanel}
      rightPanel={rightPanel}
    />
  );
}
