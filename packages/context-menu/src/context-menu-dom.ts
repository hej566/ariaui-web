export type ContextMenuRootElement = HTMLElement & {
  bindContextMenuArea: () => void;
  syncContextMenuTreeFromRoot: () => void;
};

const contextMenuContentRoots = new WeakMap<Element, HTMLElement>();
const contextMenuRootContents = new WeakMap<Element, HTMLElement>();
const contextMenuContentSubs = new WeakMap<Element, HTMLElement>();
const contextMenuSubContents = new WeakMap<Element, HTMLElement>();
const contextMenuRootContentSets = new WeakMap<Element, Set<HTMLElement>>();

export function contextMenuPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function isContextMenuRootElement(element: Element | null): element is ContextMenuRootElement {
  return element instanceof HTMLElement && typeof (element as Partial<ContextMenuRootElement>).syncContextMenuTreeFromRoot === "function";
}

export function contextMenuRoot(element: Element) {
  const localRoot = element.closest("aria-context-menu");
  if (localRoot) {
    return localRoot;
  }

  const content = element.matches("aria-context-menu-content, aria-context-menu-sub-content")
    ? element
    : element.closest("aria-context-menu-content, aria-context-menu-sub-content");
  return content ? contextMenuContentRoots.get(content) ?? null : null;
}

export function contextMenuSub(element: Element) {
  const localSub = element.closest("aria-context-menu-sub");
  if (localSub) {
    return localSub;
  }

  const content = element.matches("aria-context-menu-sub-content")
    ? element
    : element.closest("aria-context-menu-sub-content");
  return content ? contextMenuContentSubs.get(content) ?? null : null;
}

export function contextMenuMenu(element: Element) {
  return element.closest("aria-context-menu-content, aria-context-menu-sub-content");
}

export function contextMenuElements(root: Element, selector: string) {
  const elements = new Set(root.querySelectorAll<HTMLElement>(selector));
  for (const content of contextMenuRootContentSets.get(root) ?? []) {
    if (content.matches(selector)) {
      elements.add(content);
    }
    for (const element of content.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }
  }

  return Array.from(elements).filter((element) => contextMenuRoot(element) === root);
}

export function contextMenuRootContent(root: Element) {
  return contextMenuRootContents.get(root)
    ?? Array.from(root.querySelectorAll<HTMLElement>("aria-context-menu-content"))
      .find((element) => !element.closest("aria-context-menu-sub"))
    ?? null;
}

export function contextMenuSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-context-menu-sub-trigger"))
    .find((element) => element.closest("aria-context-menu-sub") === sub) ?? null;
}

export function contextMenuSubContent(sub: Element) {
  return contextMenuSubContents.get(sub)
    ?? Array.from(sub.querySelectorAll<HTMLElement>("aria-context-menu-sub-content"))
      .find((element) => element.closest("aria-context-menu-sub") === sub)
    ?? null;
}

function registerContextMenuContent(root: HTMLElement, content: HTMLElement) {
  let contents = contextMenuRootContentSets.get(root);
  if (!contents) {
    contents = new Set();
    contextMenuRootContentSets.set(root, contents);
  }
  contents.add(content);
  contextMenuContentRoots.set(content, root);
}

export function registerContextMenuRootContent(root: HTMLElement, content: HTMLElement) {
  contextMenuRootContents.set(root, content);
  registerContextMenuContent(root, content);
}

export function registerContextMenuSubContent(root: HTMLElement, sub: HTMLElement, content: HTMLElement) {
  contextMenuSubContents.set(sub, content);
  contextMenuContentSubs.set(content, sub);
  registerContextMenuContent(root, content);
}

export function contextMenuRootOwnsNode(root: HTMLElement, node: Node) {
  if (root.contains(node)) {
    return true;
  }

  for (const content of contextMenuRootContentSets.get(root) ?? []) {
    if (content.contains(node)) {
      return true;
    }
  }

  return false;
}

export function contextMenuItems(menu: Element) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-context-menu-item, aria-context-menu-sub-trigger"))
    .filter((item) => contextMenuMenu(item) === menu);
}

export function contextMenuEnabledItems(menu: Element) {
  return contextMenuItems(menu).filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true");
}

export function isContextMenuRadioItem(item: HTMLElement) {
  const role = item.getAttribute("role");
  return contextMenuPartName(item) === "Item" && (role === "menuitemradio" || role === "radio");
}

export function contextMenuRadioItems(menu: Element) {
  return contextMenuItems(menu).filter(isContextMenuRadioItem);
}

export function contextMenuRadioScope(item: HTMLElement, menu: Element) {
  const group = item.closest("aria-context-menu-group");
  return group && contextMenuMenu(group) === menu ? group : menu;
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
