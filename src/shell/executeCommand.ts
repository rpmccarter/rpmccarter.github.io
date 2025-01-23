import { AutocompleteResult, Trie } from '@/dataStructures/Trie';
import { echo } from './commands/echo';
import { split } from 'shellwords-ts';
import { ls } from './commands/ls';
import { mkdir } from './commands/mkdir';
import { pwd } from './commands/pwd';
import { cd } from './commands/cd';

export type Executor = (
  argv: string[],
  log: (str: string) => void
) => number | Promise<number>;
export type Autocompleter = (
  argv: string[],
  prefix: string
) => AutocompleteResult;

export type Command = {
  executor: Executor;
  autocompleter?: Autocompleter;
};

const cmdNameToCmd = new Map<string, Command>(
  Object.entries({
    echo,
    ls,
    mkdir,
    pwd,
    cd,
  })
);

const cmdTrie = new Trie(Object.keys(cmdNameToCmd));

export const executeCommand = async (
  cmd: string,
  argv: string[],
  log: (str: string) => void
) => {
  const cmdObj = cmdNameToCmd.get(cmd);
  if (cmdObj === undefined) {
    log(`rmsh: command not found: ${cmd}`);
    return 127;
  }

  return await cmdObj.executor(argv, log);
};

const autocompleteArgs = (
  cmd: string,
  argv: string[],
  prefix: string
): AutocompleteResult => {
  const cmdObj = cmdNameToCmd.get(cmd);
  if (cmdObj === undefined) return { matchType: 'none' };

  const autocompleter = cmdObj.autocompleter;
  if (!autocompleter) return { matchType: 'none' };

  return autocompleter(argv, prefix);
};

const autocompleteCommand = (partialCmd: string) =>
  cmdTrie.autocomplete(partialCmd);

export const autocompleteLine = (
  line: string
): { replaced: string; result: AutocompleteResult } => {
  const words = split(line);
  const cmd = words[0] ?? '';

  // if the command is the whole line, attempt to autocomplete the command
  if (cmd === line) {
    return { replaced: cmd, result: autocompleteCommand(cmd) };
  }

  const argv = words.slice(1);
  const lastArg = argv[argv.length - 1];

  // if lastArg is still being written, attempt to complete it
  if (lastArg !== undefined && line.endsWith(lastArg)) {
    argv.pop();
    return { replaced: lastArg, result: autocompleteArgs(cmd, argv, lastArg) };
  }

  // lastArg is already written - autocomplete empty string
  return { replaced: '', result: autocompleteArgs(cmd, argv, '') };
};
