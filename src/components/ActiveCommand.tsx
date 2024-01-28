import { useCallback } from 'react';
import { ActiveLine } from './ActiveLine';
import { split } from 'shellwords-ts';
import { executeCommand } from '@/shell/executeCommand';

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
      <ActiveLine prompt={prompt} submitLine={submitLine} />
    </>
  );
};
