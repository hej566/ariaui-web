export function buttonPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function buttonIsDisabled(element: HTMLElement) {
  return element.hasAttribute("disabled");
}

export function buttonIsLinkMode(element: HTMLElement) {
  return element.getAttribute("as") === "a" && element.hasAttribute("href") && !buttonIsDisabled(element);
}

export function nearestButtonGroup(element: Element) {
  return element.closest("aria-button-group") as HTMLElement | null;
}

export function buttonGroupItems(group: HTMLElement) {
  return Array.from(group.querySelectorAll<HTMLElement>("aria-button-item")).filter((item) => nearestButtonGroup(item) === group);
}
