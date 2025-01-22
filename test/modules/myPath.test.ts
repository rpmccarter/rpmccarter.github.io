import { myPath } from '@/modules/myPath';
import nodePath from 'node:path';
import { describe, expect, it, test } from 'bun:test';

describe('normalize', () => {
  it('handles .. segments in relative paths', () => {
    const path = 'foo/bar/baz/../../qux/../quux';
    expect(myPath.normalize(path)).toEqual('foo/quux');
  });

  it('handles .. segments in absolute paths', () => {
    const path = '/../../../foo/bar/..';
    expect(myPath.normalize(path)).toEqual('/foo');
  });

  it('preserves trailing slash', () => {
    const path = 'foo/';
    expect(myPath.normalize(path)).toEqual('foo/');
  });

  it('removes . segments', () => {
    const path = './foo/.';
    expect(myPath.normalize(path)).toEqual('foo');
  });

  test.each([
    'foo/bar',
    '/foo/bar',
    '////foo/bar/',
    './foo',
    '..',
    '',
    '/',
    '/../..',
    '/../foo',
    '...',
    '.foo',
  ])('matches node:path behavior for "%s"', (path) => {
    expect(myPath.normalize(path)).toEqual(nodePath.normalize(path));
  });
});
