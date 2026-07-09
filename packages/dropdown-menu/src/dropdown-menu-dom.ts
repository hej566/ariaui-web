export type DropdownMenuRootElement = HTMLElement & {
  syncDropdownMenuTreeFromRoot: () => void;
};

export function dropdownMenuPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function isDropdownMenuRootElement(element: Element | null): element is DropdownMenuRootElement {
  return element instanceof HTMLElement && typeof (element as Partial<DropdownMenuRootElement>).syncDropdownMenuTreeFromRoot === "function";
}

export function dropdownMenuRoot(element: Element) {
  return element.closest("aria-dropdown-menu");
}

export function dropdownMenuSub(element: Element) {
  return element.closest("aria-dropdown-menu-sub");
}

export function dropdownMenuMenu(element: Element) {
  return element.closest("aria-dropdown-menu-content, aria-dropdown-menu-sub-content");
}

export function dropdownMenuElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-dropdown-menu") === root);
}

export function dropdownMenuRootTrigger(root: Element) {
  return dropdownMenuElements(root, "aria-dropdown-menu-trigger")[0] ?? null;
}

export function dropdownMenuRootContent(root: Element) {
  return dropdownMenuElements(root, "aria-dropdown-menu-content")[0] ?? null;
}

export function dropdownMenuSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-dropdown-menu-sub-trigger")).find((element) => element.closest("aria-dropdown-menu-sub") === sub) ?? null;
}

export function dropdownMenuSubContent(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-dropdown-menu-sub-content")).find((element) => element.closest("aria-dropdown-menu-sub") === sub) ?? null;
}

export function dropdownMenuItems(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-dropdown-menu-item, aria-dropdown-menu-checkbox-item, aria-dropdown-menu-radio-item, aria-dropdown-menu-sub-trigger")).filter((item) => dropdownMenuMenu(item) === menu);
}

export function dropdownMenuEnabledItems(menu: Element) {
  return dropdownMenuItems(menu).filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true");
}

export function dropdownMenuItemText(item: HTMLElement) {
  return (item.getAttribute("value") || item.textContent || "").trim().toLowerCase();
}

export function ensureDropdownMenuId(element: HTMLElement, prefix: string, nextId: () => number) {
  if (!element.id) {
    element.id = "ariaui-dropdown-menu-" + prefix + "-" + nextId();
  }

  return element.id;
}

export function closestDropdownMenuRootTrigger(element: Element) {
  const root = dropdownMenuRoot(element);
  return root ? dropdownMenuRootTrigger(root) : null;
}
