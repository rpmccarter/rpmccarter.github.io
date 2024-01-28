type AutocompleteOptionsProps = {
  options: string[];
};

export const AutocompleteOptions = ({ options }: AutocompleteOptionsProps) => {
  return (
    <>
      {options.map((option, i) => (
        <div className="whitespace-pre break-all" key={i}>
          {option}
        </div>
      ))}
    </>
  );
};
