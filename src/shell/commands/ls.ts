import { fsDB, readDirectory, resolveInodeId } from '@/db/fs';
import { Executor } from '../executeCommand';

const executor: Executor = async (argv, log) => {
  const inodeId = await resolveInodeId(await fsDB, argv[0] ?? '');
  const { directoryContents } = await readDirectory(await fsDB, inodeId);
  log(directoryContents.keys().toArray().join('\n') + '\n');

  return 0;
};

export const ls = { executor };
