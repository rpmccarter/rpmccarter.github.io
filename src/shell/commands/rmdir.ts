import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { myPath } from '@/modules/myPath';
import { deleteDirectory } from '@/systemCalls/deleteDirectory';
import { SysError } from '@/systemCalls/utils/SysError';
import { fileAutocompleter } from '../utils/fileAutocompleter';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  const [firstDirArg] = positionals;
  if (firstDirArg === undefined) {
    log('rmdir: must supply directory name');
    return 64;
  }

  let normalizedDirArg = myPath.normalize(firstDirArg);
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
    await deleteDirectory(await fsDB, firstDirArg);
  } catch (e) {
    if (e instanceof SysError) {
      if (e.code === 'ENOENT') {
        log(`rmdir: ${firstDirArg}: no such file or directory`);
        return 1;
      } else if (e.code === 'ENOTEMPTY') {
        log(`rmdir: ${firstDirArg}: directory not empty`);
        return 1;
      } else if (e.code === 'ENOTDIR') {
        log(`rmdir: ${firstDirArg}: not a directory`);
        return 1;
      }
    } else {
      throw e;
    }
  }

  return 0;
};

export const rmdir = { executor, autocompleter: fileAutocompleter(true) };
