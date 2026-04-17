import { useEffect } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const IGNORED = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'];

export function useKonami(onTrigger: () => void) {
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      // Ignore modifier-only keypresses so they don't reset the sequence
      if (IGNORED.includes(e.key)) return;

      const expected = SEQUENCE[idx];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        idx++;
        if (idx === SEQUENCE.length) {
          onTrigger();
          idx = 0;
        }
      } else {
        // Allow the wrong key itself to be the start of a new sequence
        idx = e.key.toLowerCase() === SEQUENCE[0].toLowerCase() ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onTrigger]);
}
