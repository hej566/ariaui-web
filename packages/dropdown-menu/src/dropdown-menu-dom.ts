export type DropdownMenuRootElement = HTMLElement & {
  syncDropdownMenuTreeFromRoot: () => void;
};

const dropdownMenuContentRoots = new WeakMap<Element, HTMLElement>();
const dropdownMenuRootContents = new WeakMap<Element, HTMLElement>();
const dropdownMenuContentSubs = new WeakMap<Element, HTMLElement>();
const dropdownMenuSubContents = new WeakMap<Element, HTMLElement>();
const dropdownMenuRootContentSets = new WeakMap<Element, Set<HTMLElement>>();

export function dropdownMenuPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function isDropdownMenuRootElement(element: Element | null): element is DropdownMenuRootElement {
  return element instanceof HTMLElement && typeof (element as Partial<DropdownMenuRootElement>).syncDropdownMenuTreeFromRoot === "function";
}

export function dropdownMenuRoot(element: Element) {
  const localRoot = element.closest("aria-dropdown-menu");
  if (localRoot) {
    return localRoot;
  }

  const content = element.matches("aria-dropdown-menu-content, aria-dropdown-menu-sub-content")
    ? element
    : element.closest("aria-dropdown-menu-content, aria-dropdown-menu-sub-content");
  return content ? dropdownMenuContentRoots.get(content) ?? null : null;
}

export function dropdownMenuSub(element: Element) {
  const localSub = element.closest("aria-dropdown-menu-sub");
  if (localSub) {
    return localSub;
  }

  const content = element.matches("aria-dropdown-menu-sub-content")
    ? element
    : element.closest("aria-dropdown-menu-sub-content");
  return content ? dropdownMenuContentSubs.get(content) ?? null : null;
}

export function dropdownMenuMenu(element: Element) {
  return element.closest("aria-dropdown-menu-content, aria-dropdown-menu-sub-content");
}

export function dropdownMenuElements(root: Element, selector: string) {
  const elements = new Set(root.querySelectorAll<HTMLElement>(selector));
  for (const content of dropdownMenuRootContentSets.get(root) ?? []) {
    if (content.matches(selector)) {
      elements.add(content);
    }
    for (const element of content.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }
  }

  return Array.from(elements).filter((element) => dropdownMenuRoot(element) === root);
}

export function dropdownMenuRootTrigger(root: Element) {
  return dropdownMenuElements(root, "aria-dropdown-menu-trigger")[0] ?? null;
}

export function dropdownMenuRootContent(root: Element) {
  return dropdownMenuRootContents.get(root)
    ?? dropdownMenuElements(root, "aria-dropdown-menu-content")[0]
    ?? null;
}

export function dropdownMenuSubTrigger(sub: Element) {
  return Array.from(sub.querySelectorAll<HTMLElement>("aria-dropdown-menu-sub-trigger")).find((element) => element.closest("aria-dropdown-menu-sub") === sub) ?? null;
}

export function dropdownMenuSubContent(sub: Element) {
  return dropdownMenuSubContents.get(sub)
    ?? Array.from(sub.querySelectorAll<HTMLElement>("aria-dropdown-menu-sub-content")).find((element) => element.closest("aria-dropdown-menu-sub") === sub)
    ?? null;
}

function registerDropdownMenuContent(root: HTMLElement, content: HTMLElement) {
  let contents = dropdownMenuRootContentSets.get(root);
  if (!contents) {
    contents = new Set();
    dropdownMenuRootContentSets.set(root, contents);
  }
  contents.add(content);
  dropdownMenuContentRoots.set(content, root);
}

export function registerDropdownMenuRootContent(root: HTMLElement, content: HTMLElement) {
  dropdownMenuRootContents.set(root, content);
  registerDropdownMenuContent(root, content);
}

export function registerDropdownMenuSubContent(root: HTMLElement, sub: HTMLElement, content: HTMLElement) {
  dropdownMenuSubContents.set(sub, content);
  dropdownMenuContentSubs.set(content, sub);
  registerDropdownMenuContent(root, content);
}

export function dropdownMenuRootOwnsNode(root: HTMLElement, node: Node) {
  if (root.contains(node)) {
    return true;
  }

  for (const content of dropdownMenuRootContentSets.get(root) ?? []) {
    if (content.contains(node)) {
      return true;
    }
  }

  return false;
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
