import { FsDB } from '../fs';
import { serializeDirectoryContent } from './utils/dir';
import { readDirectory } from './readDirectory';

export async function deleteDirectory(
  db: FsDB,
  parentDirInodeId: number,
  name: string
) {
  const {
    directoryContents: parentDirContents,
    modifiedTime: parentDirModifiedTime,
  } = await readDirectory(db, parentDirInodeId);

  const targetDirInodeId = parentDirContents.get(name);

  if (targetDirInodeId === undefined) {
    throw Error('file does not exist');
  }

  const {
    directoryContents: targetDirContents,
    modifiedTime: targetDirModifiedTime,
  } = await readDirectory(db, targetDirInodeId);

  if (targetDirContents.size > 2) {
    throw Error('directory not empty');
  }

  const deleteDirTx = db.transaction(['inodes', 'blobs'], 'readwrite');
  const inodes = deleteDirTx.objectStore('inodes');
  const blobs = deleteDirTx.objectStore('blobs');

  const parentDirInode = await inodes.get(parentDirInodeId);
  if (!parentDirInode) {
    throw Error('parent directory inode not found');
  }
  if (parentDirInode.modifiedTime > parentDirModifiedTime) {
    throw Error('parent directory inode write race condition');
  }

  const targetDirInode = await inodes.get(targetDirInodeId);
  if (!targetDirInode) {
    throw Error('target directory inode not found');
  }
  if (targetDirInode.modifiedTime > targetDirModifiedTime) {
    throw Error('target directory inode write race condition');
  }

  await blobs.delete(targetDirInode.blobId);
  await inodes.delete(targetDirInodeId);
  parentDirContents.delete(name);

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
