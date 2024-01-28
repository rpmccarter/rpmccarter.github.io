import { useCallback, useEffect } from 'react';

type Modifier = 'metaKey' | 'ctrlKey' | 'altKey';

export const useKeyboardShortcut = (
  key: string,
  modifier: Modifier | Modifier[],
  callback?: (() => void) | (() => Promise<void>)
) => {
  const onKeypress = useCallback(
    (event: KeyboardEvent) => {
      const modifierPressed =
        typeof modifier === 'string'
          ? event[modifier]
          : modifier.every((key) => event[key]);
      const isShortcut = event.key === key && modifierPressed;
      if (isShortcut) {
        event.preventDefault();
        void callback?.();
      }
    },
    [callback, key, modifier]
  );

  useEffect(() => {
    addEventListener('keydown', onKeypress);
    return () => removeEventListener('keydown', onKeypress);
  }, [onKeypress]);
};
