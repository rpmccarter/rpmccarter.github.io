import { AutocompleteResult, Trie } from '@/dataStructures/Trie';
import { describe, it, expect, test } from 'bun:test';

describe('Trie', () => {
  it('contains no words to start', () => {
    const trie = new Trie();

    expect(trie.allWords()).toEqual([]);
  });

  it('adds words in constructor', () => {
    const words = ['foo', 'bar', 'baz'];

    const trie = new Trie(words);

    expect(trie.autocomplete('')).toEqual({
      matchType: 'many',
      prefix: '',
      matches: words,
    });
  });

  test.each<[string, AutocompleteResult]>([
    ['f', { matchType: 'one', match: 'foo' }],
    ['b', { matchType: 'many', prefix: 'ba', matches: ['bar', 'baz'] }],
    ['ba', { matchType: 'many', prefix: 'ba', matches: ['bar', 'baz'] }],
    ['z', { matchType: 'none' }],
    ['hello', { matchType: 'none' }],
    ['barz', { matchType: 'none' }],
    ['', { matchType: 'many', prefix: '', matches: ['foo', 'bar', 'baz'] }],
  ])("autocompletes words starting with '%s'", (prefix, result) => {
    const words = ['foo', 'bar', 'baz'];

    const trie = new Trie(words);

    expect(trie.autocomplete(prefix)).toEqual(result);
  });
});
