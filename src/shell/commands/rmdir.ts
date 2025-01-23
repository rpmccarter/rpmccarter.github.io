import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { myPath } from '@/modules/myPath';
import { deleteDirectory } from '@/systemCalls/deleteDirectory';
import { resolveInodeId } from '@/systemCalls/utils/resolveInodeId';
import { SysError } from '@/systemCalls/utils/SysError';

const executor: Executor = async (argv, log) => {
  const { flags, positionals } = partitionArgs(argv);

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

  normalizedDirArg.replace(/\/$/, ''); // remove trailing slash if present

  if (normalizedDirArg === '.') {
    log('rmdir: .: invalid argument');
    return 1;
  }

  try {
    await deleteDirectory(await fsDB, firstDirArg);
  } catch (e) {
    if (e instanceof SysError) {
      if (e.code === 'ENOTEMPTY') {
        log(`rmdir: ${firstDirArg}: directory not empty`);
      }
    } else {
      throw e;
    }
  }

  return 0;
};

export const rmdir = { executor };
