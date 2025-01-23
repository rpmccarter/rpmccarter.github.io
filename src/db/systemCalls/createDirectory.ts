import { FsDB } from '../fs';
import { serializeDirectoryContent } from './utils/dir';
import { readDirectory } from './readDirectory';
import { SysError } from './utils/SysError';

export async function createDirectory(
  db: FsDB,
  parentDirInodeId: number,
  name: string
) {
  const { directoryContents: parentDirContents, modifiedTime } =
    await readDirectory(db, parentDirInodeId);

  if (parentDirContents.has(name)) {
    throw new SysError('EEXIST', 'file already exists');
  }

  const writeDirTx = db.transaction(['inodes', 'blobs'], 'readwrite');
  const inodes = writeDirTx.objectStore('inodes');
  const blobs = writeDirTx.objectStore('blobs');

  const directoryInode = await inodes.get(parentDirInodeId);
  if (!directoryInode) {
    throw new SysError('ENOENT', 'directory inode not found');
  }
  if (directoryInode.modifiedTime > modifiedTime) {
    throw new SysError('EIO', 'directory inode write race condition');
  }

  const now = new Date();
  const newDirBlobId = await blobs.add(new Blob());
  const newDirBlob = serializeDirectoryContent(
    new Map([
      ['.', newDirBlobId],
      ['..', parentDirInodeId],
    ])
  );
  await blobs.put(newDirBlob, newDirBlobId);
  const newDirInodeId = await inodes.add({
    mode: 'directory',
    size: 0,
    accessedTime: now,
    modifiedTime: now,
    createdTime: now,
    linkCount: 1,
    blobId: newDirBlobId,
  });

  parentDirContents.set(name, newDirInodeId);
  const directoryBlob = serializeDirectoryContent(parentDirContents);
  await blobs.put(directoryBlob, directoryInode.blobId);
  await inodes.put(
    {
      ...directoryInode,
      accessedTime: now,
      modifiedTime: now,
    },
    parentDirInodeId
  );
}
