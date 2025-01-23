import { fsDB, FsDB } from '@/db/fs';
import { deserializeDirectoryContent } from './utils/dir';
import { readDirectoryBlob } from './utils/readDirectoryBlob';
import { resolveInodeId } from './utils/resolveInodeId';

export async function readDirectory(db: FsDB, path: string) {
  const directoryInodeId = await resolveInodeId(db, path);
  return await readDirectoryBlob(db, directoryInodeId);
}
