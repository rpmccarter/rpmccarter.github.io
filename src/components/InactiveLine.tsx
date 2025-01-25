type InactiveLineParams = {
  text: string;
};

export function InactiveLine({ text }: InactiveLineParams) {
  return <div className="whitespace-pre break-all">{text}</div>;
}
