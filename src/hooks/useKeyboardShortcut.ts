import { useCallback, useEffect } from 'react';

export const useKeyboardShortcut = (
  key: string,
  callback?: (() => void) | (() => Promise<void>)
) => {
  const onKeypress = useCallback(
    (event: KeyboardEvent) => {
      const isShortcut = event.key === key && (event.metaKey || event.ctrlKey);
      if (isShortcut) {
        event.preventDefault();
        void callback?.();
      }
    },
    [callback, key]
  );

  useEffect(() => {
    addEventListener('keydown', onKeypress);
    return () => removeEventListener('keydown', onKeypress);
  }, [onKeypress]);
};
