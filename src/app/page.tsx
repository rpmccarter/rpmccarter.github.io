'use client';

import { ActiveLine } from '@/components/ActiveLine';
import { InactiveLine } from '@/components/InactiveLine';
import { useCallback, useEffect, useState } from 'react';

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([]);

  const pushLine = useCallback((line: string) => {
    setLines((prev) => [...prev, line]);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      pushLine('Welcome to rush');
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen text-lime-500 font-mono">
      {lines.map((line, i) => (
        <InactiveLine key={i} text={line} />
      ))}
      <ActiveLine />
    </main>
  );
}
