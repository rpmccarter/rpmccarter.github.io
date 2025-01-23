export function partitionArgs(argv: string[]): {
  flags: Set<string>;
  positionals: string[];
} {
  const flags = new Set<string>();
  const positionals: string[] = [];

  let isFlag = true;
  for (const arg of argv) {
    if (!isFlag) {
      positionals.push(arg);
    } else if (arg === '-') {
      isFlag = false;
    } else if (!arg.startsWith('-')) {
      isFlag = false;
      positionals.push(arg);
    } else {
      for (let i = 1; i < arg.length; i++) {
        const char = arg.at(i);
        if (char === undefined) break; // should never happen

        if (char === '-') {
          const rest = arg.slice(i + 1);
          if (rest === '') {
            // encountered "--" or "-x-"
            isFlag = false;
          } else {
            flags.add(rest);
          }
          break;
        } else {
          flags.add(char);
        }
      }
    }
  }

  return { flags, positionals };
}
