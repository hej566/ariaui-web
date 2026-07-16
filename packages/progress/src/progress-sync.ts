import { getProgressSnapshot, type ProgressSnapshot } from "./progress-state";

const progressRootObservers = new WeakMap<HTMLElement, MutationObserver>();
const syncingProgressRoots = new WeakSet<HTMLElement>();

function progressPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName;
}

function nearestProgressRoot(element: HTMLElement) {
  return element.closest<HTMLElement>("aria-progress");
}

function progressRootIndicators(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-progress-indicator")).filter(
    (indicator) => nearestProgressRoot(indicator) === root,
  );
}

function syncProgressIndicator(indicator: HTMLElement, snapshot: ProgressSnapshot) {
  const percentage = ((snapshot.value - snapshot.min) / (snapshot.max - snapshot.min)) * 100;
  indicator.setAttribute("data-min", String(snapshot.min));
  indicator.setAttribute("data-max", String(snapshot.max));
  indicator.setAttribute("data-value", String(snapshot.value));
  indicator.style.setProperty("--progress-value", `${percentage}%`);
  indicator.style.width = "var(--progress-value)";
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

    for (const indicator of progressRootIndicators(root)) {
      syncProgressIndicator(indicator, snapshot);
    }
  } finally {
    syncingProgressRoots.delete(root);
  }
}

export function syncProgressPart(element: HTMLElement) {
  if (progressPartName(element) === "Root") {
    syncProgressRoot(element);
    return;
  }

  if (progressPartName(element) !== "Indicator") {
    return;
  }

  const root = nearestProgressRoot(element);
  if (!root) {
    throw new Error("Progress parts must be used within Progress.Root");
  }

  syncProgressRoot(root);
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
