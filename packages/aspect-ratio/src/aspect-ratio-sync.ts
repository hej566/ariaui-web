import {
  applyAspectRatioFillStyles,
  applyAspectRatioShellStyles,
  ensureAspectRatioInternalFill,
  firstAspectRatioFillHost,
  moveChildrenIntoAspectRatioFill,
  removeAspectRatioInternalFill,
} from "./aspect-ratio-dom";
import { resolveAspectRatio } from "./aspect-ratio-values";

type AspectRatioSyncState = {
  fillElement: HTMLElement | null;
  observer: MutationObserver | null;
  syncing: boolean;
};

const aspectRatioSyncStates = new WeakMap<HTMLElement, AspectRatioSyncState>();

function aspectRatioSyncState(element: HTMLElement) {
  let state = aspectRatioSyncStates.get(element);
  if (!state) {
    state = {
      fillElement: null,
      observer: null,
      syncing: false,
    };
    aspectRatioSyncStates.set(element, state);
  }

  return state;
}

export function observeAspectRatioChildren(element: HTMLElement) {
  const state = aspectRatioSyncState(element);
  if (typeof MutationObserver === "undefined" || state.observer) {
    return;
  }

  state.observer = new MutationObserver(() => {
    if (!state.syncing) {
      syncAspectRatioLayout(element);
    }
  });
  state.observer.observe(element, { childList: true });
}

export function disconnectAspectRatioObserver(element: HTMLElement) {
  const state = aspectRatioSyncState(element);
  state.observer?.disconnect();
  state.observer = null;
}

export function syncAspectRatioLayout(element: HTMLElement) {
  const state = aspectRatioSyncState(element);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    applyAspectRatioShellStyles(element, resolveAspectRatio(element.getAttribute("ratio") ?? undefined));

    if (element.hasAttribute("native-composition")) {
      state.fillElement = removeAspectRatioInternalFill(element, state.fillElement);
      const fillHost = firstAspectRatioFillHost(element, state.fillElement);
      if (fillHost) {
        applyAspectRatioFillStyles(fillHost);
      }
      return;
    }

    const fill = ensureAspectRatioInternalFill(element, state.fillElement);
    state.fillElement = fill;
    moveChildrenIntoAspectRatioFill(element, fill);
    applyAspectRatioFillStyles(fill);
  } finally {
    state.syncing = false;
  }
}
