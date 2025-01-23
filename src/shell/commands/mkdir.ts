import { createDirectory, fsDB, readDirectory, resolveInodeId } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { myPath } from '@/modules/myPath';

const executor: Executor = async (argv, log) => {
  const { flags, positionals } = partitionArgs(argv);

  const [firstDirArg] = positionals;
  if (firstDirArg === undefined) {
    log('mkdir: must supply directory name');
    return 64;
  }

  let normalizedDirArg = myPath.normalize(firstDirArg);
  if (normalizedDirArg === '/') {
    log('mkdir: /: file exists');
    return 1;
  }

  normalizedDirArg.replace(/\/$/, ''); // remove trailing slash if present

  const lastSlashIndex = normalizedDirArg.lastIndexOf('/');
  const existingDir =
    lastSlashIndex > -1 ? normalizedDirArg.slice(0, lastSlashIndex) : '';
  const newDirName =
    lastSlashIndex > -1
      ? normalizedDirArg.slice(lastSlashIndex + 1)
      : normalizedDirArg;

  const existingDirInodeId = await resolveInodeId(await fsDB, existingDir);
  await createDirectory(await fsDB, existingDirInodeId, newDirName);

  return 0;
};

export const mkdir = { executor };
