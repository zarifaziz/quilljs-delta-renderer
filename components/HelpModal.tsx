'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, ExternalLink, Upload, RefreshCw, Eye } from 'lucide-react';
import { useState } from 'react';

export function HelpModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Help & Documentation">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            QuillJS Delta Renderer Help
          </DialogTitle>
          <DialogDescription>
            Learn how to use the QuillJS Delta Renderer effectively
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 mt-4">
          {/* What is a Quill Delta */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              What is a Quill Delta?
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p>
                Quill Deltas are JSON objects that represent rich text content in Quill.js. 
                They consist of an array of operations (ops) that describe the content and formatting.
              </p>
              <p className="text-sm text-muted-foreground">
                Each operation can <strong>insert</strong> text or embeds, <strong>delete</strong> content, 
                or <strong>retain</strong> existing content while applying formatting.
              </p>
            </div>
          </section>

          {/* Basic Usage */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              How to Use
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <ol className="list-decimal pl-5 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-sm">1.</span>
                  <div>
                    <strong>Enter Delta JSON</strong> in the editor on the left panel
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the examples dropdown for quick testing
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm">2.</span>
                  <div>
                    <strong>View rendered output</strong> on the right panel
                    <p className="text-sm text-muted-foreground mt-1">
                      See your Delta content formatted as rich text
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm">3.</span>
                  <div>
                    <strong>Import/Export</strong> Delta files
                    <p className="text-sm text-muted-foreground mt-1">
                      Save or load Delta JSON files for sharing
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sm">4.</span>
                  <div>
                    <strong>Copy to clipboard</strong> for use in other applications
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the copy button or keyboard shortcut
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Interface Guide */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              Interface Guide
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Left Panel - Delta Input</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Import/Export controls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">JSON</span>
                      <span>Monaco code editor with syntax highlighting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Examples dropdown for quick testing</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Right Panel - Delta Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Read-only rendered content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Preview</span>
                      <span>Formatted Delta content display</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Status</span>
                      <span>Operation count and render status</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              Keyboard Shortcuts
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Import File</span>
                    <kbd className="px-2 py-1 bg-background border rounded text-sm">Ctrl+O</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Export File</span>
                    <kbd className="px-2 py-1 bg-background border rounded text-sm">Ctrl+S</kbd>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Copy to Clipboard</span>
                    <kbd className="px-2 py-1 bg-background border rounded text-sm">Ctrl+Shift+C</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Open Help</span>
                    <kbd className="px-2 py-1 bg-background border rounded text-sm">F1</kbd>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                On Mac, use <kbd className="px-1 py-0.5 bg-background border rounded text-xs">⌘</kbd> instead of Ctrl
              </p>
            </div>
          </section>

          {/* Delta Format Reference */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              Delta Format Reference
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <p>A valid Delta has an <code className="bg-background px-1 py-0.5 rounded">&quot;ops&quot;</code> array containing operations:</p>
              
              <div className="bg-background border rounded-lg p-3 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`{
  "ops": [
    { "insert": "Hello " },
    { 
      "insert": "World", 
      "attributes": { "bold": true } 
    },
    { "insert": "\\n" }
  ]
}`}</code>
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Text Formatting</h5>
                  <ul className="space-y-1 text-xs">
                    <li><code>bold: true</code></li>
                    <li><code>italic: true</code></li>
                    <li><code>underline: true</code></li>
                    <li><code>link: &quot;url&quot;</code></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Block Formatting</h5>
                  <ul className="space-y-1 text-xs">
                    <li><code>header: 1|2|3</code></li>
                    <li><code>list: &quot;bullet&quot;|&quot;ordered&quot;</code></li>
                    <li><code>blockquote: true</code></li>
                    <li><code>code-block: true</code></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Embeds</h5>
                  <ul className="space-y-1 text-xs">
                    <li><code>image: &quot;url&quot;</code></li>
                    <li><code>video: &quot;url&quot;</code></li>
                    <li><code>formula: &quot;latex&quot;</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Common Issues */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-destructive rounded-full"></span>
              Common Issues & Solutions
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="border-l-4 border-destructive/50 pl-4">
                <h5 className="font-medium text-destructive">Missing &quot;ops&quot; array</h5>
                <p className="text-sm text-muted-foreground">
                  Ensure your Delta has an <code>&quot;ops&quot;</code> property that is an array
                </p>
              </div>
              <div className="border-l-4 border-destructive/50 pl-4">
                <h5 className="font-medium text-destructive">Invalid JSON syntax</h5>
                <p className="text-sm text-muted-foreground">
                  Check for missing commas, brackets, or quotes. Use the Monaco editor&apos;s syntax highlighting to help
                </p>
              </div>
              <div className="border-l-4 border-destructive/50 pl-4">
                <h5 className="font-medium text-destructive">Operations without insert/delete/retain</h5>
                <p className="text-sm text-muted-foreground">
                  Each operation must have at least one of: <code>insert</code>, <code>delete</code>, or <code>retain</code>
                </p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
              External Resources
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <a 
                  href="https://quilljs.com/docs/delta/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Official Quill Delta Documentation
                </a>
                <a 
                  href="https://github.com/quilljs/delta" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Delta GitHub Repository
                </a>
                <a 
                  href="https://quilljs.com/docs/formats/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Quill Formats Reference
                </a>
              </div>
            </div>
          </section>

          {/* Version & Support */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              About This Tool
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>QuillJS Delta Renderer</strong> - Built with Next.js, React, and shadcn/ui
              </p>
              <p className="text-sm text-muted-foreground">
                This tool is designed for viewing and testing Quill Delta JSON objects in a read-only format. 
                Perfect for debugging, sharing, and understanding Delta structure and formatting.
              </p>
            </div>
          </section>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 