export type ContextMenuRootElement = HTMLElement & {
  bindContextMenuArea: () => void;
  syncContextMenuTreeFromRoot: () => void;
};

export function contextMenuPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function isContextMenuRootElement(element: Element | null): element is ContextMenuRootElement {
  return element instanceof HTMLElement && typeof (element as Partial<ContextMenuRootElement>).syncContextMenuTreeFromRoot === "function";
}

export function contextMenuRoot(element: Element) {
  return element.closest("aria-context-menu");
}

export function contextMenuSub(element: Element) {
  return element.closest("aria-context-menu-sub");
}

export function contextMenuMenu(element: Element) {
  return element.closest("aria-context-menu-content, aria-context-menu-sub-content");
}

export function contextMenuElements(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => element.closest("aria-context-menu") === root);
}

export function contextMenuRootContent(root: Element) {
  return contextMenuElements(root, "aria-context-menu-content")
    .find((element) => !element.closest("aria-context-menu-sub")) ?? null;
}

export function contextMenuSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-context-menu-sub-trigger"))
    .find((element) => element.closest("aria-context-menu-sub") === sub) ?? null;
}

export function contextMenuSubContent(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-context-menu-sub-content"))
    .find((element) => element.closest("aria-context-menu-sub") === sub) ?? null;
}

export function contextMenuItems(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-context-menu-item, aria-context-menu-sub-trigger"))
    .filter((item) => contextMenuMenu(item) === menu);
}

export function contextMenuEnabledItems(menu: Element) {
  return contextMenuItems(menu).filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true");
}

export function contextMenuItemText(item: HTMLElement) {
  return (item.getAttribute("value") || item.textContent || "").trim().toLowerCase();
}

export function ensureContextMenuId(element: HTMLElement, prefix: string, nextId: () => number) {
  if (!element.id) {
    element.id = "ariaui-context-menu-" + prefix + "-" + nextId();
  }

  return element.id;
}

export function contextMenuArea(root: HTMLElement) {
  const areaId = root.getAttribute("area") || root.getAttribute("area-id") || root.getAttribute("for");
  if (areaId) {
    return root.ownerDocument.getElementById(areaId);
  }

  return root.querySelector<HTMLElement>("[data-context-menu-area]") ?? root;
}
