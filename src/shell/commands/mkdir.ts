import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { createDirectory } from '@/systemCalls/createDirectory';
import { fileAutocompleter } from '../utils/fileAutocompleter';
import { SysError } from '@/systemCalls/utils/SysError';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  if (positionals.length === 0) {
    log('mkdir: must supply directory name');
    return 64;
  }

  let hasError = false;
  for (const path of positionals) {
    try {
      await createDirectory(await fsDB, path);
    } catch (error) {
      hasError = true;
      if (error instanceof SysError) {
        if (error.code === 'EEXIST') {
          log(`mkdir: ${path}: file exists`);
        } else if (error.code === 'ENOENT') {
          log(`mkdir: ${path}: no such file or directory`);
        }
      } else {
        throw error;
      }
    }
  }

  return hasError ? 1 : 0;
};

export const mkdir = { executor, autocompleter: fileAutocompleter(true) };
