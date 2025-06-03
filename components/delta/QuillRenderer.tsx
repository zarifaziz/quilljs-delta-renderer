'use client';

import React, { ReactNode, useState } from 'react';
import { QuillDelta } from '@/types/quill';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface QuillRendererProps {
  delta: QuillDelta | null;
  readOnly?: boolean;
  onChange?: (delta: QuillDelta) => void;
  className?: string;
}

export function QuillRenderer({ 
  delta, 
  readOnly = true, 
  onChange,
  className = '' 
}: QuillRendererProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Simple function to render Delta operations as HTML
  const renderDeltaAsHtml = (delta: QuillDelta | null) => {
    if (!delta || !delta.ops) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <p>No content to display</p>
          <p className="text-xs mt-2">Paste Delta JSON in the left panel to see the preview</p>
        </div>
      );
    }

    const elements: ReactNode[] = [];
    let currentListItems: ReactNode[] = [];
    let currentListType: string | null = null;

    delta.ops.forEach((op, index) => {
      if (typeof op.insert === 'string') {
        const text = op.insert;
        const attrs = op.attributes || {};
        
        // Handle list items
        if (attrs.list) {
          const listType = attrs.list;
          
          // If we're starting a new list or changing list type
          if (currentListType !== listType) {
            // Push any existing list
            if (currentListItems.length > 0 && currentListType) {
              if (currentListType === 'bullet') {
                elements.push(
                  <ul key={`list-${elements.length}`} className="list-disc list-inside ml-4 space-y-1 my-2">
                    {currentListItems}
                  </ul>
                );
              } else if (currentListType === 'ordered') {
                elements.push(
                  <ol key={`list-${elements.length}`} className="list-decimal list-inside ml-4 space-y-1 my-2">
                    {currentListItems}
                  </ol>
                );
              }
            }
            currentListItems = [];
            currentListType = listType;
          }
          
          // Add current item to list
          let listItemContent = <span>{text}</span>;
          
          // Apply formatting to list item
          if (attrs.bold) {
            listItemContent = <strong>{text}</strong>;
          }
          if (attrs.italic) {
            listItemContent = <em>{listItemContent}</em>;
          }
          if (attrs.link) {
            listItemContent = <a href={attrs.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{text}</a>;
          }
          
          currentListItems.push(
            <li key={`item-${index}`}>
              {listItemContent}
            </li>
          );
        } else {
          // Not a list item - finish any current list first
          if (currentListItems.length > 0 && currentListType) {
            if (currentListType === 'bullet') {
              elements.push(
                <ul key={`list-${elements.length}`} className="list-disc list-inside ml-4 space-y-1 my-2">
                  {currentListItems}
                </ul>
              );
            } else if (currentListType === 'ordered') {
              elements.push(
                <ol key={`list-${elements.length}`} className="list-decimal list-inside ml-4 space-y-1 my-2">
                  {currentListItems}
                </ol>
              );
            }
            currentListItems = [];
            currentListType = null;
          }
          
          // Handle regular text elements
          let element = <span key={index}>{text}</span>;
          
          // Apply formatting
          if (attrs.bold) {
            element = <strong key={index}>{text}</strong>;
          }
          if (attrs.italic) {
            element = <em key={index}>{element}</em>;
          }
          if (attrs.header === 1) {
            element = <h1 key={index} className="text-2xl font-bold mb-2 mt-4">{text}</h1>;
          }
          if (attrs.header === 2) {
            element = <h2 key={index} className="text-xl font-bold mb-2 mt-3">{text}</h2>;
          }
          if (attrs.header === 3) {
            element = <h3 key={index} className="text-lg font-bold mb-2 mt-2">{text}</h3>;
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
          
          elements.push(element);
        }
      } else if (typeof op.insert === 'object') {
        // Handle embedded content like images
        const embedObj = op.insert as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (embedObj.image) {
          elements.push(
            <Image 
              key={index} 
              src={embedObj.image} 
              alt="Embedded content" 
              width={300}
              height={200}
              className="max-w-full h-auto my-2 rounded border"
            />
          );
        }
      }
    });

    // Don't forget to add any remaining list items
    if (currentListItems.length > 0 && currentListType) {
      if (currentListType === 'bullet') {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside ml-4 space-y-1 my-2">
            {currentListItems}
          </ul>
        );
      } else if (currentListType === 'ordered') {
        elements.push(
          <ol key={`list-${elements.length}`} className="list-decimal list-inside ml-4 space-y-1 my-2">
            {currentListItems}
          </ol>
        );
      }
    }

    return (
      <div className="prose prose-sm max-w-none space-y-2">
        {elements}
      </div>
    );
  };

  // Simple edit mode using textarea for now (can be upgraded to full Quill later)
  const renderEditableContent = (delta: QuillDelta | null) => {
    const deltaJson = delta ? JSON.stringify(delta, null, 2) : '';
    
    return (
      <div className="space-y-4">
        <div className="bg-muted/30 p-3 rounded border">
          <p className="text-sm text-muted-foreground mb-2">
            ⚠️ Edit mode is simplified - editing the JSON directly. 
            Future versions will include rich text editing.
          </p>
        </div>
        <textarea
          value={deltaJson}
          onChange={(e) => {
            try {
              const newDelta = JSON.parse(e.target.value);
              if (onChange) onChange(newDelta);
            } catch {
              // Invalid JSON, ignore for now
            }
          }}
          className="w-full h-64 p-3 border rounded font-mono text-sm resize-none"
          placeholder="Edit Delta JSON here..."
        />
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Delta Preview</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {readOnly ? (
              <>
                <Eye className="h-4 w-4" />
                Read-only
              </>
            ) : isEditing ? (
              <>
                <Edit className="h-4 w-4" />
                Editing
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </div>
          {!readOnly && (
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
        {!readOnly && isEditing ? renderEditableContent(delta) : renderDeltaAsHtml(delta)}
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