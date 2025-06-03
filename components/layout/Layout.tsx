'use client';

import { ReactNode } from 'react';
import { SplitPane } from './SplitPane';

interface LayoutProps {
  children?: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function Layout({ leftPanel, rightPanel }: LayoutProps) {
  return (
    <main className="h-screen w-full bg-background">
      <SplitPane
        left={leftPanel}
        right={rightPanel}
        defaultSplitPosition={50}
      />
    </main>
  );
} 