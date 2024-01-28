type InactiveLineParams = {
  text: string;
};

export const InactiveLine = ({ text }: InactiveLineParams) => {
  return <div className="whitespace-pre break-all">{text}</div>;
};
