'use client';

import { QuillDelta } from '@/types/quill';
import Image from 'next/image';

interface QuillRendererProps {
  delta: QuillDelta | null;
  readOnly?: boolean;
  className?: string;
}

export function QuillRenderer({ 
  delta, 
  readOnly = true, 
  className = '' 
}: QuillRendererProps) {

  // Simple function to render Delta operations as HTML
  const renderDeltaAsHtml = (delta: QuillDelta | null) => {
    if (!delta || !delta.ops) {
      return <p className="text-muted-foreground">No content to display</p>;
    }

    return (
      <div className="prose prose-sm max-w-none">
        {delta.ops.map((op, index) => {
          if (typeof op.insert === 'string') {
            const text = op.insert;
            const attrs = op.attributes || {};
            
            let element = <span key={index}>{text}</span>;
            
            // Apply formatting
            if (attrs.bold) {
              element = <strong key={index}>{text}</strong>;
            }
            if (attrs.italic) {
              element = <em key={index}>{element}</em>;
            }
            if (attrs.header === 1) {
              element = <h1 key={index} className="text-2xl font-bold">{text}</h1>;
            }
            if (attrs.header === 2) {
              element = <h2 key={index} className="text-xl font-bold">{text}</h2>;
            }
            if (attrs.header === 3) {
              element = <h3 key={index} className="text-lg font-bold">{text}</h3>;
            }
            if (attrs.link) {
              element = <a key={index} href={attrs.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{text}</a>;
            }
            
            // Handle line breaks
            if (text.includes('\n')) {
              const parts = text.split('\n');
              element = (
                <span key={index}>
                  {parts.map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < parts.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              );
            }
            
            return element;
          } else if (typeof op.insert === 'object') {
            // Handle embedded content like images
            const embedObj = op.insert as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
            if (embedObj.image) {
              return (
                <Image 
                  key={index} 
                  src={embedObj.image} 
                  alt="Embedded content" 
                  width={300}
                  height={200}
                  className="max-w-full h-auto my-2"
                />
              );
            }
          }
          
          return null;
        })}
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Delta Preview</h2>
        <div className="text-sm text-muted-foreground">
          {readOnly ? 'Read-only' : 'Editable'} • Simple Renderer
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
        {renderDeltaAsHtml(delta)}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-sm text-muted-foreground">
        <span>
          {delta ? (
            <span className="text-green-600">✓ Delta rendered</span>
          ) : (
            <span>No Delta content</span>
          )}
        </span>
        <span>
          {delta?.ops?.length || 0} operations
        </span>
      </div>
    </div>
  );
} 