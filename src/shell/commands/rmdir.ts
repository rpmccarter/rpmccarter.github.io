import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { myPath } from '@/modules/myPath';
import { deleteDirectory } from '@/db/systemCalls/deleteDirectory';
import { resolveInodeId } from '@/db/systemCalls/utils/resolveInodeId';

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

  await deleteDirectory(await fsDB, firstDirArg);

  return 0;
};

export const rmdir = { executor };
