export async function deserializeDirectoryContent(
  content: Blob
): Promise<Map<string, number>> {
  const directoryString = await content.text();
  const directoryEntries = directoryString.split('\n').map((line) => {
    const [entry, inodeStr, rest] = line.split('\t', 2);
    if (entry === undefined || inodeStr === undefined || rest !== undefined) {
      throw Error('directory data corrupted');
    }
    const inode = parseInt(inodeStr);
    if (isNaN(inode)) {
      throw Error('invalid inode number');
    }
    return [entry, inode] as const;
  });
  return new Map(directoryEntries);
}

export function serializeDirectoryContent(
  directoryEntries: Map<string, number>
): Blob {
  const directoryContentString = directoryEntries
    .entries()
    .toArray()
    .map((pair) => pair.join('\t'))
    .join('\n');
  return new Blob([directoryContentString]);
}
