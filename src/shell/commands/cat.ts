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
    try {
      const fileBlob = await readFile(await fsDB, path);
      const text = await fileBlob.text();
      log(text);
    } catch (e) {
      hasError = true;
      if (e instanceof SysError) {
        if (e.code === 'ENOENT') {
          log(`cat: ${path}: no such file or directory`);
        } else if (e.code === 'EISDIR') {
          log(`cat: ${path}: is a directory`);
        }
      } else {
        throw e;
      }
    }
  }

  return hasError ? 1 : 0;
};

export const cat = { executor, autocompleter: fileAutocompleter() };
