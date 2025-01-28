type AutocompleteOptionsProps = {
  options: string[];
};

export function AutocompleteOptions({ options }: AutocompleteOptionsProps) {
  return (
    <>
      {options.map((option, i) => (
        <div className="whitespace-break-spaces break-all" key={i}>
          {option}
        </div>
      ))}
    </>
  );
}
