import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { createDirectory } from '@/systemCalls/createDirectory';

const executor: Executor = async (argv, log) => {
  const { flags, positionals } = partitionArgs(argv);

  const [firstDirArg] = positionals;
  if (firstDirArg === undefined) {
    log('mkdir: must supply directory name');
    return 64;
  }

  await createDirectory(await fsDB, firstDirArg);

  return 0;
};

export const mkdir = { executor };
