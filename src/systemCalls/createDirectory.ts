import { FsDB } from '@/db/fs';
import { serializeDirectoryContent } from './utils/dir';
import { readDirectory } from './readDirectory';
import { SysError } from './utils/SysError';
import { myPath } from '@/modules/myPath';
import { resolveInodeId } from './utils/resolveInodeId';

export async function createDirectory(db: FsDB, path: string) {
  const pathSegments = path.split('/').filter(Boolean);
  const isAbs = myPath.isAbsolute(path);
  const dirName = pathSegments.pop() ?? '.';
  const parentDirPath = (isAbs ? '/' : '') + pathSegments.join('/');

  const parentDirInodeId = await resolveInodeId(db, parentDirPath);

  const { directoryContents: parentDirContents, modifiedTime } =
    await readDirectory(db, parentDirPath);

  if (parentDirContents.has(dirName)) {
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

  parentDirContents.set(dirName, newDirInodeId);
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
