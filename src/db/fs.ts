import initFs from '@/boot/initFs';
import { myPath } from '@/modules/myPath';
import {
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
} from '@/shell/constants';
import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from 'idb';

export type Mode = 'directory' | 'symlink' | 'file';

export type INode = {
  mode: Mode;
  size: number;
  accessedTime: Date;
  modifiedTime: Date;
  deletedTime?: Date;
  createdTime: Date;
  linkCount: number;
  blobId: number;
};

interface FsDBSchema extends DBSchema {
  inodes: {
    key: number;
    value: INode;
  };
  blobs: {
    key: number;
    value: Blob;
  };
}

export interface FsDB extends IDBPDatabase<FsDBSchema> {}
export interface FsDBUpgradeTX
  extends IDBPTransaction<FsDBSchema, ['inodes', 'blobs'], 'versionchange'> {}

export const fsDB = openDB<FsDBSchema>('fs', 1, {
  upgrade(db, _oldVersion, _newVersion, tx) {
    db.createObjectStore('inodes', { autoIncrement: true });
    db.createObjectStore('blobs', { autoIncrement: true });

    initFs(tx);
  },
});

export async function resolveInodeId(db: FsDB, path: string): Promise<number> {
  const normalizedPath = myPath.normalize(path);
  const pathSegments = normalizedPath.split('/').filter(Boolean);

  const baseInodeStr = localStorage.getItem(
    myPath.isAbsolute(normalizedPath)
      ? ROOT_DIR_INODE_ID_KEY
      : WORKING_DIR_INODE_ID_KEY
  );
  if (baseInodeStr === null) {
    throw Error('missing inode id');
  }
  const baseInode = parseInt(baseInodeStr);
  if (isNaN(baseInode)) {
    throw Error('invalid inode id');
  }

  return resolveInodeIdRecursive(db, baseInode, pathSegments);
}

async function resolveInodeIdRecursive(
  db: FsDB,
  inodeId: number,
  pathSegments: string[],
  index = 0
): Promise<number> {
  if (pathSegments[index] === undefined) return inodeId;

  const { directoryContents } = await readDirectory(db, inodeId);
  const nextInodeId = directoryContents.get(pathSegments[index]);
  if (nextInodeId === undefined) {
    throw Error('no such file or directory');
  }

  return resolveInodeIdRecursive(db, nextInodeId, pathSegments, index + 1);
}

async function readFile(db: FsDB, directoryInodeId: number, name: string) {
  const { directoryContents } = await readDirectory(db, directoryInodeId);

  const readTx = db.transaction(['inodes', 'blobs'], 'readonly');
  const inodes = readTx.objectStore('inodes');
  const blobs = readTx.objectStore('blobs');

  const fileInodeId = directoryContents.get(name);
  if (fileInodeId === undefined) {
    throw Error('file does not exist');
  }

  const fileInode = await inodes.get(fileInodeId);
  if (!fileInode) {
    throw Error('file inode not found');
  }

  const { blobId: fileBlobId } = fileInode;
  const fileBlob = await blobs.get(fileBlobId);
  if (!fileBlob) {
    throw Error('file blob not found');
  }

  return fileBlob;
}

export async function readDirectory(db: FsDB, directoryInodeId: number) {
  const checkDirectoryTx = db.transaction(['inodes', 'blobs'], 'readonly');
  const inodes = checkDirectoryTx.objectStore('inodes');
  const blobs = checkDirectoryTx.objectStore('blobs');

  const directoryInode = await inodes.get(directoryInodeId);
  if (!directoryInode) {
    throw Error('directory inode not found');
  }

  const { blobId: directoryBlobId, modifiedTime } = directoryInode;
  const directoryContentsBlob = await blobs.get(directoryBlobId);
  if (!directoryContentsBlob) {
    throw Error('directory blob not found');
  }

  const directoryContents = await deserializeDirectoryContent(
    directoryContentsBlob
  );

  return { directoryContents, modifiedTime };
}

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
    throw Error('file already exists');
  }

  const writeFileTx = db.transaction(['inodes', 'blobs'], 'readwrite');
  const inodes = writeFileTx.objectStore('inodes');
  const blobs = writeFileTx.objectStore('blobs');

  const directoryInode = await inodes.get(directoryInodeId);
  if (!directoryInode) {
    throw Error('directory inode not found');
  }
  if (directoryInode.modifiedTime > modifiedTime) {
    throw Error('directory inode write race condition');
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
  await inodes.put({
    ...directoryInode,
    accessedTime: now,
    modifiedTime: now,
  });
}

async function deserializeDirectoryContent(
  content: Blob
): Promise<Map<string, number>> {
  const directoryString = await content.text();
  const directoryEntries = directoryString.split('\n').map((line) => {
    const [entry, inodeStr, rest] = line.split('\t', 2);
    if (entry === undefined || inodeStr === undefined || rest !== undefined) {
      throw Error('directory data corrupted');
    }
    const inode = parseInt(inodeStr);
    if (isNaN(inode)) {
      throw Error('invalid inode number');
    }
    return [entry, inode] as const;
  });
  return new Map(directoryEntries);
}

function serializeDirectoryContent(
  directoryEntries: Map<string, number>
): Blob {
  const directoryContentString = directoryEntries
    .entries()
    .toArray()
    .map((pair) => pair.join('\t'))
    .join('\n');
  return new Blob([directoryContentString]);
}
