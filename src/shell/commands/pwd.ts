import { WORKING_DIR_KEY } from '../constants';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';

const executor: Executor = (argv, log) => {
  const { positionals } = partitionArgs(argv);

  if (positionals.length) {
    log('pwd: too many arguments');
    return 1;
  }

  const pwd = localStorage.getItem(WORKING_DIR_KEY);
  if (pwd === null) {
    log('pwd: missing directory information');
    return 3;
  }
  log(pwd);
  return 0;
};

export const pwd = { executor };
