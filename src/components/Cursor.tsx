type CursorProps = {
  char?: string;
};

export function Cursor({ char }: CursorProps) {
  return <span className="animate-blink whitespace-pre">{char ?? ' '}</span>;
}
