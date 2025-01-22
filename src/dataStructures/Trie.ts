type TrieData = {
  end: boolean;
  rest: { [char: string]: TrieData };
};

export type AutocompleteResult =
  | {
      matchType: 'none';
    }
  | {
      matchType: 'one';
      match: string;
    }
  | {
      matchType: 'many';
      prefix: string;
      matches: string[];
    };

export class Trie {
  private data: TrieData = { rest: {}, end: false };

  constructor(words?: string[]) {
    words?.forEach((word) => this.add(word));
  }

  public add(word: string) {
    let curr = this.data;
    for (const char of word) {
      if (!curr.rest[char]) curr.rest[char] = { rest: {}, end: false };
      curr = curr.rest[char];
    }
    curr.end = true;
  }

  public has(word: string): boolean {
    let curr = this.data;
    for (const char of word) {
      const next = curr.rest[char];
      if (next === undefined) return false;
      curr = next;
    }
    return curr.end;
  }

  public autocomplete(str: string): AutocompleteResult {
    let curr = this.data;
    for (const char of str) {
      const next = curr.rest[char];
      if (next === undefined) return { matchType: 'none' };
      curr = next;
    }

    const commonChars: string[] = [];
    // keep going deeper as long as there is exactly one possible next
    // character and no other word has ended
    while (Object.keys(curr.rest).length === 1 && !curr.end) {
      const onlyEntry = Object.entries(curr.rest)[0];
      if (onlyEntry === undefined) {
        throw Error('invariant error: first element of array undefined');
      }
      const [onlyKey, onlyValue] = onlyEntry;
      commonChars.push(onlyKey);
      curr = onlyValue;
    }

    const prefix = str + commonChars.join('');

    if (Object.keys(curr.rest).length === 0) {
      return {
        matchType: 'one',
        match: prefix,
      };
    }

    return {
      matchType: 'many',
      prefix,
      matches: Trie.getWords(curr, prefix),
    };
  }

  public allWords(): string[] {
    return Trie.getWords(this.data);
  }

  private static getWords(trie: TrieData, prefix: string = ''): string[] {
    const words = Object.entries(trie.rest).flatMap(([char, subtrie]) =>
      this.getWords(subtrie, prefix + char)
    );
    if (trie.end) words.push(prefix);
    return words;
  }
}
