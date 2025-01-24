import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { readDirectory } from '@/systemCalls/readDirectory';
import { SysError } from '@/systemCalls/utils/SysError';
import { fileAutocompleter } from '../utils/fileAutocompleter';

const executor: Executor = async (argv, log) => {
  const { flags, positionals } = partitionArgs(argv);
  const showHidden = flags.has('a');

  if (positionals.length === 0) {
    positionals.push('.');
  }

  const allContents = await Promise.all(
    positionals.map((path) => getEntries(path, showHidden))
  );

  if (allContents.length === 1 && allContents[0]) {
    const res = allContents[0];
    if (res.status === 'failure') {
      if (res.reason instanceof SysError && res.reason.code === 'ENOENT') {
        log(`ls: ${res.path}: no such file or directory`);
      } else {
        log(`ls: ${res.path}: unknown error: ${res.reason}`);
      }
    } else {
      log(res.entries.join('\n'));
    }
  } else {
    let hasPrinted = false;
    for (const res of allContents) {
      if (res.status === 'failure') {
        if (res.reason instanceof SysError && res.reason.code === 'ENOENT') {
          log(`ls: ${res.path}: no such file or directory`);
        } else {
          log(`ls: ${res.path}: unknown error: ${res.reason}`);
        }
      } else {
        log(
          (hasPrinted ? '\n' : '') + `${res.path}:\n` + res.entries.join('\n')
        );
        hasPrinted = true;
      }
    }
  }

  return 0;
};

type GetEntriesResult =
  | {
      status: 'success';
      path: string;
      entries: string[];
    }
  | {
      status: 'failure';
      path: string;
      reason: unknown;
    };

async function getEntries(
  path: string,
  showHidden: boolean
): Promise<GetEntriesResult> {
  try {
    const { directoryContents } = await readDirectory(await fsDB, path);
    const entries = directoryContents
      .keys()
      .filter((entry) => showHidden || !entry.startsWith('.'))
      .toArray();

    return { status: 'success', path, entries };
  } catch (reason) {
    return { status: 'failure', path, reason };
  }
}

export const ls = { executor, autocompleter: fileAutocompleter() };
