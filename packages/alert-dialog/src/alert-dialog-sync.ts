import {
  alertDialogContent,
  alertDialogElements,
  alertDialogElementsInContent,
  alertDialogRoot,
  isAlertDialogRootElement,
} from "./alert-dialog-dom";

type AlertDialogSyncState = {
  controlledOpen: boolean;
  defaultOpenApplied: boolean;
  inertedElements: Set<HTMLElement>;
  scrollLocked: boolean;
};

type AlertDialogFocusRootElement = HTMLElement & {
  focusInitialAlertDialogTarget: () => void;
};

const alertDialogSyncStates = new WeakMap<Element, AlertDialogSyncState>();
const inertCounts = new WeakMap<HTMLElement, number>();
let alertDialogId = 0;
let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

function getAlertDialogSyncState(root: Element) {
  let state = alertDialogSyncStates.get(root);
  if (!state) {
    state = {
      controlledOpen: false,
      defaultOpenApplied: false,
      inertedElements: new Set<HTMLElement>(),
      scrollLocked: false,
    };
    alertDialogSyncStates.set(root, state);
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

function isAlertDialogFocusRootElement(element: Element | null): element is AlertDialogFocusRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDialogFocusRootElement>).focusInitialAlertDialogTarget === "function";
}

function preventBackgroundWheel(event: WheelEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest("aria-alert-dialog-content[role='alertdialog']")) {
    return;
  }

  event.preventDefault();
}

function lockViewportScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.addEventListener("wheel", preventBackgroundWheel, { passive: false });
  }

  scrollLockCount += 1;
}

function unlockViewportScroll() {
  if (scrollLockCount <= 0) {
    scrollLockCount = 0;
    return;
  }

  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
    document.body.removeEventListener("wheel", preventBackgroundWheel);
  }
}

export function isAlertDialogControlledOpen(root: Element) {
  return getAlertDialogSyncState(root).controlledOpen;
}

export function syncAlertDialogTreeAround(element: HTMLElement) {
  const root = element.matches("aria-alert-dialog") ? element : alertDialogRoot(element);
  if (isAlertDialogRootElement(root)) {
    root.syncAlertDialogTreeFromRoot();
  }
}

export function syncAlertDialogTreeFromRoot(root: HTMLElement) {
  const syncState = getAlertDialogSyncState(root);
  let shouldFocusDefaultOpen = false;

  if (!syncState.defaultOpenApplied) {
    syncState.controlledOpen = root.hasAttribute("open");
    syncState.defaultOpenApplied = true;

    const defaultOpen = root.getAttribute("default-open") ?? root.getAttribute("defaultopen");
    if (!syncState.controlledOpen && defaultOpen != null && !isFalseAttributeValue(defaultOpen)) {
      root.setAttribute("open", "");
      shouldFocusDefaultOpen = true;
    }
  }

  const isOpen = root.hasAttribute("open");
  const state = isOpen ? "open" : "closed";
  root.setAttribute("data-state", state);

  const content = alertDialogContent(root);
  const triggers = alertDialogElements(root, "aria-alert-dialog-trigger");
  const overlays = alertDialogElements(root, "aria-alert-dialog-overlay");
  const portals = alertDialogElements(root, "aria-alert-dialog-portal");
  const icons = alertDialogElements(root, "aria-alert-dialog-icon");
  const cancels = alertDialogElements(root, "aria-alert-dialog-cancel");

  if (content && !content.id) {
    content.id = "ariaui-alert-dialog-" + ++alertDialogId + "-content";
  }

  for (const trigger of triggers) {
    setBooleanAttribute(trigger, "open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("data-state", state);
  }

  for (const icon of icons) {
    icon.setAttribute("aria-hidden", "true");
  }

  for (const cancel of cancels) {
    cancel.setAttribute("data-alert-dialog-cancel", "");
  }

  if (content) {
    syncAlertDialogContent(content, isOpen, state);
  }

  for (const overlay of overlays) {
    overlay.setAttribute("data-state", state);
    overlay.hidden = !isOpen && !overlay.hasAttribute("force-mount");
  }

  for (const portal of portals) {
    portal.setAttribute("data-state", state);
    portal.hidden = !isOpen && !portal.hasAttribute("force-mount");
  }

  if (isOpen) {
    claimAlertDialogModalEffects(root);
  } else {
    releaseAlertDialogModalEffects(root);
  }

  if (shouldFocusDefaultOpen) {
    queueMicrotask(() => {
      if (isAlertDialogFocusRootElement(root) && root.isConnected && root.hasAttribute("open")) {
        root.focusInitialAlertDialogTarget();
      }
    });
  }
}

export function syncAlertDialogContent(content: HTMLElement, isOpen: boolean, state: string) {
  content.setAttribute("data-alert-dialog-content", "");

  const titles = alertDialogElementsInContent(content, "aria-alert-dialog-title");
  const descriptions = alertDialogElementsInContent(content, "aria-alert-dialog-description");

  for (const title of titles) {
    if (!title.id) {
      title.id = "ariaui-alert-dialog-" + ++alertDialogId + "-title";
    }
    if (title.getAttribute("role") === "heading" && !title.hasAttribute("aria-level")) {
      title.setAttribute("aria-level", "2");
    }
  }

  for (const description of descriptions) {
    if (!description.id) {
      description.id = "ariaui-alert-dialog-" + ++alertDialogId + "-description";
    }
  }

  if (isOpen) {
    content.setAttribute("role", "alertdialog");
    content.setAttribute("aria-modal", "true");
    content.setAttribute("tabindex", "-1");
    content.removeAttribute("aria-hidden");

    if (titles.length > 0) {
      content.setAttribute("aria-labelledby", titles.map((title) => title.id).join(" "));
    } else {
      content.removeAttribute("aria-labelledby");
    }

    if (descriptions.length > 0) {
      content.setAttribute("aria-describedby", descriptions.map((description) => description.id).join(" "));
    } else {
      content.removeAttribute("aria-describedby");
    }
  } else {
    content.removeAttribute("role");
    content.removeAttribute("aria-modal");
    content.removeAttribute("tabindex");
    content.removeAttribute("aria-labelledby");
    content.removeAttribute("aria-describedby");
    content.setAttribute("aria-hidden", "true");
  }

  content.hidden = !isOpen;
  content.setAttribute("data-state", state);
}

export function claimAlertDialogModalEffects(root: HTMLElement) {
  const syncState = getAlertDialogSyncState(root);
  if (syncState.scrollLocked) {
    return;
  }

  const parent = root.parentElement;
  if (parent) {
    for (const sibling of Array.from(parent.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === root || sibling.matches("aria-alert-dialog")) {
        continue;
      }

      const count = inertCounts.get(sibling) ?? 0;
      inertCounts.set(sibling, count + 1);
      sibling.setAttribute("inert", "");
      syncState.inertedElements.add(sibling);
    }
  }

  lockViewportScroll();
  syncState.scrollLocked = true;
}

export function releaseAlertDialogModalEffects(root: HTMLElement) {
  const syncState = getAlertDialogSyncState(root);
  for (const element of syncState.inertedElements) {
    const count = (inertCounts.get(element) ?? 1) - 1;
    if (count <= 0) {
      inertCounts.delete(element);
      element.removeAttribute("inert");
    } else {
      inertCounts.set(element, count);
    }
  }
  syncState.inertedElements.clear();

  if (syncState.scrollLocked) {
    unlockViewportScroll();
    syncState.scrollLocked = false;
  }
}

export { setBooleanAttribute as setAlertDialogBooleanAttribute };
