import { fsDB } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils/partitionArgs';
import { createDirectory } from '@/systemCalls/createDirectory';
import { fileAutocompleter } from '../utils/fileAutocompleter';

const executor: Executor = async (argv, log) => {
  const { positionals } = partitionArgs(argv);

  const [firstDirArg] = positionals;
  if (firstDirArg === undefined) {
    log('mkdir: must supply directory name');
    return 64;
  }

  await createDirectory(await fsDB, firstDirArg);

  return 0;
};

export const mkdir = { executor, autocompleter: fileAutocompleter(true) };
