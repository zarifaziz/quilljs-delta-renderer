import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KaTeXOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  trust?: boolean;
}

/**
 * Renders a LaTeX formula using KaTeX
 * @param formula - The LaTeX formula to render
 * @param options - KaTeX rendering options
 * @returns HTML string of the rendered formula
 */
export function renderKaTeX(formula: string, options: KaTeXOptions = {}): string {
  const defaultOptions: KaTeXOptions = {
    displayMode: false,
    throwOnError: false,
    errorColor: '#f00',
    trust: false,
    ...options
  };
  
  try {
    return katex.renderToString(formula.trim(), defaultOptions);
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    if (defaultOptions.throwOnError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `<span style="color: ${defaultOptions.errorColor}; font-family: monospace;">Error: ${errorMessage}</span>`;
  }
}

/**
 * Processes text to find and render mathematical formulas
 * Supports both inline math ($...$) and block math ($$...$$)
 * @param text - The input text that may contain formulas
 * @returns Text with formulas rendered as HTML
 */
export function processTextWithFormulas(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let processedText = text;
  
  // Process block math first ($$...$$) to avoid conflicts with inline math
  processedText = processedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    return renderKaTeX(formula, { displayMode: true });
  });
  
  // Process inline math ($...$) - but avoid processing if it's already been processed
  // Use negative lookbehind and lookahead to avoid double processing
  processedText = processedText.replace(/(?<!<[^>]*)\$([^$\n]+?)\$(?![^<]*>)/g, (match, formula) => {
    return renderKaTeX(formula, { displayMode: false });
  });
  
  return processedText;
}

/**
 * Checks if a string contains mathematical formulas
 * @param text - The text to check
 * @returns true if the text contains formulas
 */
export function containsFormulas(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Check for both inline and block math patterns
  const inlineMathPattern = /\$[^$\n]+?\$/;
  const blockMathPattern = /\$\$[\s\S]*?\$\$/;
  
  return inlineMathPattern.test(text) || blockMathPattern.test(text);
}

/**
 * Extracts all formulas from text without rendering them
 * @param text - The text to extract formulas from
 * @returns Array of formula objects with their type and content
 */
export function extractFormulas(text: string): Array<{type: 'inline' | 'block', formula: string, match: string}> {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const formulas: Array<{type: 'inline' | 'block', formula: string, match: string}> = [];
  
  // Extract block formulas
  const blockMatches = text.matchAll(/\$\$([\s\S]*?)\$\$/g);
  for (const match of blockMatches) {
    formulas.push({
      type: 'block',
      formula: match[1].trim(),
      match: match[0]
    });
  }
  
  // Extract inline formulas (excluding those that are part of block formulas)
  const textWithoutBlocks = text.replace(/\$\$[\s\S]*?\$\$/g, '');
  const inlineMatches = textWithoutBlocks.matchAll(/\$([^$\n]+?)\$/g);
  for (const match of inlineMatches) {
    formulas.push({
      type: 'inline',
      formula: match[1].trim(),
      match: match[0]
    });
  }
  
  return formulas;
}

/**
 * Simple wrapper function for rendering formulas in Quill delta operations
 * @param formula - The LaTeX formula to render
 * @param fontSize - Optional font size in pixels
 * @returns HTML string of the rendered formula
 */
export function renderFormula(formula: string, fontSize?: number): string {
  const options: KaTeXOptions = { 
    displayMode: false,
    trust: false
  };
  
  const katexHtml = renderKaTeX(formula, options);
  
  // If font size is provided, wrap the KaTeX output with inline styles
  if (fontSize) {
    return `<span style="font-size: ${fontSize}px !important;">${katexHtml}</span>`;
  }
  
  return katexHtml;
} 