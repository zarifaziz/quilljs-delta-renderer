'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export function ReactQuillTest() {
  const [value, setValue] = useState('');

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">React Quill Test (React 18)</h3>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue}
        placeholder="Test react-quill with React 18..."
      />
      <div className="mt-4 p-2 bg-muted rounded">
        <h4 className="font-medium">Delta Output:</h4>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  );
} 