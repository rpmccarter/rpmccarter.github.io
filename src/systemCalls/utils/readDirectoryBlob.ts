import { FsDB } from '@/db/fs';
import { deserializeDirectoryContent } from './dir';
import { SysError } from './SysError';

export async function readDirectoryBlob(db: FsDB, directoryInodeId: number) {
  const checkDirectoryTx = db.transaction(['inodes', 'blobs'], 'readonly');
  const inodes = checkDirectoryTx.objectStore('inodes');
  const blobs = checkDirectoryTx.objectStore('blobs');

  const directoryInode = await inodes.get(directoryInodeId);
  if (!directoryInode) {
    throw new SysError('ENOENT', 'directory inode not found');
  }

  if (directoryInode.mode !== 'directory') {
    throw new SysError('ENOTDIR', 'inode not a directory');
  }

  const { blobId: directoryBlobId, modifiedTime } = directoryInode;
  const directoryContentsBlob = await blobs.get(directoryBlobId);
  if (!directoryContentsBlob) {
    throw new SysError('ENOENT', 'directory blob not found');
  }

  const directoryContents = await deserializeDirectoryContent(
    directoryContentsBlob
  );

  return { directoryContents, modifiedTime };
}
