import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { createFile } from '@/systemCalls/createFile';
import { stat } from '@/systemCalls/stat';
import { SysError } from '@/systemCalls/utils/SysError';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  if (positionals.length === 0) {
    log('touch: must supply file name');
    return 1;
  }

  for (const path of positionals) {
    try {
      await stat(await fsDB, path);
      return 0;
    } catch (e) {
      if (!(e instanceof SysError && e.code === 'ENOENT')) {
        throw e;
      }
    }

    await createFile(await fsDB, path, new Blob());
  }

  return 0;
};

export const touch = { executor };
