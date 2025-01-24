import { myPath } from '@/modules/myPath';
import { FsDB } from '@/db/fs';
import { readDirectory } from './readDirectory';
import { SysError } from './utils/SysError';

export async function readFile(db: FsDB, path: string) {
  const pathSegments = path.split('/').filter(Boolean);
  const isAbs = myPath.isAbsolute(path);
  const fileName = pathSegments.pop() ?? '.';
  const parentDirPath = (isAbs ? '/' : '') + pathSegments.join('/');

  const { directoryContents } = await readDirectory(db, parentDirPath);

  const readTx = db.transaction(['inodes', 'blobs'], 'readonly');
  const inodes = readTx.objectStore('inodes');
  const blobs = readTx.objectStore('blobs');

  const fileInodeId = directoryContents.get(fileName);
  if (fileInodeId === undefined) {
    throw new SysError('ENOENT', 'file does not exist');
  }

  const fileInode = await inodes.get(fileInodeId);
  if (!fileInode) {
    throw new SysError('ENOENT', 'file inode not found');
  }

  if (fileInode.mode !== 'file') {
    throw new SysError('EISDIR', 'inode is a directory');
  }

  const { blobId: fileBlobId } = fileInode;
  const fileBlob = await blobs.get(fileBlobId);
  if (!fileBlob) {
    throw new SysError('ENOENT', 'file blob not found');
  }

  return fileBlob;
}
