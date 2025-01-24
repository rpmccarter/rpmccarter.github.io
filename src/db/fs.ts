import initFs from '@/boot/initFs';
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

    void initFs(tx);
  },
});
