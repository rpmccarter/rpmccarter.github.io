import { AutocompleteResult, Trie } from '@/dataStructures/Trie';
import { echo } from './echo';

export type Executor = (argv: string[], log: (str: string) => void) => number;
export type Autocompleter = (argv: string[]) => AutocompleteResult;

export type Command = {
  executor: Executor;
  autocompleter?: Autocompleter;
};

const cmdNameToCmd: Record<string, Command> = {
  echo,
};

const cmdTrie = new Trie(Object.keys(cmdNameToCmd));

export const executeCommand = async (
  cmd: string,
  argv: string[],
  log: (str: string) => void
) => {
  if (!cmdNameToCmd.hasOwnProperty(cmd)) {
    log(`rmsh: command not found: ${cmd}`);
    return 127;
  }

  return cmdNameToCmd[cmd].executor(argv, log);
};

export const autocompleteArgs = (
  cmd: string,
  argv: string[]
): AutocompleteResult => {
  if (!cmdNameToCmd.hasOwnProperty(cmd)) return { matchType: 'none' };

  const autocompleter = cmdNameToCmd[cmd].autocompleter;
  if (!autocompleter) return { matchType: 'none' };

  return autocompleter(argv);
};

export const autocompleteCommand = (partialCmd: string) => {
  return cmdTrie.autocomplete(partialCmd);
};
