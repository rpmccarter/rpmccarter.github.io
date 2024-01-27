import { useCallback, useEffect } from 'react';

export const useKeyInputs = (
  key: string | string[],
  callback?: ((key: string) => void) | ((key: string) => Promise<void>)
) => {
  const onKeypress = useCallback(
    (event: KeyboardEvent) => {
      const isMatch =
        typeof key === 'string' ? event.key === key : key.includes(event.key);
      if (!isMatch) return;

      event.preventDefault();
      void callback?.(event.key);
    },
    [callback, key]
  );

  useEffect(() => {
    addEventListener('keydown', onKeypress);
    return () => removeEventListener('keydown', onKeypress);
  }, [onKeypress]);
};
