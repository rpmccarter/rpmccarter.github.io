import { useCallback, useEffect, useState } from 'react';
import { Cursor } from './Cursor';
import { useCharInputs } from '@/hooks/useCharInputs';
import { useKeyInputs } from '@/hooks/useKeyInput';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

type ActiveLineProps = {
  onKeyPress: () => void;
  submitLine: (line: string) => void;
  prompt: string;
  autocomplete: (line: string) => Promise<string>;
};

export function ActiveLine({
  onKeyPress,
  submitLine,
  prompt,
  autocomplete,
}: ActiveLineProps) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [buffer, setBuffer] = useState('');

  useEffect(() => {
    onKeyPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, index]);

  useCharInputs((char) => {
    setText((prev) => prev.substring(0, index) + char + prev.substring(index));
    setIndex((prev) => prev + 1);
  });

  // cursor movement
  useKeyboardShortcut('a', 'ctrlKey', () => setIndex(0));
  useKeyboardShortcut('e', 'ctrlKey', () => setIndex(text.length));

  // delete
  useKeyboardShortcut('Backspace', 'metaKey', () => {
    setText('');
    setIndex(0);
  });

  useKeyboardShortcut('Backspace', 'altKey', () => {
    const preText = text.slice(0, index).trimEnd();
    const trimmedPreText = preText.substring(0, preText.lastIndexOf(' ') + 1);
    const postText = text.slice(index);
    const newString = trimmedPreText + postText;
    setText(newString);
    setIndex(trimmedPreText.length);
  });

  // cut
  useKeyboardShortcut('u', 'ctrlKey', () => {
    setBuffer(text);
    setText('');
    setIndex(0);
  });

  // paste
  useKeyboardShortcut('y', 'ctrlKey', () => {
    setText(text.slice(0, index) + buffer + text.slice(index));
    setIndex((prev) => prev + buffer.length);
  });

  const pasteFromClipboard = useCallback(async () => {
    try {
      const copiedText = await navigator.clipboard.readText();
      setText(text.slice(0, index) + copiedText + text.slice(index));
      setIndex((prev) => prev + copiedText.length);
    } catch {}
  }, [index, text]);
  useKeyboardShortcut('v', 'metaKey', pasteFromClipboard);
  useKeyboardShortcut('v', 'ctrlKey', pasteFromClipboard);

  useKeyInputs('Enter', () => {
    submitLine(text);
  });

  useKeyInputs('Tab', async () => {
    const completedLine = await autocomplete(text);
    setText(completedLine);
    setIndex(completedLine.length);
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
  const codePoint = text.codePointAt(index);
  const char =
    codePoint !== undefined ? String.fromCodePoint(codePoint) : undefined;
  const postText = text.substring(index + 1);

  return (
    <div className="whitespace-break-spaces max-w-full text-wrap break-all">
      {prompt}
      {preText}
      <Cursor char={char} key={index} />
      {postText}
    </div>
  );
}
