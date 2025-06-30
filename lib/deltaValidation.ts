import { QuillDelta } from '@/types/quill';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  delta?: QuillDelta;
}

export function validateDelta(jsonString: string): ValidationResult {
  if (!jsonString.trim()) {
    return { isValid: false};
  }

  try {
    const parsed = JSON.parse(jsonString);
    
    // Check if it has ops array
    if (!parsed.ops || !Array.isArray(parsed.ops)) {
      return { 
        isValid: false, 
        error: 'Invalid Delta: missing "ops" array. Delta must have an "ops" property containing an array of operations.' 
      };
    }

    // Validate each op
    for (let i = 0; i < parsed.ops.length; i++) {
      const op = parsed.ops[i];
      
      if (!op || typeof op !== 'object') {
        return { 
          isValid: false, 
          error: `Invalid Delta: operation at index ${i} is not an object` 
        };
      }

      const hasInsert = 'insert' in op;
      const hasDelete = 'delete' in op;
      const hasRetain = 'retain' in op;

      if (!hasInsert && !hasDelete && !hasRetain) {
        return { 
          isValid: false, 
          error: `Invalid Delta: operation at index ${i} must have "insert", "delete", or "retain" property` 
        };
      }

      // Validate operation types
      if (hasDelete && typeof op.delete !== 'number') {
        return { 
          isValid: false, 
          error: `Invalid Delta: "delete" at index ${i} must be a number` 
        };
      }

      if (hasRetain && typeof op.retain !== 'number') {
        return { 
          isValid: false, 
          error: `Invalid Delta: "retain" at index ${i} must be a number` 
        };
      }

      if (hasInsert && typeof op.insert !== 'string' && typeof op.insert !== 'object') {
        return { 
          isValid: false, 
          error: `Invalid Delta: "insert" at index ${i} must be a string or object` 
        };
      }
    }

    return { isValid: true, delta: parsed };
  } catch (e) {
    return { 
      isValid: false, 
      error: `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown parsing error'}` 
    };
  }
}

export function formatDeltaJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonString;
  }
}

export const sampleDeltas = {
  simple: {
    ops: [
      { insert: 'Hello ' },
      { insert: 'World', attributes: { bold: true } },
      { insert: '!\n' }
    ]
  },
  complex: {
    ops: [
      { insert: 'Quill Rich Text Editor\n', attributes: { header: 1 } },
      { insert: '\nThis is a ' },
      { insert: 'bold', attributes: { bold: true } },
      { insert: ' and ' },
      { insert: 'italic', attributes: { italic: true } },
      { insert: ' text example.\n\nFeatures:\n' },
      { insert: 'Rich text formatting', attributes: { list: 'bullet' } },
      { insert: '\n' },
      { insert: 'Lists and headers', attributes: { list: 'bullet' } },
      { insert: '\n' },
      { insert: 'Links and images', attributes: { list: 'bullet' } },
      { insert: '\n\nVisit ' },
      { insert: 'Quill.js', attributes: { link: 'https://quilljs.com' } },
      { insert: ' for more information.\n' }
    ]
  },
  withImage: {
    ops: [
      { insert: 'Document with Image\n', attributes: { header: 2 } },
      { insert: '\nHere is an embedded image:\n' },
      { insert: { image: 'https://via.placeholder.com/300x200' } },
      { insert: '\nImage caption goes here.\n' }
    ]
  },
  withFormulas: {
    ops: [
      { insert: 'Mathematical Formulas\n', attributes: { header: 1 } },
      { insert: '\nInline formulas work great in text. For example, Einstein\'s famous equation ' },
      { insert: '$E = mc^2$' },
      { insert: ' shows the relationship between mass and energy.\n\nBlock formulas are displayed centered:\n\n' },
      { insert: '$$\\int_0^1 x^2 dx = \\frac{1}{3}$$' },
      { insert: '\n\nThe quadratic formula is another classic:\n\n' },
      { insert: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$' },
      { insert: '\n\nFormulas can also be mixed with formatting. Here\'s ' },
      { insert: 'bold text', attributes: { bold: true } },
      { insert: ' with a formula: ' },
      { insert: '$\\alpha + \\beta = \\gamma$' },
      { insert: ' in the same line.\n\nGreek letters and symbols:\n' },
      { insert: '• Alpha: $\\alpha$\n', attributes: { list: 'bullet' } },
      { insert: '• Beta: $\\beta$\n', attributes: { list: 'bullet' } },
      { insert: '• Gamma: $\\gamma$\n', attributes: { list: 'bullet' } },
      { insert: '• Pi: $\\pi$\n', attributes: { list: 'bullet' } },
      { insert: '\nComplex expressions:\n\n' },
      { insert: '$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$' },
      { insert: '\n\nMatrix example:\n\n' },
      { insert: '$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$' },
      { insert: '\n' }
    ]
  }
}; 