import { useEffect } from 'react';

type Handler = (e: KeyboardEvent) => void;

/**
 * Global keyboard shortcut binding.
 * key format examples: "mod+p", "mod+shift+p", "ctrl+b", "Escape", "1"
 *  - `mod` = Ctrl on Win/Linux, Cmd on macOS
 */
export function useHotkeys(bindings: Record<string, Handler>, deps: unknown[] = []) {
  useEffect(() => {
    const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

    const matches = (combo: string, e: KeyboardEvent) => {
      const parts = combo.toLowerCase().split('+').map(s => s.trim());
      const key = parts.pop()!;
      const needsMod   = parts.includes('mod');
      const needsCtrl  = parts.includes('ctrl');
      const needsShift = parts.includes('shift');
      const needsAlt   = parts.includes('alt');

      const modPressed = isMac ? e.metaKey : e.ctrlKey;
      if (needsMod  && !modPressed) return false;
      if (needsCtrl && !e.ctrlKey)  return false;
      if (needsShift !== e.shiftKey) return false;
      if (needsAlt   !== e.altKey)   return false;
      if (!needsMod && !needsCtrl && (isMac ? e.metaKey : e.ctrlKey)) return false;

      return e.key.toLowerCase() === key;
    };

    const onKey = (e: KeyboardEvent) => {
      for (const combo of Object.keys(bindings)) {
        if (matches(combo, e)) {
          bindings[combo](e);
          return;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
