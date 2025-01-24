import { Trie } from '@/dataStructures/Trie';
import { fsDB } from '@/db/fs';
import { readDirectory } from '@/systemCalls/readDirectory';
import { Autocompleter } from '../executeCommand';
import { stat } from '@/systemCalls/stat';

export function fileAutocompleter(directoriesOnly = false): Autocompleter {
  return async (_argv, prefix) => {
    const lastSlashIndex = prefix.lastIndexOf('/');
    const partialPathSegment = prefix.slice(lastSlashIndex + 1);
    const parentDirPath = prefix.slice(0, lastSlashIndex + 1);

    const { directoryContents } = await readDirectory(
      await fsDB,
      parentDirPath
    );

    const validEntries = [];
    for (const entry of directoryContents.keys()) {
      if (entry === '.' || entry === '..') continue;

      if (directoriesOnly) {
        const fileInfo = await stat(await fsDB, parentDirPath + entry);
        if (fileInfo.mode === 'directory') {
          validEntries.push(entry);
        }
      } else {
        validEntries.push(entry);
      }
    }

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
        parentDirPath + autocompleteResult.match
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
      const fileInfo = await stat(await fsDB, parentDirPath + result);
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
}
