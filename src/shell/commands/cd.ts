import { SysError } from '@/systemCalls/utils/SysError';
import { Executor } from '../executeCommand';
import { changeDirectory } from '@/systemCalls/changeDirectory';
import { fileAutocompleter } from '../utils/fileAutocompleter';
import { OLD_WORKING_DIR_KEY, WORKING_DIR_KEY } from '../constants';

const executor: Executor = async (argv, log) => {
  if (argv.length > 2) {
    log('cd: too many arguments');
    return 1;
  }

  const [firstArg, secondArg] = argv;

  let destination;
  if (firstArg === undefined) {
    destination = '/';
  } else if (secondArg === undefined) {
    if (firstArg === '-') {
      const oldPwd = localStorage.getItem(OLD_WORKING_DIR_KEY);
      if (oldPwd === null) {
        log('cd: missing old pwd');
        return 2;
      }
      destination = oldPwd;
    } else {
      destination = firstArg;
    }
  } else {
    const pwd = localStorage.getItem(WORKING_DIR_KEY);
    if (pwd === null) {
      log('cd: missing pwd');
      return 2;
    }

    if (!pwd.includes(firstArg)) {
      log(`cd: string not in pwd: ${firstArg}`);
      return 3;
    }

    destination = pwd.replace(firstArg, secondArg);
  }

  try {
    await changeDirectory(destination);
  } catch (e) {
    if (e instanceof SysError) {
      if (e.code === 'ENOENT') {
        log(`cd: no such file or directory: ${destination}`);
        return 1;
      } else if (e.code === 'ENOTDIR') {
        log(`cd: not a directory: ${destination}`);
        return 1;
      }
    } else {
      throw e;
    }
  }

  return 0;
};

export const cd = { executor, autocompleter: fileAutocompleter(true) };
