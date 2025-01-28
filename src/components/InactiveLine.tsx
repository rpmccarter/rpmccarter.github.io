type InactiveLineParams = {
  text: string;
};

export function InactiveLine({ text }: InactiveLineParams) {
  return <div className="whitespace-break-spaces break-all">{text}</div>;
}
