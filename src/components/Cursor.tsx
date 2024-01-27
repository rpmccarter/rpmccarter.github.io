type CursorProps = {
  char?: string;
};

export const Cursor = ({ char }: CursorProps) => {
  return <span className="animate-blink whitespace-pre">{char ?? ' '}</span>;
};
