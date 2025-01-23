import { FsDB } from '../fs';
import { serializeDirectoryContent } from './utils/dir';
import { readDirectory } from './readDirectory';

export async function createFile(
  db: FsDB,
  directoryInodeId: number,
  name: string,
  content: Blob
) {
  const { directoryContents, modifiedTime } = await readDirectory(
    db,
    directoryInodeId
  );

  if (directoryContents.has(name)) {
    throw new SysError('EEXIST', 'file already exists');
  }

  const writeFileTx = db.transaction(['inodes', 'blobs'], 'readwrite');
  const inodes = writeFileTx.objectStore('inodes');
  const blobs = writeFileTx.objectStore('blobs');

  const directoryInode = await inodes.get(directoryInodeId);
  if (!directoryInode) {
    throw new SysError('ENOENT', 'directory inode not found');
  }
  if (directoryInode.modifiedTime > modifiedTime) {
    throw new SysError('EIO', 'directory inode write race condition');
  }

  const now = new Date();
  const newFileBlobId = await blobs.add(content);
  const newFileInodeId = await inodes.add({
    mode: 'file',
    size: content.size,
    accessedTime: now,
    modifiedTime: now,
    createdTime: now,
    linkCount: 1,
    blobId: newFileBlobId,
  });

  directoryContents.set(name, newFileInodeId);
  const directoryBlob = serializeDirectoryContent(directoryContents);
  await blobs.put(directoryBlob, directoryInode.blobId);
  await inodes.put(
    {
      ...directoryInode,
      accessedTime: now,
      modifiedTime: now,
    },
    directoryInodeId
  );
}
