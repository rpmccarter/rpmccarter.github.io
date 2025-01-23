import { Executor } from '../executeCommand';

const executor: Executor = (argv, log) => {
  log(argv.join(' '));
  return 0;
};

export const echo = { executor };
