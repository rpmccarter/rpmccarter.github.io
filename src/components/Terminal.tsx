'use client';

import { InactiveLine } from '@/components/InactiveLine';
import { EnvContext } from '@/context/EnvContext';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const ActiveCommand = dynamic(() => import('@/components/ActiveCommand'));

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
      writeLine('a wip project');
      setActive(false);
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EnvContext.Provider value={{ PWD: '/' }}>
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
    </EnvContext.Provider>
  );
};
