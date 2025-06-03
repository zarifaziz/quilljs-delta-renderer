'use client';

import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  defaultSplitPosition?: number;
}

export function SplitPane({ 
  left, 
  right, 
  className = '', 
  defaultSplitPosition = 50 
}: SplitPaneProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [splitPosition, setSplitPosition] = useState(defaultSplitPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    setIsDragging(true);
    e.preventDefault();
  }, [isMobile]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || isMobile) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Constrain between 20% and 80%
    const constrainedPosition = Math.max(20, Math.min(80, newPosition));
    setSplitPosition(constrainedPosition);
  }, [isDragging, isMobile]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (isMobile) {
    return (
      <div ref={containerRef} className={`h-full w-full flex flex-col ${className}`}>
        <div className="flex-1 overflow-auto border-b border-border">
          {left}
        </div>
        <div className="flex-1 overflow-auto">
          {right}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`h-full w-full relative flex ${className}`}
    >
      <div 
        className="overflow-auto border-r border-border"
        style={{ width: `${splitPosition}%` }}
      >
        {left}
      </div>
      
      {/* Resize handle */}
      <div
        className={`w-1 bg-border hover:bg-accent cursor-col-resize flex-shrink-0 relative group ${
          isDragging ? 'bg-accent' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 w-2 -ml-0.5 z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-muted-foreground/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div 
        className="overflow-auto flex-1"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {right}
      </div>
    </div>
  );
} 