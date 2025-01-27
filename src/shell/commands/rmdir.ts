import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { myPath } from '@/modules/myPath';
import { deleteDirectory } from '@/systemCalls/deleteDirectory';
import { SysError } from '@/systemCalls/utils/SysError';
import { fileAutocompleter } from '../utils/fileAutocompleter';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  if (positionals.length === 0) {
    log('rmdir: must supply directory name');
    return 64;
  }

  let hasError = false;
  for (const path of positionals) {
    let normalizedDirArg = myPath.normalize(path);
    if (normalizedDirArg === '/') {
      log('rmdir: /: cannot remove root directory');
      return 1;
    }

    normalizedDirArg = normalizedDirArg.replace(/\/$/, ''); // remove trailing slash if present

    if (normalizedDirArg === '.') {
      log('rmdir: .: invalid argument');
      return 1;
    }

    try {
      await deleteDirectory(await fsDB, path);
    } catch (e) {
      hasError = true;
      if (e instanceof SysError) {
        if (e.code === 'ENOENT') {
          log(`rmdir: ${path}: no such file or directory`);
        } else if (e.code === 'ENOTEMPTY') {
          log(`rmdir: ${path}: directory not empty`);
        } else if (e.code === 'ENOTDIR') {
          log(`rmdir: ${path}: not a directory`);
        }
      } else {
        throw e;
      }
    }
  }

  return hasError ? 1 : 0;
};

export const rmdir = { executor, autocompleter: fileAutocompleter(true) };
