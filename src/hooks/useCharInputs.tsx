import { useCallback, useEffect } from 'react';

export function useCharInputs(
  callback?: ((char: string) => void) | ((char: string) => Promise<void>)
) {
  const onKeypress = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.key.length > 1) return;
      event.preventDefault();
      void callback?.(event.key);
    },
    [callback]
  );

  useEffect(() => {
    addEventListener('keydown', onKeypress);
    return () => removeEventListener('keydown', onKeypress);
  }, [onKeypress]);
}
