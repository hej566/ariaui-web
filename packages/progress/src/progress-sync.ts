import { getProgressSnapshot } from "./progress-state";

const progressRootObservers = new WeakMap<HTMLElement, MutationObserver>();
const syncingProgressRoots = new WeakSet<HTMLElement>();

function progressPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName;
}

export function syncProgressRoot(root: HTMLElement) {
  if (syncingProgressRoots.has(root)) {
    return;
  }

  syncingProgressRoots.add(root);
  try {
    const snapshot = getProgressSnapshot(root);
    root.setAttribute("aria-valuemin", String(snapshot.min));
    root.setAttribute("aria-valuemax", String(snapshot.max));
    root.setAttribute("aria-valuenow", String(snapshot.value));
    root.setAttribute("data-min", String(snapshot.min));
    root.setAttribute("data-max", String(snapshot.max));
    root.setAttribute("data-value", String(snapshot.value));

    if (snapshot.valueText === null) {
      root.removeAttribute("aria-valuetext");
    } else {
      root.setAttribute("aria-valuetext", snapshot.valueText);
    }
  } finally {
    syncingProgressRoots.delete(root);
  }
}

export function syncProgressPart(element: HTMLElement) {
  if (progressPartName(element) === "Root") {
    syncProgressRoot(element);
  }
}

export function observeProgressRoot(root: HTMLElement) {
  if (progressRootObservers.has(root)) {
    return;
  }

  const observer = new MutationObserver(() => {
    syncProgressRoot(root);
  });
  observer.observe(root, { childList: true, subtree: true });
  progressRootObservers.set(root, observer);
}

export function disconnectProgressRoot(root: HTMLElement) {
  progressRootObservers.get(root)?.disconnect();
  progressRootObservers.delete(root);
}
