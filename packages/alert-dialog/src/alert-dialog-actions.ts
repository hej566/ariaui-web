import {
  alertDialogContent,
  alertDialogElements,
  alertDialogElementsInContent,
  alertDialogRoot,
} from "./alert-dialog-dom";
import {
  isAlertDialogControlledOpen,
  setAlertDialogBooleanAttribute,
} from "./alert-dialog-sync";

type AlertDialogActionState = {
  lastTrigger: HTMLElement | null;
};

type AlertDialogActionRootElement = HTMLElement & {
  syncAlertDialogTreeFromRoot: () => void;
  requestAlertDialogOpen: (source: Element) => boolean;
  requestAlertDialogClose: (source?: Element) => boolean;
  focusInitialAlertDialogTarget: () => void;
  restoreAlertDialogFocus: (content: HTMLElement | null) => void;
};

const alertDialogActionStates = new WeakMap<Element, AlertDialogActionState>();

function getAlertDialogActionState(root: Element) {
  let state = alertDialogActionStates.get(root);
  if (!state) {
    state = { lastTrigger: null };
    alertDialogActionStates.set(root, state);
  }
  return state;
}

function canRestoreFocusTo(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected || element.hasAttribute("disabled")) {
    return false;
  }

  if ("disabled" in element && Boolean((element as HTMLButtonElement).disabled)) {
    return false;
  }

  return true;
}

function isAlertDialogActionRootElement(element: Element | null): element is AlertDialogActionRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDialogActionRootElement>).syncAlertDialogTreeFromRoot === "function"
    && typeof (element as Partial<AlertDialogActionRootElement>).requestAlertDialogOpen === "function"
    && typeof (element as Partial<AlertDialogActionRootElement>).requestAlertDialogClose === "function";
}

export function alertDialogFocusableElements(container: Element) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      "aria-alert-dialog-cancel, aria-alert-dialog-action, button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    ),
  ).filter((element) => {
    return !element.hidden && !element.hasAttribute("disabled") && (!(element as HTMLButtonElement).disabled);
  });
}

export function trapAlertDialogFocus(content: HTMLElement, event: KeyboardEvent) {
  const focusableElements = alertDialogFocusableElements(content);
  if (focusableElements.length === 0) {
    return;
  }

  const activeElement = content.ownerDocument.activeElement as HTMLElement | null;
  const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
  const nextIndex = event.shiftKey
    ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
    : (currentIndex === -1 || currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);

  event.preventDefault();
  focusableElements[nextIndex]?.focus();
}

export function requestAlertDialogOpen(root: HTMLElement, source: Element) {
  getAlertDialogActionState(root).lastTrigger = source instanceof HTMLElement ? source : null;
  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: {
      open: true,
      source,
    },
  }));

  if (isAlertDialogControlledOpen(root)) {
    return true;
  }

  setAlertDialogBooleanAttribute(root, "open", true);
  if (isAlertDialogActionRootElement(root)) {
    root.syncAlertDialogTreeFromRoot();
    root.focusInitialAlertDialogTarget();
  }
  return true;
}

export function requestAlertDialogClose(root: HTMLElement, source: Element = root) {
  const content = alertDialogContent(root);
  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: {
      open: false,
      source,
    },
  }));

  if (isAlertDialogControlledOpen(root)) {
    return true;
  }

  setAlertDialogBooleanAttribute(root, "open", false);
  if (isAlertDialogActionRootElement(root)) {
    root.syncAlertDialogTreeFromRoot();
    root.restoreAlertDialogFocus(content);
  }
  return true;
}

export function focusInitialAlertDialogTarget(root: HTMLElement) {
  const content = alertDialogContent(root);
  if (!content) {
    return;
  }

  const event = new CustomEvent("openautofocus", { bubbles: true, cancelable: true });
  content.dispatchEvent(event);
  if (event.defaultPrevented) {
    return;
  }

  const target = alertDialogElementsInContent(content, "aria-alert-dialog-cancel")[0]
    ?? alertDialogFocusableElements(content)[0]
    ?? content;
  target.focus({ preventScroll: true });
}

export function restoreAlertDialogFocus(root: HTMLElement, content: HTMLElement | null) {
  if (content) {
    const event = new CustomEvent("closeautofocus", { bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }
  }

  const trigger = getAlertDialogActionState(root).lastTrigger ?? alertDialogElements(root, "aria-alert-dialog-trigger")[0] ?? null;
  if (canRestoreFocusTo(trigger)) {
    trigger.focus({ preventScroll: true });
    return;
  }

  if (!document.body.hasAttribute("tabindex")) {
    document.body.setAttribute("tabindex", "-1");
  }
  document.body.focus({ preventScroll: true });
}

export function requestAlertDialogOpenFromPart(part: HTMLElement, event: MouseEvent) {
  const root = alertDialogRoot(part);
  if (!isAlertDialogActionRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (!event.defaultPrevented) {
      root.requestAlertDialogOpen(part);
    }
  });
}

export function requestAlertDialogCloseFromPart(part: HTMLElement, event: MouseEvent) {
  const root = alertDialogRoot(part);
  if (!isAlertDialogActionRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (!event.defaultPrevented) {
      root.requestAlertDialogClose(part);
    }
  });
}

export function handleAlertDialogContentKeyDown(content: HTMLElement, event: KeyboardEvent) {
  if (event.key === "Tab" && content.getAttribute("role") === "alertdialog") {
    trapAlertDialogFocus(content, event);
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  const root = alertDialogRoot(content);
  if (!isAlertDialogActionRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (event.defaultPrevented) {
      return;
    }

    const escapeEvent = new CustomEvent("escapekeydown", {
      bubbles: true,
      cancelable: true,
      detail: {
        originalEvent: event,
      },
    });
    content.dispatchEvent(escapeEvent);

    if (escapeEvent.defaultPrevented) {
      return;
    }

    event.preventDefault();
    root.requestAlertDialogClose(content);
  });
}
