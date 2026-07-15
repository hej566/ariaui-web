const decreaseSelector = '[data-progress-action="decrease"]';
const increaseSelector = '[data-progress-action="increase"]';
const controlledExampleSelector = '[data-progress-example="controlled"]';

const installedProgressRoots = new WeakSet<ParentNode>();
const progressObservers = new WeakMap<ParentNode, MutationObserver>();
const syncingProgressRoots = new WeakSet<ParentNode>();

function clampProgressValue(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function progressRootFromExample(example: ParentNode) {
  return example.querySelector<HTMLElement>("aria-progress");
}

function progressValueFromRoot(root: HTMLElement) {
  return clampProgressValue(Number(root.getAttribute("value") ?? root.getAttribute("default-value") ?? 0));
}

function setProgressExampleValue(example: ParentNode, value: number) {
  const progress = progressRootFromExample(example);
  const valueLabel = example.querySelector<HTMLElement>("[data-progress-value]");

  if (!progress) {
    return;
  }

  const nextValue = clampProgressValue(value);
  const nextValueText = String(nextValue) + "% complete";

  progress.setAttribute("value", String(nextValue));
  progress.setAttribute("value-text", nextValueText);
  valueLabel && (valueLabel.textContent = String(nextValue) + "%");
}

function syncProgressExample(example: ParentNode) {
  const progress = progressRootFromExample(example);

  if (!progress) {
    return;
  }

  setProgressExampleValue(example, progressValueFromRoot(progress));
}

export function syncProgressExamples(root: ParentNode = document) {
  if (syncingProgressRoots.has(root)) {
    return;
  }

  syncingProgressRoots.add(root);
  try {
    root.querySelectorAll(controlledExampleSelector).forEach((example) => {
      syncProgressExample(example);
    });
  } finally {
    syncingProgressRoots.delete(root);
  }
}

function handleProgressExampleClick(event: Event) {
  const target = event.target instanceof Element ? event.target : null;
  const control = target?.closest<HTMLElement>(decreaseSelector + ", " + increaseSelector);
  const example = control?.closest(controlledExampleSelector);

  if (!control || !example) {
    return;
  }

  const progress = progressRootFromExample(example);
  const currentValue = progress ? progressValueFromRoot(progress) : 0;
  const delta = control.matches(decreaseSelector) ? -10 : 10;

  setProgressExampleValue(example, currentValue + delta);
}

function observableProgressNode(root: ParentNode) {
  if (root instanceof Document) {
    return root.documentElement;
  }

  return root instanceof Node ? root : null;
}

export function installProgressExamples(root: ParentNode = document) {
  if (!installedProgressRoots.has(root)) {
    installedProgressRoots.add(root);

    if ("addEventListener" in root) {
      root.addEventListener("click", handleProgressExampleClick);
    }

    const observableNode = observableProgressNode(root);
    if (observableNode) {
      const observer = new MutationObserver(() => {
        syncProgressExamples(root);
      });
      observer.observe(observableNode, {
        attributes: true,
        attributeFilter: ["value"],
        childList: true,
        subtree: true,
      });
      progressObservers.set(root, observer);
    }
  }

  syncProgressExamples(root);
}
