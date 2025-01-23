import { myPath } from '@/modules/myPath';
import {
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
  WORKING_DIR_KEY,
} from '@/shell/constants';
import { fsDB } from '@/db/fs';
import { resolveInodeId } from './utils/resolveInodeId';
import { SysError } from './utils/SysError';

export async function changeDirectory(path: string | undefined) {
  if (path === undefined) {
    const rootInodeId = localStorage.getItem(ROOT_DIR_INODE_ID_KEY);
    if (rootInodeId === null) {
      throw new SysError('ENOENT', 'home directory not found');
    }
    localStorage.setItem(WORKING_DIR_INODE_ID_KEY, rootInodeId);
    localStorage.setItem(WORKING_DIR_KEY, '/');
  } else {
    const inodeId = await resolveInodeId(await fsDB, path);

    const inode = await (await fsDB)
      .transaction('inodes', 'readonly')
      .objectStore('inodes')
      .get(inodeId);

    if (inode === undefined) {
      throw new SysError('ENOENT', 'could not load inode');
    }
    if (inode.mode !== 'directory') {
      throw new SysError('ENOTDIR', 'inode is not a directory');
    }

    const normalizedPath = myPath.normalize(path);

    const basePathStr = localStorage.getItem(WORKING_DIR_KEY);
    if (basePathStr === null) {
      throw new SysError('EGREGIOUS', 'missing directory information');
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
}
