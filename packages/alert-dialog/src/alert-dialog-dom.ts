export type AlertDialogRootElement = HTMLElement & {
  syncAlertDialogTreeFromRoot: () => void;
};

export function isAlertDialogRootElement(element: Element | null): element is AlertDialogRootElement {
  return element instanceof HTMLElement
    && typeof (element as Partial<AlertDialogRootElement>).syncAlertDialogTreeFromRoot === "function";
}

export function alertDialogRoot(element: Element) {
  return element.closest("aria-alert-dialog");
}

export function alertDialogElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog") === root);
}

export function alertDialogContent(root: Element) {
  return alertDialogElements(root, "aria-alert-dialog-content")[0] ?? null;
}

export function alertDialogElementsInContent(content: Element, selector: string) {
  return Array.from(content.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-alert-dialog-content") === content);
}
