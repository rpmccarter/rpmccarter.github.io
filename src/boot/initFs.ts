import { FsDBUpgradeTX } from '@/db/fs';
import {
  OLD_WORKING_DIR_KEY,
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
  WORKING_DIR_KEY,
} from '@/shell/constants';

export default async function initFs(tx: FsDBUpgradeTX) {
  const inodes = tx.objectStore('inodes');
  const blobs = tx.objectStore('blobs');

  const now = new Date();

  const helloWorldBlob = new Blob(['hello world']);
  const helloWorldBlobId = await blobs.add(helloWorldBlob);
  const helloWorldInodeId = await inodes.add({
    mode: 'file',
    size: helloWorldBlob.size,
    accessedTime: now,
    modifiedTime: now,
    createdTime: now,
    linkCount: 1,
    blobId: helloWorldBlobId,
  });

  const rootBlobId = await blobs.add(new Blob());
  const directoryContents = new Map([
    ['.', rootBlobId],
    ['..', rootBlobId],
    ['helloWorld.txt', helloWorldInodeId],
  ]);
  const directoryContentString = directoryContents
    .entries()
    .toArray()
    .map((pair) => pair.join('\t'))
    .join('\n');
  await blobs.put(new Blob([directoryContentString]), rootBlobId);
  const rootInodeId = await inodes.add({
    mode: 'directory',
    size: 0,
    accessedTime: now,
    modifiedTime: now,
    createdTime: now,
    linkCount: 1,
    blobId: rootBlobId,
  });
  localStorage.setItem(ROOT_DIR_INODE_ID_KEY, rootInodeId.toString());
  localStorage.setItem(WORKING_DIR_INODE_ID_KEY, rootInodeId.toString());
  localStorage.setItem(WORKING_DIR_KEY, '/');
  localStorage.setItem(OLD_WORKING_DIR_KEY, '/');
}
