let toastIdCounter = 0;
export type ToastKind = 'success' | 'error' | 'info';

export interface ToastEntry {
  id: number;
  kind: ToastKind;
  message: string;
}

export const toastListeners = new Set<(toasts: ToastEntry[]) => void>();
export let toastsState: ToastEntry[] = [];

export function pushToast(kind: ToastKind, message: string, ms = 3500) {
  const id = ++toastIdCounter;
  toastsState = [...toastsState, { id, kind, message }];
  toastListeners.forEach((fn) => fn(toastsState));
  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(toastsState));
  }, ms);
}
