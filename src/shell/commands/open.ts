import { SysError } from '@/systemCalls/utils/SysError';
import { Executor } from '../executeCommand';
import { readFile } from '@/systemCalls/readFile';
import { fsDB } from '@/db/fs';
import { partitionArgs } from '../utils/partitionArgs';
import { fileAutocompleter } from '../utils/fileAutocompleter';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  // TODO: handle stdin
  if (positionals.length === 0) return 0;

  let hasError = false;
  for (const path of positionals) {
    if (!path.endsWith('.url')) {
      hasError = true;
      log(`open: no application configured for ${path}`);
      continue;
    }
    try {
      const fileBlob = await readFile(await fsDB, path);
      const text = await fileBlob.text();

      const urlLine = text
        .split('\n')
        .map((line) => line.match(/^ *URL *= *(.*[^ ]) *$/))
        .find((match) => !!match);

      if (urlLine === undefined || urlLine[1] === undefined) {
        hasError = true;
        log(`open: invalid .url file`);
      } else {
        window.open(urlLine[1]);
      }
    } catch (e) {
      hasError = true;
      if (e instanceof SysError) {
        if (e.code === 'ENOENT') {
          log(`open: ${path}: no such file or directory`);
        } else if (e.code === 'EISDIR') {
          log(`open: ${path}: is a directory`);
        }
      } else {
        throw e;
      }
    }
  }

  return hasError ? 1 : 0;
};

export const open = { executor, autocompleter: fileAutocompleter() };
