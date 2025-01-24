import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { createFile } from '@/systemCalls/createFile';
import { stat } from '@/systemCalls/stat';
import { SysError } from '@/systemCalls/utils/SysError';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  const [firstArg] = positionals;

  if (firstArg === undefined) {
    log('touch: must supply file name');
    return 1;
  }

  try {
    await stat(await fsDB, firstArg);
    return 0;
  } catch (e) {
    console.log(e);
    if (!(e instanceof SysError && e.code === 'ENOENT')) {
      throw e;
    }
  }

  await createFile(await fsDB, firstArg, new Blob());

  return 0;
};

export const touch = { executor };
