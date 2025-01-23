import { FsDB } from '../fs';
import { deserializeDirectoryContent } from './utils/dir';
import { SysError } from './utils/SysError';

export async function readDirectory(db: FsDB, directoryInodeId: number) {
  const checkDirectoryTx = db.transaction(['inodes', 'blobs'], 'readonly');
  const inodes = checkDirectoryTx.objectStore('inodes');
  const blobs = checkDirectoryTx.objectStore('blobs');

  const directoryInode = await inodes.get(directoryInodeId);
  if (!directoryInode) {
    throw new SysError('ENOENT', 'directory inode not found');
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
