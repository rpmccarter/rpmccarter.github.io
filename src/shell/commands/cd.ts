import { SysError } from '@/systemCalls/utils/SysError';
import { Executor } from '../executeCommand';
import { changeDirectory } from '@/systemCalls/changeDirectory';
import { fileAutocompleter } from '../utils/fileAutocompleter';

const executor: Executor = async (argv, log) => {
  if (argv.length > 2) {
    log('cd: too many arguments');
    return 1;
  }

  const [firstArg] = argv;

  try {
    await changeDirectory(firstArg);
  } catch (e) {
    if (e instanceof SysError) {
      if (e.code === 'ENOENT') {
        log(`cd: no such file or directory: ${firstArg}`);
        return 1;
      } else if (e.code === 'ENOTDIR') {
        log(`cd: not a directory: ${firstArg}`);
        return 1;
      }
    } else {
      throw e;
    }
  }

  return 0;
};

export const cd = { executor, autocompleter: fileAutocompleter(true) };
