import {
  alertElements,
  alertRoot,
  isAlertRootElement,
  syncAlertCompositionHost,
} from "./alert-dom";

type AlertSyncState = {
  controlledOpen: boolean;
  defaultOpenApplied: boolean;
};

const alertSyncStates = new WeakMap<Element, AlertSyncState>();
let alertId = 0;

function getAlertSyncState(root: Element) {
  let state = alertSyncStates.get(root);
  if (!state) {
    state = { controlledOpen: false, defaultOpenApplied: false };
    alertSyncStates.set(root, state);
  }
  return state;
}

function isFalseAttributeValue(value: string | null) {
  return value === "false";
}

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export function isAlertControlledOpen(root: Element) {
  return getAlertSyncState(root).controlledOpen;
}

export function syncAlertTreeAround(element: HTMLElement) {
  const root = element.matches("aria-alert") ? element : alertRoot(element);
  if (isAlertRootElement(root)) {
    root.syncAlertTreeFromRoot();
  }
}

export function syncAlertTreeFromRoot(root: HTMLElement) {
  const state = getAlertSyncState(root);

  if (!state.defaultOpenApplied) {
    state.controlledOpen = root.hasAttribute("open");
    state.defaultOpenApplied = true;

    if (!state.controlledOpen && !isFalseAttributeValue(root.getAttribute("default-open")) && !isFalseAttributeValue(root.getAttribute("defaultopen"))) {
      root.setAttribute("open", "");
    }
  }

  const titlePart = alertElements(root, "aria-alert-title")[0];
  const descriptionPart = alertElements(root, "aria-alert-description")[0];
  const title = titlePart ? syncAlertCompositionHost(titlePart) : null;
  const description = descriptionPart ? syncAlertCompositionHost(descriptionPart) : null;

  if (title) {
    if (!title.id) {
      title.id = "ariaui-alert-" + ++alertId + "-title";
    }
    if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
      title.setAttribute("aria-level", "5");
    }
    root.setAttribute("aria-labelledby", title.id);
  } else {
    root.removeAttribute("aria-labelledby");
  }

  if (description) {
    if (!description.id) {
      description.id = "ariaui-alert-" + ++alertId + "-description";
    }
    root.setAttribute("aria-describedby", description.id);
  } else {
    root.removeAttribute("aria-describedby");
  }

  for (const action of alertElements(root, "aria-alert-action")) {
    const actionHost = syncAlertCompositionHost(action);
    action.setAttribute("data-alert-action", "");
    actionHost.setAttribute("data-alert-action", "");
  }

  for (const close of alertElements(root, "aria-alert-close")) {
    const closeHost = syncAlertCompositionHost(close);
    close.setAttribute("data-alert-close", "");
    closeHost.setAttribute("data-alert-close", "");
  }

  for (const cancel of alertElements(root, "aria-alert-cancel")) {
    const cancelHost = syncAlertCompositionHost(cancel);
    cancel.setAttribute("data-alert-cancel", "");
    cancelHost.setAttribute("data-alert-cancel", "");
  }

  const isOpen = root.hasAttribute("open");
  root.hidden = !isOpen;
  root.setAttribute("aria-hidden", String(!isOpen));
  root.setAttribute("data-state", isOpen ? "open" : "closed");
  if (root.hasAttribute("dismissible")) {
    root.setAttribute("data-dismissible", "");
  } else {
    root.removeAttribute("data-dismissible");
  }

  const rootHost = syncAlertCompositionHost(root);
  if (rootHost !== root) {
    rootHost.hidden = !isOpen;
    rootHost.setAttribute("aria-hidden", String(!isOpen));
    rootHost.setAttribute("data-state", isOpen ? "open" : "closed");
    if (root.hasAttribute("dismissible")) {
      rootHost.setAttribute("data-dismissible", "");
    } else {
      rootHost.removeAttribute("data-dismissible");
    }
  }
}

export { setBooleanAttribute as setAlertBooleanAttribute };
