import { WORKING_DIR_KEY } from '../constants';
import { Executor } from '../executeCommand';

const executor: Executor = (argv, log) => {
  const pwd = localStorage.getItem(WORKING_DIR_KEY);
  if (pwd === null) {
    log('pwd: missing directory information');
    return 3;
  }
  log(pwd);
  return 0;
};

export const pwd = { executor };
