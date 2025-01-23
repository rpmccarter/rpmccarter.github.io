import { fsDB, readDirectory, resolveInodeId } from '@/db/fs';
import { Executor } from '../executeCommand';
import { partitionArgs } from '../utils';

const executor: Executor = async (argv, log) => {
  const { flags, positionals } = partitionArgs(argv);
  const showHidden = flags.has('a');

  const inodeId = await resolveInodeId(await fsDB, positionals[0] ?? '');
  const { directoryContents } = await readDirectory(await fsDB, inodeId);
  const entries = directoryContents
    .keys()
    .filter((entry) => showHidden || !entry.startsWith('.'))
    .toArray();

  log(entries.join('\n'));

  return 0;
};

export const ls = { executor };
