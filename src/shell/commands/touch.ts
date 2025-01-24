import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';
import { createFile } from '@/systemCalls/createFile';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  const [firstDirArg] = positionals;

  if (firstDirArg === undefined) {
    log('touch: must supply file name');
    return 1;
  }

  await createFile(await fsDB, firstDirArg, new Blob());

  return 0;
};

export const touch = { executor };
