import { useCallback, useState } from 'react';
import { ActiveLine } from './ActiveLine';
import { split } from 'shellwords-ts';
import { executeCommand, autocompleteLine } from '@/shell/executeCommand';
import { AutocompleteOptions } from './AutocompleteOptions';

type ActiveCommandProps = {
  writeLine: (command: string) => void;
  onExecutionStart: () => void;
  onExecutionEnd: () => void;
};

export const ActiveCommand = ({
  writeLine,
  onExecutionStart,
  onExecutionEnd,
}: ActiveCommandProps) => {
  const prompt = '> ';
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

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

  const autocomplete = useCallback((line: string) => {
    const { replaced, result } = autocompleteLine(line);
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
    <>
      {/* TODO: handle multiline strings */}
      {/* {lines.map((line, i) => (
        <InactiveLine key={i} text={line} />
      ))} */}
      <ActiveLine
        prompt={prompt}
        submitLine={submitLine}
        autocomplete={autocomplete}
      />
      {autocompleteOptions.length > 0 && (
        <AutocompleteOptions options={autocompleteOptions} />
      )}
    </>
  );
};

const replaceEnd = (str: string, before: string, after: string): string => {
  const lastIndex = str.lastIndexOf(before);
  return str.slice(0, lastIndex) + after;
};
