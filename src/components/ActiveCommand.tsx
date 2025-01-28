import { useCallback, useEffect, useRef, useState } from 'react';
import { ActiveLine } from './ActiveLine';
import { split } from 'shellwords-ts';
import { executeCommand, autocompleteLine } from '@/shell/executeCommand';
import { AutocompleteOptions } from './AutocompleteOptions';

type ActiveCommandProps = {
  numLines: number;
  writeLine: (command: string) => void;
  onExecutionStart: () => void;
  onExecutionEnd: () => void;
};

export default function ActiveCommand({
  numLines,
  writeLine,
  onExecutionStart,
  onExecutionEnd,
}: ActiveCommandProps) {
  const prompt = '> ';
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

  const activeCommandRef = useRef<HTMLDivElement>(null);
  const scrollIntoView = useCallback(() => {
    activeCommandRef.current?.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
    });
  }, []);

  useEffect(() => {
    scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numLines, autocompleteOptions]);

  const submitLine = useCallback(
    async (line: string) => {
      writeLine(prompt + line);
      const words = split(line);
      const cmd = words[0];
      if (cmd === undefined) return;

      onExecutionStart();
      try {
        await executeCommand(cmd, words.slice(1), writeLine);
      } catch {}
      onExecutionEnd();
    },
    [onExecutionEnd, onExecutionStart, writeLine]
  );

  const autocomplete = useCallback(async (line: string) => {
    const { replaced, result } = await autocompleteLine(line);
    switch (result.matchType) {
      case 'none':
        return line;
      case 'one':
        return replaceEnd(line, replaced, result.match) + ' ';
      case 'many':
        setAutocompleteOptions(result.matches);
        return replaceEnd(line, replaced, result.prefix);
    }
  }, []);

  // TODO: handle multiline inputs
  // const [lines, setLines] = useState<string[]>([]);
  // const submitLine = useCallback(
  //   (line: string) => {
  //     const wholeCommand = lines.join('') + line;
  //     let words;
  //     try {
  //       words = split(wholeCommand);
  //     } catch (err) {
  //       if (err && typeof err === 'object' && 'message' in err && err.message === 'Unmatched quote') {
  //         setLines((prev) => [...prev, line]);
  //         return;
  //       }
  //       throw err;
  //     }
  //   },
  //   [lines]
  // );

  return (
    <div ref={activeCommandRef}>
      {/* TODO: handle multiline strings */}
      {/* {lines.map((line, i) => (
        <InactiveLine key={i} text={line} />
      ))} */}
      <ActiveLine
        onKeyPress={scrollIntoView}
        prompt={prompt}
        submitLine={(line) => {
          void submitLine(line);
        }}
        autocomplete={autocomplete}
      />
      {autocompleteOptions.length > 0 && (
        <AutocompleteOptions options={autocompleteOptions} />
      )}
    </div>
  );
}

const replaceEnd = (str: string, before: string, after: string): string => {
  const lastIndex = str.lastIndexOf(before);
  return str.slice(0, lastIndex) + after;
};
