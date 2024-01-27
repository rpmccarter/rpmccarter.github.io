import { useState } from 'react';
import { Cursor } from './Cursor';
import { Prompt } from './Prompt';

export const ActiveLine = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  const preText = text.substring(0, index);
  const char = text.at(index);
  const postText = text.substring(index + 1);

  return (
    <div>
      <Prompt />
      {preText}
      <Cursor char={char} />
      {postText}
    </div>
  );
};
