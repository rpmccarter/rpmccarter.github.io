import { deleteDirectory, fsDB, resolveInodeId } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { myPath } from '@/modules/myPath';

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

  const lastSlashIndex = normalizedDirArg.lastIndexOf('/');
  const parentDir =
    lastSlashIndex > -1 ? normalizedDirArg.slice(0, lastSlashIndex) : '';
  const targetDirName =
    lastSlashIndex > -1
      ? normalizedDirArg.slice(lastSlashIndex + 1)
      : normalizedDirArg;

  const existingDirInodeId = await resolveInodeId(await fsDB, parentDir);
  await deleteDirectory(await fsDB, existingDirInodeId, targetDirName);

  return 0;
};

export const rmdir = { executor };
