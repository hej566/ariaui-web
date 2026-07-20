export function navigationMenuPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function navigationMenuRoot(element: Element | null) {
  return element?.closest<HTMLElement>("aria-navigation-menu") ?? null;
}

export function navigationMenuElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter((element) => navigationMenuRoot(element) === root);
}

export function navigationMenuList(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-navigation-menu-list"))
    .find((list) => navigationMenuRoot(list) === root) ?? null;
}

export function navigationMenuTopLevelItems(root: Element) {
  const list = navigationMenuList(root);
  if (!list) return [];
  return Array.from(list.children)
    .filter((element): element is HTMLElement => element instanceof HTMLElement && element.matches("aria-navigation-menu-item"));
}

export function navigationMenuItem(element: Element | null) {
  return element?.closest<HTMLElement>("aria-navigation-menu-item") ?? null;
}

export function navigationMenuItemTrigger(item: Element) {
  return Array.from(item.querySelectorAll<HTMLElement>("aria-navigation-menu-trigger"))
    .find((trigger) => navigationMenuItem(trigger) === item) ?? null;
}

export function navigationMenuItemContent(item: Element) {
  return Array.from(item.querySelectorAll<HTMLElement>("aria-navigation-menu-content"))
    .find((content) => navigationMenuItem(content) === item) ?? null;
}

export function navigationMenuTopLevelLink(item: Element) {
  return Array.from(item.querySelectorAll<HTMLElement>("aria-navigation-menu-link"))
    .find((link) => navigationMenuItem(link) === item && !navigationMenuContentWrapper(link)) ?? null;
}

export function navigationMenuEntries(root: Element) {
  return navigationMenuTopLevelItems(root)
    .map((item) => navigationMenuItemTrigger(item) ?? navigationMenuTopLevelLink(item))
    .filter((entry): entry is HTMLElement => Boolean(entry));
}

export function navigationMenuContentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) return content;
  return content.firstElementChild instanceof HTMLElement ? content.firstElementChild : content;
}

export function navigationMenuContentWrapper(element: Element | null) {
  return element?.closest<HTMLElement>("aria-navigation-menu-content, aria-navigation-menu-sub-content") ?? null;
}

export function navigationMenuContentItems(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>("aria-navigation-menu-link, aria-navigation-menu-sub-trigger"))
    .filter((item) => navigationMenuContentWrapper(item) === content);
}

export function navigationMenuEnabledContentItems(content: Element) {
  return navigationMenuContentItems(content)
    .filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true");
}

export function navigationMenuItemText(item: HTMLElement) {
  return (item.getAttribute("text-value") || item.getAttribute("textvalue") || item.textContent || "").trim().toLowerCase();
}

export function navigationMenuEntryValue(entry: HTMLElement) {
  const item = navigationMenuItem(entry);
  return item?.getAttribute("value")
    || entry.textContent?.trim().toLowerCase().replace(/\s+/g, "-")
    || "";
}

export function navigationMenuSub(element: Element | null) {
  return element?.closest<HTMLElement>("aria-navigation-menu-sub") ?? null;
}

export function navigationMenuSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-navigation-menu-sub-trigger"))
    .find((trigger) => navigationMenuSub(trigger) === sub) ?? null;
}

export function navigationMenuSubContent(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-navigation-menu-sub-content"))
    .find((content) => navigationMenuSub(content) === sub) ?? null;
}

export function navigationMenuOwningTrigger(content: Element) {
  const item = navigationMenuItem(content);
  return item ? navigationMenuItemTrigger(item) : null;
}

export function ensureNavigationMenuId(element: HTMLElement, prefix: string, nextId: () => number) {
  if (!element.id) element.id = `ariaui-navigation-menu-${prefix}-${nextId()}`;
  return element.id;
}
