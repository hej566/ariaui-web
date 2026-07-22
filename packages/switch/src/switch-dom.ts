export function switchPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName;
}

export function isSwitchRoot(element: Element | null) {
  return element?.localName === "aria-switch";
}

export function switchRoot(element: HTMLElement) {
  if (isSwitchRoot(element)) return element;
  const root = element.closest("aria-switch");
  return isSwitchRoot(root) ? root as HTMLElement : null;
}

export function switchParts(root: HTMLElement, tagName: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(tagName)).filter(
    (part) => switchRoot(part) === root,
  );
}
