import { CmdExecutor } from './executeCommand';

export const echo: CmdExecutor = (argv, log) => {
  log(argv.join(' '));
  return 0;
};
