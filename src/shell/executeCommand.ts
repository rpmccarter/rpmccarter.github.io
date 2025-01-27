import { AutocompleteResult, Trie } from '@/dataStructures/Trie';
import { echo } from './commands/echo';
import { split } from 'shellwords-ts';
import { ls } from './commands/ls';
import { mkdir } from './commands/mkdir';
import { pwd } from './commands/pwd';
import { cd } from './commands/cd';
import { rmdir } from './commands/rmdir';
import { cat } from './commands/cat';
import { touch } from './commands/touch';
import { open } from './commands/open';

export type Executor = (
  argv: string[],
  log: (str: string) => void
) => number | Promise<number>;
export type Autocompleter = (
  argv: string[],
  prefix: string
) => AutocompleteResult | Promise<AutocompleteResult>;

export type Command = {
  executor: Executor;
  autocompleter?: Autocompleter;
};

const cmdNameToCmd = new Map<string, Command>(
  Object.entries({
    echo,
    ls,
    mkdir,
    rmdir,
    pwd,
    cd,
    cat,
    touch,
    open,
  })
);

const cmdTrie = new Trie(Array.from(cmdNameToCmd.keys()));

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

  try {
    return await cmdObj.executor(argv, log);
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      log(`rmsh: process crashed: ${e.message}`);
    } else {
      log('rmsh: process crashed');
    }
    return 127;
  }
};

async function autocompleteArgs(
  cmd: string,
  argv: string[],
  prefix: string
): Promise<AutocompleteResult> {
  const cmdObj = cmdNameToCmd.get(cmd);
  if (cmdObj === undefined) return { matchType: 'none' };

  const autocompleter = cmdObj.autocompleter;
  if (!autocompleter) return { matchType: 'none' };

  return await autocompleter(argv, prefix);
}

function autocompleteCommand(partialCmd: string) {
  return cmdTrie.autocomplete(partialCmd);
}

export async function autocompleteLine(
  line: string
): Promise<{ replaced: string; result: AutocompleteResult }> {
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
    return {
      replaced: lastArg,
      result: await autocompleteArgs(cmd, argv, lastArg),
    };
  }

  // lastArg is already written - autocomplete empty string
  return { replaced: '', result: await autocompleteArgs(cmd, argv, '') };
}
