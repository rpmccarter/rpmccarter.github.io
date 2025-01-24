import { Trie } from '@/dataStructures/Trie';
import { fsDB } from '@/db/fs';
import { readDirectory } from '@/systemCalls/readDirectory';
import { Autocompleter } from '../executeCommand';
import { stat } from '@/systemCalls/stat';

export const fileAutocompleter: Autocompleter = async (_argv, prefix) => {
  let lastSlashIndex = prefix.lastIndexOf('/');
  const partialPathSegment = prefix.slice(lastSlashIndex + 1);
  const parentDirPath = prefix.slice(0, lastSlashIndex + 1);

  const { directoryContents } = await readDirectory(await fsDB, parentDirPath);
  const validEntries = directoryContents
    .keys()
    .filter((entry) => entry !== '.' && entry !== '..')
    .toArray();

  if (validEntries.length === 0) {
    return { matchType: 'none' };
  }

  const trie = new Trie(validEntries);

  const autocompleteResult = trie.autocomplete(partialPathSegment);

  if (autocompleteResult.matchType === 'none') {
    return autocompleteResult;
  }

  if (autocompleteResult.matchType === 'one') {
    const fileInfo = await stat(
      await fsDB,
      parentDirPath + '/' + autocompleteResult.match
    );
    if (fileInfo.mode === 'directory') {
      return {
        matchType: 'many',
        prefix: parentDirPath + autocompleteResult.match + '/',
        matches: [],
      };
    } else {
      return {
        matchType: 'one',
        match: parentDirPath + autocompleteResult.match,
      };
    }
  }

  const resultsWithSlashes = [];
  for (const result of autocompleteResult.matches) {
    const fileInfo = await stat(await fsDB, parentDirPath + '/' + result);
    resultsWithSlashes.push(
      result + (fileInfo.mode === 'directory' ? '/' : '')
    );
  }
  return {
    matchType: 'many',
    prefix: parentDirPath + autocompleteResult.prefix,
    matches: resultsWithSlashes,
  };
};
