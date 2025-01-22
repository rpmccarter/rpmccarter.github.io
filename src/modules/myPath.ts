export namespace myPath {
  export function isAbsolute(path: string): boolean {
    return path.startsWith('/');
  }

  export function normalize(path: string): string {
    const isAbs = isAbsolute(path);
    const isDir = path.endsWith('/');

    const segments = path.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const segment of segments) {
      if (segment === '.') {
        continue;
      } else if (segment === '..') {
        if (!isAbs && (stack.length === 0 || stack.at(-1) === '..')) {
          stack.push('..');
        } else {
          stack.pop();
        }
      } else {
        stack.push(segment);
      }
    }
    const joinedSegments = stack.join('/');

    if (joinedSegments === '') return isAbs ? '/' : '.';

    return (isAbs ? '/' : '') + joinedSegments + (isDir ? '/' : '');
  }
}
