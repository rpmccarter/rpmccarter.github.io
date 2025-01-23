import { FsDB } from '../fs';
import { serializeDirectoryContent } from './utils/dir';
import { readDirectory } from './readDirectory';
import { SysError } from './utils/SysError';
import { myPath } from '@/modules/myPath';
import { resolveInodeId } from './utils/resolveInodeId';

export async function createFile(db: FsDB, path: string, content: Blob) {
  const pathSegments = path.split('/').filter(Boolean);
  const isAbs = myPath.isAbsolute(path);
  const fileName = pathSegments.pop() ?? '.';
  const parentDirPath = (isAbs ? '/' : '') + pathSegments.join('/');

  const parentDirInodeId = await resolveInodeId(db, parentDirPath);

  const { directoryContents, modifiedTime } = await readDirectory(
    db,
    parentDirPath
  );

  if (directoryContents.has(fileName)) {
    throw new SysError('EEXIST', 'file already exists');
  }

  const writeFileTx = db.transaction(['inodes', 'blobs'], 'readwrite');
  const inodes = writeFileTx.objectStore('inodes');
  const blobs = writeFileTx.objectStore('blobs');

  const parentDirInode = await inodes.get(parentDirInodeId);
  if (!parentDirInode) {
    throw new SysError('ENOENT', 'directory inode not found');
  }
  if (parentDirInode.modifiedTime > modifiedTime) {
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

  directoryContents.set(fileName, newFileInodeId);
  const directoryBlob = serializeDirectoryContent(directoryContents);
  await blobs.put(directoryBlob, parentDirInode.blobId);
  await inodes.put(
    {
      ...parentDirInode,
      accessedTime: now,
      modifiedTime: now,
    },
    parentDirInodeId
  );
}
