import { Trie } from '@/dataStructures/Trie';
import { echo } from './echo';

export type Executor = (argv: string[], log: (str: string) => void) => number;
export type Autocompleter = (argv: string[]) => string | undefined;

export type Command = {
  executor: Executor;
  autocompleter?: Autocompleter;
};

const cmdNameToExecutor: Record<string, Command> = {
  echo,
};

const cmdTrie = new Trie(Object.keys(cmdNameToExecutor));

export const executeCommand = async (
  cmd: string,
  argv: string[],
  log: (str: string) => void
) => {
  if (!cmdNameToExecutor.hasOwnProperty(cmd)) {
    log(`rmsh: command not found: ${cmd}`);
    return 127;
  }

  return cmdNameToExecutor[cmd].executor(argv, log);
};

export const autocompleteCommand = (
  partialCmd: string
): string | undefined => {};
