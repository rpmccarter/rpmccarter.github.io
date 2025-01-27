'use client';

import { InactiveLine } from '@/components/InactiveLine';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const ActiveCommand = dynamic(() => import('@/components/ActiveCommand'));

export function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  const writeLine = useCallback((line: string) => {
    setLines((prev) => [...prev, line]);
  }, []);

  useKeyboardShortcut('l', 'ctrlKey', () => {
    setLines([]);
  });

  useEffect(() => {
    setTimeout(() => {
      writeLine('rmsh v0.0.1');
    }, 500);
    setTimeout(() => {
      writeLine('a wip project');
    }, 1000);
    setTimeout(() => {
      writeLine(
        'to skip to the resume, type "open links/resume.url" and hit Enter'
      );
      setActive(false);
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-screen overflow-hidden text-lime-500 font-mono">
      {lines.map((line, i) => (
        <InactiveLine key={i} text={line} />
      ))}
      {!active && (
        <ActiveCommand
          key={lines.length}
          writeLine={writeLine}
          onExecutionStart={() => setActive(true)}
          onExecutionEnd={() => setActive(false)}
        />
      )}
    </div>
  );
}
