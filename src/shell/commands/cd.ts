import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import {
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
  WORKING_DIR_KEY,
} from '../constants';
import { myPath } from '@/modules/myPath';

const executor: Executor = async (argv, log) => {
  const [firstArg] = argv;

  return 0;
};

export const cd = { executor };
