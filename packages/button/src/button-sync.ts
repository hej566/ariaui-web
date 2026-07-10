import { buttonGroupItems, buttonIsDisabled, buttonIsLinkMode, buttonPartName, nearestButtonGroup } from "./button-dom";

type ButtonSyncState = {
  appliedRole: string | null;
  appliedTabIndex: string | null;
  appliedType: string | null;
  storedHref: string | null;
  observer: MutationObserver | null;
  syncing: boolean;
};

const buttonSyncStates = new WeakMap<HTMLElement, ButtonSyncState>();

function buttonSyncState(element: HTMLElement) {
  let state = buttonSyncStates.get(element);
  if (!state) {
    state = {
      appliedRole: null,
      appliedTabIndex: null,
      appliedType: null,
      storedHref: null,
      observer: null,
      syncing: false,
    };
    buttonSyncStates.set(element, state);
  }

  return state;
}

export function syncButtonPart(element: HTMLElement) {
  const state = buttonSyncState(element);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    const partName = buttonPartName(element);
    if (partName === "Group") {
      observeButtonGroup(element);
      syncButtonItemPositions(element);
      return;
    }

    syncButtonHost(element);

    if (partName === "Item") {
      const group = nearestButtonGroup(element);
      if (group) {
        observeButtonGroup(group);
        syncButtonItemPositions(group);
      } else {
        element.removeAttribute("data-position");
      }
    }
  } finally {
    state.syncing = false;
  }
}

export function disconnectButtonPart(element: HTMLElement) {
  buttonSyncState(element).observer?.disconnect();
}

function syncButtonHost(element: HTMLElement) {
  const state = buttonSyncState(element);
  const disabled = buttonIsDisabled(element);

  if (element.getAttribute("as") === "a") {
    syncButtonHref(element, state, disabled);
  }

  const linkMode = buttonIsLinkMode(element);
  const desiredRole = linkMode ? "link" : "button";

  syncDefaultRole(element, desiredRole, state);
  syncButtonType(element, state, linkMode);
  syncDefaultTabIndex(element, state, disabled ? null : "0");

  element.removeAttribute("aria-expanded");
  element.removeAttribute("data-state");
}

function syncButtonHref(element: HTMLElement, state: ButtonSyncState, disabled: boolean) {
  const currentHref = element.getAttribute("href");
  if (!disabled) {
    if (currentHref) {
      state.storedHref = currentHref;
    } else if (state.storedHref) {
      element.setAttribute("href", state.storedHref);
    }
    return;
  }

  if (currentHref) {
    state.storedHref = currentHref;
    element.removeAttribute("href");
  }
}

function syncButtonType(element: HTMLElement, state: ButtonSyncState, linkMode: boolean) {
  const currentType = element.getAttribute("type");

  if (linkMode) {
    if (state.appliedType && currentType === state.appliedType) {
      element.removeAttribute("type");
    }
    state.appliedType = null;
    return;
  }

  if (!currentType || currentType === state.appliedType) {
    state.appliedType = "button";
    if (currentType !== "button") {
      element.setAttribute("type", "button");
    }
    return;
  }

  if (currentType !== "button") {
    state.appliedType = null;
  }
}

function syncDefaultRole(element: HTMLElement, role: string, state: ButtonSyncState) {
  const currentRole = element.getAttribute("role");

  if (!currentRole || currentRole === state.appliedRole || (state.appliedRole === null && currentRole === "button")) {
    state.appliedRole = role;
    if (currentRole !== role) {
      element.setAttribute("role", role);
    }
    return;
  }

  if (currentRole !== role) {
    state.appliedRole = null;
  }
}

function syncDefaultTabIndex(element: HTMLElement, state: ButtonSyncState, tabIndex: string | null) {
  const currentTabIndex = element.getAttribute("tabindex");

  if (!tabIndex) {
    if (currentTabIndex === state.appliedTabIndex || currentTabIndex === "0" || currentTabIndex === "-1") {
      element.removeAttribute("tabindex");
    }
    state.appliedTabIndex = null;
    return;
  }

  if (!currentTabIndex || currentTabIndex === state.appliedTabIndex) {
    state.appliedTabIndex = tabIndex;
    if (currentTabIndex !== tabIndex) {
      element.setAttribute("tabindex", tabIndex);
    }
    return;
  }

  if (currentTabIndex !== tabIndex) {
    state.appliedTabIndex = null;
  }
}

function observeButtonGroup(group: HTMLElement) {
  const state = buttonSyncState(group);
  if (state.observer) {
    return;
  }

  state.observer = new MutationObserver(() => {
    syncButtonItemPositions(group);
  });
  state.observer.observe(group, {
    childList: true,
    subtree: true,
  });
}

export function syncButtonItemPositions(group: HTMLElement) {
  const items = buttonGroupItems(group);
  for (const [index, item] of items.entries()) {
    const position = items.length === 1
      ? "only"
      : index === 0
        ? "first"
        : index === items.length - 1
          ? "last"
          : "middle";
    item.setAttribute("data-position", position);
  }
}
