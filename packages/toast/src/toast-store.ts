export type ToastTemplate = HTMLElement | HTMLTemplateElement | (() => HTMLElement);

export type CreateToastOptions = {
  duration?: number;
  id: string;
  template: ToastTemplate;
};

export type ToastRecord = {
  duration: number;
  id: string;
  onClose: () => void;
  template: ToastTemplate;
};

let currentToasts: ToastRecord[] = [];
const listeners = new Set<() => void>();
const toastLimits = new Map<symbol, number>();

function resolvedLimit() {
  return toastLimits.size === 0 ? Infinity : Math.min(...toastLimits.values());
}

function limited(toasts: ToastRecord[]) {
  const limit = resolvedLimit();
  return Number.isFinite(limit) && toasts.length > limit ? toasts.slice(0, limit) : toasts;
}

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeToToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastSnapshot() {
  return currentToasts;
}

export function createToast({ duration = 3000, id, template }: CreateToastOptions) {
  const onClose = () => dismissToast(id);
  currentToasts = limited([{ duration, id, onClose, template }, ...currentToasts]);
  notify();
  return onClose;
}

export function dismissToast(id: string) {
  const next = currentToasts.filter((toast) => toast.id !== id);
  if (next.length === currentToasts.length) return;
  currentToasts = next;
  notify();
}

export function retainToasts(ids: Iterable<string>) {
  const retainedIds = new Set(ids);
  const next = currentToasts.filter((toast) => retainedIds.has(toast.id));
  if (next.length === currentToasts.length) return;
  currentToasts = next;
  notify();
}

export function clearToasts() {
  if (currentToasts.length === 0) return;
  currentToasts = [];
  notify();
}

export function registerToastLimit(maxCount: number) {
  const key = Symbol("toast-limit");
  toastLimits.set(key, Math.max(1, Math.floor(maxCount)));
  const next = limited(currentToasts);
  if (next !== currentToasts) {
    currentToasts = next;
    notify();
  }
  return () => toastLimits.delete(key);
}

export function cloneToastTemplate(template: ToastTemplate) {
  if (typeof template === "function") return template();
  if (typeof HTMLTemplateElement !== "undefined" && template instanceof HTMLTemplateElement) {
    const element = template.content.firstElementChild?.cloneNode(true);
    if (!(element instanceof HTMLElement)) throw new TypeError("Toast templates must contain an element.");
    return element;
  }
  return template.cloneNode(true) as HTMLElement;
}
