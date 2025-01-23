import { SysError } from '@/systemCalls/utils/SysError';
import { Executor } from '../executeCommand';
import { changeDirectory } from '@/systemCalls/changeDirectory';

const executor: Executor = async (argv, log) => {
  const [firstArg] = argv;

  try {
    await changeDirectory(firstArg);
  } catch (e) {
    if (e instanceof SysError) {
      if (e.code === 'ENOENT') {
        log(`cd: no such file or directory: ${firstArg}`);
      } else if (e.code === 'ENOTDIR') {
        log(`cd: not a directory: ${firstArg}`);
      }
    } else {
      throw e;
    }
  }

  return 0;
};

export const cd = { executor };
