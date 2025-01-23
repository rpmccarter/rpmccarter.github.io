import { FsDB } from '../fs';
import { serializeDirectoryContent } from './utils/dir';
import { readDirectory } from './readDirectory';
import { SysError } from './utils/SysError';
import { myPath } from '@/modules/myPath';
import { resolveInodeId } from './utils/resolveInodeId';
import { ROOT_DIR_INODE_ID_KEY } from '@/shell/constants';

export async function deleteDirectory(db: FsDB, path: string) {
  const pathSegments = path.split('/').filter(Boolean);
  const isAbs = myPath.isAbsolute(path);
  const dirName = pathSegments.pop() ?? '.';
  const parentDirPath = (isAbs ? '/' : '') + pathSegments.join('/');

  const parentDirInodeId = await resolveInodeId(db, parentDirPath);

  if (parentDirInodeId === undefined) {
    throw new SysError('ENOENT', 'file does not exist');
  }

  const {
    directoryContents: parentDirContents,
    modifiedTime: parentDirModifiedTime,
  } = await readDirectory(db, parentDirPath);

  const targetDirInodeId = parentDirContents.get(dirName);

  if (targetDirInodeId === undefined) {
    throw new SysError('ENOENT', 'file does not exist');
  }

  const rootDirInodeIdStr = localStorage.getItem(ROOT_DIR_INODE_ID_KEY);
  if (rootDirInodeIdStr === null) {
    throw new SysError('EGREGIOUS', 'missing root dir inode id');
  }
  const rootDirInodeId = parseInt(rootDirInodeIdStr);
  if (isNaN(rootDirInodeId)) {
    throw new SysError('EGREGIOUS', 'invalid root dir inode id');
  }

  if (targetDirInodeId === rootDirInodeId) {
    throw new SysError('EBUSY', 'cannot delete root directory');
  }

  const {
    directoryContents: targetDirContents,
    modifiedTime: targetDirModifiedTime,
  } = await readDirectory(db, path);

  if (targetDirContents.size > 2) {
    throw new SysError('ENOTEMPTY', 'directory not empty');
  }

  const deleteDirTx = db.transaction(['inodes', 'blobs'], 'readwrite');
  const inodes = deleteDirTx.objectStore('inodes');
  const blobs = deleteDirTx.objectStore('blobs');

  const parentDirInode = await inodes.get(parentDirInodeId);
  if (!parentDirInode) {
    throw new SysError('ENOENT', 'parent directory inode not found');
  }
  if (parentDirInode.modifiedTime > parentDirModifiedTime) {
    throw new SysError('EIO', 'parent directory inode write race condition');
  }

  const targetDirInode = await inodes.get(targetDirInodeId);
  if (!targetDirInode) {
    throw new SysError('ENOENT', 'target directory inode not found');
  }
  if (targetDirInode.modifiedTime > targetDirModifiedTime) {
    throw new SysError('EIO', 'target directory inode write race condition');
  }

  await blobs.delete(targetDirInode.blobId);
  await inodes.delete(targetDirInodeId);
  parentDirContents.delete(dirName);

  const now = new Date();
  const parentDirBlob = serializeDirectoryContent(parentDirContents);
  await blobs.put(parentDirBlob, parentDirInode.blobId);
  await inodes.put(
    {
      ...parentDirInode,
      accessedTime: now,
      modifiedTime: now,
    },
    parentDirInodeId
  );
}
