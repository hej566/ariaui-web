export function menubarPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function menubarRoot(element: Element | null) {
  return element?.closest<HTMLElement>("aria-menubar") ?? null;
}

export function menubarElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter((element) => menubarRoot(element) === root);
}

export function menubarMenus(root: Element) {
  return menubarElements(root, "aria-menubar-menu");
}

export function menubarMenu(element: Element | null) {
  return element?.closest<HTMLElement>("aria-menubar-menu") ?? null;
}

export function menubarMenuTrigger(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-menubar-trigger"))
    .find((trigger) => menubarMenu(trigger) === menu) ?? null;
}

export function menubarMenuContent(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-menubar-content"))
    .find((content) => menubarMenu(content) === menu) ?? null;
}

export function menubarTriggers(root: Element) {
  return menubarMenus(root)
    .map(menubarMenuTrigger)
    .filter((trigger): trigger is HTMLElement => Boolean(trigger));
}

export function menubarContentHost(content: HTMLElement) {
  if (!content.hasAttribute("native-composition")) return content;
  return content.firstElementChild instanceof HTMLElement ? content.firstElementChild : content;
}

export function menubarSub(element: Element | null) {
  return element?.closest<HTMLElement>("aria-menubar-sub") ?? null;
}

export function menubarSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-menubar-sub-trigger"))
    .find((trigger) => menubarSub(trigger) === sub) ?? null;
}

export function menubarSubContent(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-menubar-sub-content"))
    .find((content) => menubarSub(content) === sub) ?? null;
}

export function menubarContentWrapper(element: Element | null) {
  return element?.closest<HTMLElement>("aria-menubar-content, aria-menubar-sub-content") ?? null;
}

export function menubarItems(content: Element) {
  return Array.from(content.querySelectorAll<HTMLElement>(
    "aria-menubar-item, aria-menubar-checkbox-item, aria-menubar-radio-item, aria-menubar-sub-trigger",
  )).filter((item) => menubarContentWrapper(item) === content);
}

export function menubarEnabledItems(content: Element) {
  return menubarItems(content).filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true");
}

export function menubarItemText(item: HTMLElement) {
  return (item.getAttribute("text-value") || item.getAttribute("textvalue") || item.textContent || "").trim().toLowerCase();
}

export function menubarTriggerValue(trigger: HTMLElement) {
  return trigger.getAttribute("value")
    || menubarMenu(trigger)?.getAttribute("value")
    || trigger.textContent?.trim().toLowerCase().replace(/\s+/g, "-")
    || "";
}

export function ensureMenubarId(element: HTMLElement, prefix: string, nextId: () => number) {
  if (!element.id) element.id = `ariaui-menubar-${prefix}-${nextId()}`;
  return element.id;
}
