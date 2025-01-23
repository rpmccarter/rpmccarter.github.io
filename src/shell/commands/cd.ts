import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import {
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
  WORKING_DIR_KEY,
} from '../constants';
import { myPath } from '@/modules/myPath';
import { resolveInodeId } from '@/db/systemCalls/utils/resolveInodeId';

const executor: Executor = async (argv, log) => {
  const [firstArg] = argv;

  if (firstArg === undefined) {
    const rootInodeId = localStorage.getItem(ROOT_DIR_INODE_ID_KEY);
    if (rootInodeId === null) {
      log('cd: home directory not found');
      return 2;
    }
    localStorage.setItem(WORKING_DIR_INODE_ID_KEY, rootInodeId);
    localStorage.setItem(WORKING_DIR_KEY, '/');
  } else {
    const inodeId = await resolveInodeId(await fsDB, firstArg);

    const normalizedPath = myPath.normalize(firstArg);

    const basePathStr = localStorage.getItem(WORKING_DIR_KEY);
    if (basePathStr === null) {
      log('cd: missing directory information');
      return 3;
    }

    let newPath = myPath.isAbsolute(normalizedPath)
      ? normalizedPath
      : myPath.normalize(basePathStr + '/' + normalizedPath);
    if (newPath !== '/' && newPath.endsWith('/')) {
      newPath = newPath.slice(0, -1);
    }

    localStorage.setItem(WORKING_DIR_INODE_ID_KEY, inodeId.toString());
    localStorage.setItem(WORKING_DIR_KEY, newPath);
  }

  return 0;
};

export const cd = { executor };
