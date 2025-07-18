'use client';

import React, { ReactNode } from 'react';
import { QuillDelta } from '@/types/quill';
import { processTextWithFormulas, containsFormulas, renderFormula } from '@/lib/katex-processor';

interface QuillRendererProps {
  delta: QuillDelta | null;
  className?: string;
}

export function QuillRenderer({ 
  delta, 
  className = '' 
}: QuillRendererProps) {

  // Helper function to render text with potential KaTeX formulas
  const renderTextWithFormulas = (text: string): ReactNode => {
    if (!containsFormulas(text)) {
      return text;
    }
    
    // Process the text to render formulas
    const processedHtml = processTextWithFormulas(text);
    
    // Return as JSX using dangerouslySetInnerHTML for KaTeX rendered content
    return <span dangerouslySetInnerHTML={{ __html: processedHtml }} />;
  };

  // Function to render Delta operations as HTML
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
          let listItemContent = <span>{renderTextWithFormulas(text)}</span>;
          
          // Handle formula attribute in list items
          if (attrs.formula) {
            const formulaHtml = processTextWithFormulas(text);
            listItemContent = <span dangerouslySetInnerHTML={{ __html: formulaHtml }} />;
          }
          
          // Apply formatting to list item
          if (attrs.bold && !attrs.formula) {
            listItemContent = <strong>{text}</strong>;
          }
          if (attrs.italic && !attrs.formula) {
            listItemContent = <em>{listItemContent}</em>;
          }
          if (attrs.underline && !attrs.formula) {
            listItemContent = <u>{listItemContent}</u>;
          }
          if (attrs.strike && !attrs.formula) {
            listItemContent = <s>{listItemContent}</s>;
          }
          if (attrs.code && !attrs.formula) {
            listItemContent = <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{text}</code>;
          }
          if (attrs.link && !attrs.formula) {
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
          let element: ReactNode = renderTextWithFormulas(text);
          
          // Handle formula attribute - if this is a formula, treat it specially
          if (attrs.formula) {
            // For formula attributes, render the formula directly
            const formulaHtml = processTextWithFormulas(text);
            element = <span dangerouslySetInnerHTML={{ __html: formulaHtml }} />;
          }
          
          // Apply inline formatting in the correct order, chaining them
          if (attrs.code && !attrs.formula) {
            element = <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{element}</code>;
          }
          if (attrs.bold && !attrs.formula) {
            element = <strong>{element}</strong>;
          }
          if (attrs.italic && !attrs.formula) {
            element = <em>{element}</em>;
          }
          if (attrs.underline && !attrs.formula) {
            element = <u>{element}</u>;
          }
          if (attrs.strike && !attrs.formula) {
            element = <s>{element}</s>;
          }
          if (attrs.link && !attrs.formula) {
            element = <a href={attrs.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{element}</a>;
          }
          
          // Handle block-level formatting
          if (attrs.header === 1) {
            element = <h1 key={index} className="text-2xl font-bold mb-2 mt-4">{element}</h1>;
          } else if (attrs.header === 2) {
            element = <h2 key={index} className="text-xl font-bold mb-2 mt-3">{element}</h2>;
          } else if (attrs.header === 3) {
            element = <h3 key={index} className="text-lg font-bold mb-2 mt-2">{element}</h3>;
          } else if (attrs.blockquote) {
            element = <blockquote key={index} className="border-l-4 border-muted-foreground/30 pl-4 my-2 italic text-muted-foreground">{element}</blockquote>;
          } else if (attrs['code-block']) {
            element = <pre key={index} className="bg-muted p-3 rounded font-mono text-sm overflow-x-auto my-2"><code>{element}</code></pre>;
          } else {
            // Wrap in span with key for regular text
            element = <span key={index}>{element}</span>;
          }
          
          // Handle alignment
          if (attrs.align) {
            const alignClass = attrs.align === 'center' ? 'text-center' : 
                              attrs.align === 'right' ? 'text-right' : 
                              attrs.align === 'justify' ? 'text-justify' : 'text-left';
            element = <div key={`${index}-align`} className={alignClass}>{element}</div>;
          }
          
          // Handle line breaks while preserving formatting
          if (text.includes('\n')) {
            const parts = text.split('\n');
            
            // Apply formatting to each part and handle line breaks
            const formattedParts = parts.map((part, i) => {
              let partElement: ReactNode = renderTextWithFormulas(part);
              
              // Apply the same inline formatting to each part (skip if formula)
              if (attrs.code && !attrs.formula) {
                partElement = <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{partElement}</code>;
              }
              if (attrs.bold && !attrs.formula) {
                partElement = <strong>{partElement}</strong>;
              }
              if (attrs.italic && !attrs.formula) {
                partElement = <em>{partElement}</em>;
              }
              if (attrs.underline && !attrs.formula) {
                partElement = <u>{partElement}</u>;
              }
              if (attrs.strike && !attrs.formula) {
                partElement = <s>{partElement}</s>;
              }
              if (attrs.link && !attrs.formula) {
                partElement = <a href={attrs.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{partElement}</a>;
              }
              
              return (
                <span key={i}>
                  {partElement}
                  {i < parts.length - 1 && <br />}
                </span>
              );
            });
            
            // For block-level elements, wrap the formatted parts
            if (attrs.header === 1) {
              element = <h1 key={index} className="text-2xl font-bold mb-2 mt-4">{formattedParts}</h1>;
            } else if (attrs.header === 2) {
              element = <h2 key={index} className="text-xl font-bold mb-2 mt-3">{formattedParts}</h2>;
            } else if (attrs.header === 3) {
              element = <h3 key={index} className="text-lg font-bold mb-2 mt-2">{formattedParts}</h3>;
            } else if (attrs.blockquote) {
              element = <blockquote key={index} className="border-l-4 border-muted-foreground/30 pl-4 my-2 italic text-muted-foreground">{formattedParts}</blockquote>;
            } else if (attrs['code-block']) {
              element = <pre key={index} className="bg-muted p-3 rounded font-mono text-sm overflow-x-auto my-2"><code>{formattedParts}</code></pre>;
            } else {
              element = <span key={index}>{formattedParts}</span>;
            }
          }
          
          elements.push(element);
        }
      } else if (typeof op.insert === 'object') {
        // Handle embedded content like images and formulas
        const embedObj = op.insert as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        
        if (embedObj.formula) {
          // Handle formula inserts
          const attrs = op.attributes || {};
          
          // Build style object for the formula container
          const containerStyle: React.CSSProperties = {};
          if (attrs.size) {
            containerStyle.fontSize = `${attrs.size}px`;
          }
          
          let formulaElement: ReactNode = (
            <span 
              key={index} 
              className="formula-container inline-block align-middle"
              style={containerStyle}
              dangerouslySetInnerHTML={{ __html: renderFormula(embedObj.formula, attrs.size) }}
            />
          );
          
          // Apply text formatting attributes to formula if present
          if (attrs.bold) {
            formulaElement = <strong key={`${index}-bold`}>{formulaElement}</strong>;
          }
          if (attrs.italic) {
            formulaElement = <em key={`${index}-italic`}>{formulaElement}</em>;
          }
          if (attrs.underline) {
            formulaElement = <u key={`${index}-underline`}>{formulaElement}</u>;
          }
          if (attrs.strike) {
            formulaElement = <s key={`${index}-strike`}>{formulaElement}</s>;
          }
          
          elements.push(formulaElement);
        } else if (embedObj.image) {
          elements.push(
            <img 
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

  return (
    <div className={`h-full flex flex-col ${className}`}>
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