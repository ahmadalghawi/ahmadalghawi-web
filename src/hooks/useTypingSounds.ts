import { useEffect, useRef } from 'react';

/**
 * Plays a subtle mechanical-keyboard click on every keydown event.
 * Synthesized live via Web Audio API — no asset files required.
 *
 * The AudioContext is created lazily on the first keypress to
 * respect browser autoplay policies.
 */
export function useTypingSounds(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const getCtx = () => {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        ctxRef.current = new AC();
      }
      return ctxRef.current;
    };

    const playClick = (isSpace: boolean, isEnter: boolean) => {
      const ctx = getCtx();
      if (!ctx) return;

      // Resume if the context was suspended
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const now = ctx.currentTime;

      // Main body — square wave with quick decay (the "clack")
      const osc = ctx.createOscillator();
      osc.type = 'square';
      const baseFreq = isSpace ? 140 : isEnter ? 220 : 700 + Math.random() * 500;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.03);

      const gain = ctx.createGain();
      const peak = isSpace ? 0.06 : isEnter ? 0.08 : 0.035;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      // High-frequency "tick" component
      const tick = ctx.createOscillator();
      tick.type = 'triangle';
      tick.frequency.setValueAtTime(3200 + Math.random() * 400, now);

      const tickGain = ctx.createGain();
      tickGain.gain.setValueAtTime(0.02, now);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain).connect(ctx.destination);
      tick.connect(tickGain).connect(ctx.destination);

      osc.start(now);
      tick.start(now);
      osc.stop(now + 0.05);
      tick.stop(now + 0.02);
    };

    const onKey = (e: KeyboardEvent) => {
      // Ignore modifier-only or repeat events
      if (e.repeat) return;
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

      // Throttle to avoid audio pile-up during very fast typing
      const nowMs = performance.now();
      if (nowMs - lastPlayedRef.current < 20) return;
      lastPlayedRef.current = nowMs;

      playClick(e.key === ' ', e.key === 'Enter');
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [enabled]);

  // Close the context when the hook unmounts permanently (e.g., HMR)
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);
}
