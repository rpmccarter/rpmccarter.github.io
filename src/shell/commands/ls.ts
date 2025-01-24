import { fsDB } from '@/db/fs';
import { Autocompleter, Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { readDirectory } from '@/systemCalls/readDirectory';
import { SysError } from '@/systemCalls/utils/SysError';
import { Trie } from '@/dataStructures/Trie';
import { stat } from '@/systemCalls/stat';

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

const autocompleter: Autocompleter = async (_argv, prefix) => {
  const pathSegments = prefix.split('/');
  const partialPathSegment = pathSegments.pop() ?? '';
  const parentDirPath = pathSegments.concat('').join('/');

  const { directoryContents } = await readDirectory(await fsDB, parentDirPath);

  const trie = new Trie(
    directoryContents
      .keys()
      .filter((entry) => entry !== '.' && entry !== '..')
      .toArray()
  );

  const autocompleteResult = trie.autocomplete(partialPathSegment);

  if (autocompleteResult.matchType === 'none') {
    return autocompleteResult;
  }

  if (autocompleteResult.matchType === 'one') {
    const fileInfo = await stat(
      await fsDB,
      parentDirPath + '/' + autocompleteResult.match
    );
    return {
      matchType: 'one',
      match: pathSegments
        .concat(
          autocompleteResult.match,
          fileInfo.mode === 'directory' ? '' : []
        )
        .join('/'),
    };
  }

  const resultsWithSlashes = [];
  for (const result of autocompleteResult.matches) {
    const fileInfo = await stat(await fsDB, parentDirPath + '/' + result);
    resultsWithSlashes.push(
      result + (fileInfo.mode === 'directory' ? '/' : '')
    );
  }
  return {
    matchType: 'many',
    prefix: pathSegments.concat(autocompleteResult.prefix).join('/'),
    matches: resultsWithSlashes,
  };
};

export const ls = { executor, autocompleter };
