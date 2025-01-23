import { partitionArgs } from '@/shell/utils';
import { describe, expect, it } from 'bun:test';

describe('partitionArgs', () => {
  it('separates flags from positionals', () => {
    const argv = ['-f', '--hello', '-ls', 'foo', 'bar'];

    const { flags, positionals } = partitionArgs(argv);

    expect(flags).toEqual(new Set(['f', 'hello', 'l', 's']));
    expect(positionals).toEqual(['foo', 'bar']);
  });

  it('treats -- as separator', () => {
    const argv = ['-f', '--', '-g'];

    const { flags, positionals } = partitionArgs(argv);

    expect(flags).toEqual(new Set(['f']));
    expect(positionals).toEqual(['-g']);
  });

  it('treats subsequent -- as args', () => {
    const argv = ['-f', '--', '--'];

    const { flags, positionals } = partitionArgs(argv);

    expect(flags).toEqual(new Set(['f']));
    expect(positionals).toEqual(['--']);
  });

  it('handles all positionals', () => {
    const argv = ['hello', 'world'];

    const { flags, positionals } = partitionArgs(argv);

    expect(flags).toEqual(new Set());
    expect(positionals).toEqual(['hello', 'world']);
  });

  it('handles flag-like args after positionals', () => {
    const argv = ['foo', '-b'];

    const { flags, positionals } = partitionArgs(argv);

    expect(flags).toEqual(new Set());
    expect(positionals).toEqual(['foo', '-b']);
  });

  it('handles trivial case', () => {
    const argv: string[] = [];

    const { flags, positionals } = partitionArgs(argv);

    expect(flags).toEqual(new Set());
    expect(positionals).toEqual([]);
  });
});
