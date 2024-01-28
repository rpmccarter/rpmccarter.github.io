import { echo } from './echo';

export type CmdExecutor = (
  argv: string[],
  log: (str: string) => void
) => number;

const cmdNameToExecutor: Record<string, CmdExecutor> = {
  echo,
};

export const executeCommand = async (
  cmd: string,
  argv: string[],
  log: (str: string) => void
) => {
  if (!cmdNameToExecutor.hasOwnProperty(cmd)) {
    log(`rmsh: command not found: ${cmd}`);
    return 127;
  }

  return cmdNameToExecutor[cmd](argv, log);
};
