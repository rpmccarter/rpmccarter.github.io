import { FsDB } from '../fs';
import { readDirectory } from './readDirectory';

async function readFile(db: FsDB, directoryInodeId: number, name: string) {
  const { directoryContents } = await readDirectory(db, directoryInodeId);

  const readTx = db.transaction(['inodes', 'blobs'], 'readonly');
  const inodes = readTx.objectStore('inodes');
  const blobs = readTx.objectStore('blobs');

  const fileInodeId = directoryContents.get(name);
  if (fileInodeId === undefined) {
    throw new SysError('ENOENT', 'file does not exist');
  }

  const fileInode = await inodes.get(fileInodeId);
  if (!fileInode) {
    throw new SysError('ENOENT', 'file inode not found');
  }

  const { blobId: fileBlobId } = fileInode;
  const fileBlob = await blobs.get(fileBlobId);
  if (!fileBlob) {
    throw new SysError('ENOENT', 'file blob not found');
  }

  return fileBlob;
}
