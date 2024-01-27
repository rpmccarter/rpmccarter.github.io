import { useState } from 'react';
import { Cursor } from './Cursor';
import { Prompt } from './Prompt';
import { useCharInputs } from '@/hooks/useCharInputs';
import { useKeyInputs } from '@/hooks/useKeyInput';

export const ActiveLine = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  useCharInputs((char) => {
    setText((prev) => prev.substring(0, index) + char + prev.substring(index));
    setIndex((prev) => prev + 1);
  });

  useKeyInputs('Backspace', () => {
    setText((prev) => prev.substring(0, index - 1) + prev.substring(index));
    setIndex((prev) => Math.max(prev - 1, 0));
  });

  useKeyInputs('ArrowLeft', () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  });

  useKeyInputs('ArrowRight', () => {
    setIndex((prev) => Math.min(prev + 1, text.length));
  });

  const preText = text.substring(0, index);
  const char = text.at(index);
  const postText = text.substring(index + 1);

  return (
    <div className="whitespace-pre max-w-full text-wrap break-all">
      <Prompt />
      {preText}
      <Cursor char={char} key={index} />
      {postText}
    </div>
  );
};