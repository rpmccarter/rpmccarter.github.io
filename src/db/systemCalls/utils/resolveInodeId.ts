import { FsDB } from '@/db/fs';
import { myPath } from '@/modules/myPath';
import {
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
} from '@/shell/constants';
import { readDirectoryBlob } from './readDirectoryBlob';

export async function resolveInodeId(db: FsDB, path: string): Promise<number> {
  const pathSegments = path.split('/').filter(Boolean);

  const baseInodeStr = localStorage.getItem(
    myPath.isAbsolute(path) ? ROOT_DIR_INODE_ID_KEY : WORKING_DIR_INODE_ID_KEY
  );
  if (baseInodeStr === null) {
    throw Error('missing inode id');
  }
  const baseInode = parseInt(baseInodeStr);
  if (isNaN(baseInode)) {
    throw Error('invalid inode id');
  }

  return resolveInodeIdRecursive(db, baseInode, pathSegments);
}

async function resolveInodeIdRecursive(
  db: FsDB,
  inodeId: number,
  pathSegments: string[],
  index = 0
): Promise<number> {
  if (pathSegments[index] === undefined) return inodeId;

  const { directoryContents } = await readDirectoryBlob(db, inodeId);
  const nextInodeId = directoryContents.get(pathSegments[index]);
  if (nextInodeId === undefined) {
    throw Error('no such file or directory');
  }

  return resolveInodeIdRecursive(db, nextInodeId, pathSegments, index + 1);
}
