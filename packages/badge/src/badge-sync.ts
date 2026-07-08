import {
  badgeInteractiveRole,
  badgePreservedDataAttributes,
  isPreservedBadgeDataAttribute,
} from "./badge-dom";

type BadgeSyncState = {
  appliedRole: string | null;
  appliedTabIndex: string | null;
  applyingBaseContract: boolean;
  restoringDataAttribute: boolean;
  consumerDataAttributes: Map<string, string>;
};

const badgeSyncStates = new WeakMap<HTMLElement, BadgeSyncState>();

function badgeSyncState(element: HTMLElement) {
  let state = badgeSyncStates.get(element);
  if (!state) {
    state = {
      appliedRole: null,
      appliedTabIndex: null,
      applyingBaseContract: false,
      restoringDataAttribute: false,
      consumerDataAttributes: new Map<string, string>(),
    };
    badgeSyncStates.set(element, state);
  }

  return state;
}

export function beginBadgeBaseContract(element: HTMLElement) {
  badgeSyncState(element).applyingBaseContract = true;
}

export function endBadgeBaseContract(element: HTMLElement) {
  badgeSyncState(element).applyingBaseContract = false;
}

export function isBadgeInternalDataAttributeChange(element: HTMLElement, name: string) {
  if (!isPreservedBadgeDataAttribute(name)) {
    return false;
  }

  const state = badgeSyncState(element);
  return state.applyingBaseContract || state.restoringDataAttribute;
}

export function captureBadgeConsumerDataAttributes(element: HTMLElement) {
  const state = badgeSyncState(element);
  for (const attribute of badgePreservedDataAttributes) {
    const value = element.getAttribute(attribute);
    if (value != null) {
      state.consumerDataAttributes.set(attribute, value);
    }
  }
}

export function trackBadgeConsumerDataAttribute(element: HTMLElement, name: string, value: string | null) {
  if (!isPreservedBadgeDataAttribute(name)) {
    return;
  }

  const state = badgeSyncState(element);
  if (value == null) {
    state.consumerDataAttributes.delete(name);
  } else {
    state.consumerDataAttributes.set(name, value);
  }
}

export function restoreBadgeConsumerDataAttributes(element: HTMLElement) {
  const state = badgeSyncState(element);
  if (state.consumerDataAttributes.size === 0) {
    return;
  }

  state.restoringDataAttribute = true;
  try {
    for (const [attribute, value] of state.consumerDataAttributes) {
      if (element.getAttribute(attribute) !== value) {
        element.setAttribute(attribute, value);
      }
    }
  } finally {
    state.restoringDataAttribute = false;
  }
}

export function syncBadgeInteractiveSemantics(element: HTMLElement) {
  const role = badgeInteractiveRole(element.getAttribute("as"));
  syncDefaultRole(element, role);
  syncDefaultTabIndex(element, role ? "0" : null);
}

function syncDefaultRole(element: HTMLElement, role: string | null) {
  const state = badgeSyncState(element);
  const currentRole = element.getAttribute("role");

  if (!role) {
    if (state.appliedRole && currentRole === state.appliedRole) {
      state.appliedRole = null;
      element.removeAttribute("role");
    }
    state.appliedRole = null;
    return;
  }

  if (!currentRole || currentRole === state.appliedRole) {
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

function syncDefaultTabIndex(element: HTMLElement, tabIndex: string | null) {
  const state = badgeSyncState(element);
  const currentTabIndex = element.getAttribute("tabindex");

  if (!tabIndex) {
    if (state.appliedTabIndex && currentTabIndex === state.appliedTabIndex) {
      state.appliedTabIndex = null;
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
