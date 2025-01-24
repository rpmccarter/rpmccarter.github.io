import { SysError } from '@/systemCalls/utils/SysError';
import { Executor } from '../executeCommand';
import { readFile } from '@/systemCalls/readFile';
import { fsDB } from '@/db/fs';

const executor: Executor = async (argv, log) => {
  const [firstArg] = argv;

  if (firstArg === undefined) return 0;

  try {
    const fileBlob = await readFile(await fsDB, firstArg);
    const text = await fileBlob.text();
    log(text);
  } catch (e) {
    if (e instanceof SysError) {
      if (e.code === 'ENOENT') {
        log(`cat: ${firstArg}: no such file or directory`);
      } else if (e.code === 'EISDIR') {
        log(`cat: ${firstArg}: is a directory`);
      }
    } else {
      throw e;
    }
  }

  return 0;
};

export const cat = { executor };
