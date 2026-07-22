export function tabsPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function isTabsRoot(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches("aria-tabs");
}

export function tabsRoot(element: Element | null) {
  return element?.closest<HTMLElement>("aria-tabs") ?? null;
}

export function tabsElements(root: HTMLElement, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => tabsRoot(element) === root,
  );
}

export function tabsTriggers(root: HTMLElement) {
  return tabsElements(root, "aria-tabs-trigger");
}

export function tabsContents(root: HTMLElement) {
  return tabsElements(root, "aria-tabs-content").filter((content) => {
    const panel = content.closest("aria-tabs-panel");
    return panel != null && tabsRoot(panel) === root;
  });
}

export function tabsTriggerDisabled(trigger: HTMLElement, root = tabsRoot(trigger)) {
  return trigger.hasAttribute("disabled") || Boolean(root?.hasAttribute("disabled"));
}

export function tabsNativeTarget(element: HTMLElement) {
  if (!element.hasAttribute("native-composition")) return element;
  return element.firstElementChild instanceof HTMLElement ? element.firstElementChild : element;
}
