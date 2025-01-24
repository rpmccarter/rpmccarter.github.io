import { FsDB } from '@/db/fs';
import { resolveInodeId } from './utils/resolveInodeId';
import { SysError } from './utils/SysError';

export async function stat(db: FsDB, path: string) {
  const inodeId = await resolveInodeId(db, path);
  const inode = await db
    .transaction(['inodes'], 'readonly')
    .objectStore('inodes')
    .get(inodeId);

  if (inode === undefined) {
    throw new SysError('ENOENT', 'inode not found');
  }

  return inode;
}
