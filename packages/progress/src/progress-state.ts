export interface ProgressSnapshot {
  max: number;
  min: number;
  value: number;
  valueText: string | null;
}

type ProgressRootState = {
  currentValue: number;
  initialized: boolean;
};

const progressRootStates = new WeakMap<HTMLElement, ProgressRootState>();

function progressRootState(root: HTMLElement) {
  let state = progressRootStates.get(root);

  if (!state) {
    state = { currentValue: 0, initialized: false };
    progressRootStates.set(root, state);
  }

  return state;
}

function finiteNumber(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function aliasedAttribute(element: HTMLElement, names: readonly string[]) {
  for (const name of names) {
    if (element.hasAttribute(name)) {
      return element.getAttribute(name);
    }
  }

  return null;
}

export function getProgressSnapshot(root: HTMLElement): ProgressSnapshot {
  const state = progressRootState(root);
  const min = finiteNumber(root.getAttribute("min"), 0);
  const max = finiteNumber(root.getAttribute("max"), 100);

  if (root.hasAttribute("value")) {
    state.currentValue = finiteNumber(root.getAttribute("value"), 0);
    state.initialized = true;
  } else if (!state.initialized) {
    state.currentValue = finiteNumber(aliasedAttribute(root, ["default-value", "defaultvalue"]), 0);
    state.initialized = true;
  }

  return {
    max,
    min,
    value: state.currentValue,
    valueText: aliasedAttribute(root, ["value-text", "valuetext"]),
  };
}
