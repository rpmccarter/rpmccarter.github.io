'use client';

import { ActiveCommand } from '@/components/ActiveCommand';
import { InactiveLine } from '@/components/InactiveLine';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useCallback, useEffect, useState } from 'react';

export const Terminal = () => {
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
    }, 300);
    setTimeout(() => {
      writeLine('much more coming soon...');
      setActive(false);
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen w-screen overflow-hidden text-lime-500 font-mono">
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
    </main>
  );
};
