import {
  alertRoot,
} from "./alert-dom";
import {
  isAlertControlledOpen,
  setAlertBooleanAttribute,
} from "./alert-sync";

type AlertDismissRootElement = HTMLElement & {
  requestAlertDismiss: (source: Element) => boolean;
  syncAlertTreeFromRoot: () => void;
};

function isAlertDismissRootElement(element: Element | null): element is AlertDismissRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDismissRootElement>).requestAlertDismiss === "function"
    && typeof (element as Partial<AlertDismissRootElement>).syncAlertTreeFromRoot === "function";
}

export function requestAlertDismiss(root: HTMLElement, source: Element) {
  if (!root.hasAttribute("dismissible")) {
    return false;
  }

  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: {
      open: false,
      source,
    },
  }));

  if (isAlertControlledOpen(root)) {
    return true;
  }

  setAlertBooleanAttribute(root, "open", false);
  if (isAlertDismissRootElement(root)) {
    root.syncAlertTreeFromRoot();
  }
  return true;
}

export function requestAlertDismissFromPart(part: HTMLElement, event: MouseEvent) {
  const root = alertRoot(part);
  if (!isAlertDismissRootElement(root)) {
    return;
  }

  queueMicrotask(() => {
    if (!event.defaultPrevented) {
      root.requestAlertDismiss(part);
    }
  });
}
