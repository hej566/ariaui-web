import {
  contextMenuEnabledItems,
  contextMenuItemText,
  contextMenuItems,
  contextMenuMenu,
  contextMenuPartName,
  contextMenuRoot,
  contextMenuRootContent,
  contextMenuSub,
  contextMenuSubContent,
  contextMenuSubTrigger,
} from "./context-menu-dom";
import { positionContextMenuContent, positionContextMenuSubContent } from "./context-menu-position";
import {
  setContextMenuActiveItem,
  setContextMenuOpen,
  syncContextMenuSub,
  syncContextMenuTreeFromRoot,
} from "./context-menu-sync";

const rootScrollState = new WeakMap<HTMLElement, string>();
const contextMenuItemSelector = "aria-context-menu-item, aria-context-menu-sub-trigger";

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function dispatchOpenChange(root: HTMLElement, open: boolean, source: Element) {
  return root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    cancelable: true,
    detail: { open, source },
  }));
}

function dispatchValueChange(root: HTMLElement, value: string, source: Element) {
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: { source, value },
  }));
}

function lockScroll(root: HTMLElement) {
  if (rootScrollState.has(root)) {
    return;
  }

  rootScrollState.set(root, root.ownerDocument.body.style.overflow);
  root.ownerDocument.body.style.overflow = "hidden";
}

function unlockScroll(root: HTMLElement) {
  if (!rootScrollState.has(root)) {
    return;
  }

  root.ownerDocument.body.style.overflow = rootScrollState.get(root) ?? "";
  rootScrollState.delete(root);
}

export function openRootContextMenu(root: HTMLElement, point: { x: number; y: number }, source: Element, focusContent = true) {
  if (!dispatchOpenChange(root, true, source)) {
    return false;
  }

  setContextMenuOpen(root, true);
  syncContextMenuTreeFromRoot(root);
  lockScroll(root);

  const content = contextMenuRootContent(root);
  if (content) {
    setContextMenuActiveItem(content, null);
    content.setAttribute("data-focused", String(focusContent));
    positionContextMenuContent(content, point);
    if (focusContent) {
      content.focus({ preventScroll: true });
    }
  }

  return true;
}

export function closeRootContextMenu(root: HTMLElement, source: Element = root, restoreFocusTo: HTMLElement | null = null) {
  if (!root.hasAttribute("open")) {
    return false;
  }

  if (!dispatchOpenChange(root, false, source)) {
    return false;
  }

  setContextMenuOpen(root, false);
  for (const sub of root.querySelectorAll<HTMLElement>("aria-context-menu-sub")) {
    setContextMenuOpen(sub, false);
  }
  syncContextMenuTreeFromRoot(root);
  unlockScroll(root);
  restoreFocusTo?.focus({ preventScroll: true });
  return true;
}

function openSubMenu(sub: HTMLElement, focusIntent: "first" | "none" = "first") {
  const trigger = contextMenuSubTrigger(sub);
  const content = contextMenuSubContent(sub);
  setContextMenuOpen(sub, true);
  syncContextMenuSub(sub);

  if (trigger && content) {
    positionContextMenuSubContent(trigger, content);
  }

  if (content && focusIntent === "none") {
    setContextMenuActiveItem(content, null);
  }

  if (content && focusIntent !== "none") {
    const items = contextMenuEnabledItems(content);
    setContextMenuActiveItem(content, items[0] ?? null);
    content.setAttribute("data-focused", "true");
    content.focus({ preventScroll: true });
  }
}

function closeSubMenu(sub: HTMLElement, restoreFocus = true) {
  setContextMenuOpen(sub, false);
  syncContextMenuSub(sub);
  if (restoreFocus) {
    contextMenuSubTrigger(sub)?.focus({ preventScroll: true });
  }
}

function closeSiblingSubMenus(menu: HTMLElement, exceptSub: HTMLElement | null = null) {
  for (const sub of Array.from(menu.querySelectorAll<HTMLElement>("aria-context-menu-sub"))) {
    const trigger = contextMenuSubTrigger(sub);
    if (!trigger || contextMenuMenu(trigger) !== menu || sub === exceptSub) {
      continue;
    }

    setContextMenuOpen(sub, false);
    syncContextMenuSub(sub);
  }
}

function activateMenuItem(item: HTMLElement) {
  const root = contextMenuRoot(item);
  if (!root || item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") {
    return false;
  }

  if (contextMenuPartName(item) === "SubTrigger") {
    const sub = contextMenuSub(item);
    if (sub) {
      openSubMenu(sub as HTMLElement, "first");
    }
    return true;
  }

  const value = item.getAttribute("value") || item.textContent?.trim() || "";
  if (value) {
    (root as HTMLElement).setAttribute("value", value);
    dispatchValueChange(root as HTMLElement, value, item);
  }
  closeRootContextMenu(root as HTMLElement, item);
  return true;
}

function moveActiveItem(menu: HTMLElement, direction: number) {
  const items = contextMenuEnabledItems(menu);
  if (items.length === 0) {
    setContextMenuActiveItem(menu, null);
    return;
  }

  const activeId = menu.getAttribute("aria-activedescendant");
  const activeIndex = activeId ? Math.max(0, items.findIndex((item) => item.id === activeId)) : direction > 0 ? -1 : 0;
  const nextIndex = (activeIndex + direction + items.length) % items.length;
  setContextMenuActiveItem(menu, items[nextIndex] ?? null);
}

function setActiveByText(menu: HTMLElement, key: string) {
  const items = contextMenuEnabledItems(menu);
  const lowerKey = key.toLowerCase();
  const activeId = menu.getAttribute("aria-activedescendant");
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const ordered = items.slice(activeIndex + 1).concat(items.slice(0, activeIndex + 1));
  const next = ordered.find((item) => contextMenuItemText(item).startsWith(lowerKey));
  if (next) {
    setContextMenuActiveItem(menu, next);
  }
}

function activeItem(menu: HTMLElement) {
  const activeId = menu.getAttribute("aria-activedescendant");
  return activeId ? menu.ownerDocument.getElementById(activeId) as HTMLElement | null : null;
}

function keyboardMenuForElement(element: HTMLElement) {
  if (contextMenuPartName(element) === "Content" || contextMenuPartName(element) === "SubContent") {
    return element;
  }

  const menu = contextMenuMenu(element);
  if (menu instanceof HTMLElement) {
    if (contextMenuItems(menu).includes(element)) {
      setContextMenuActiveItem(menu, element);
    }
    return menu;
  }

  return null;
}

export function handleContextMenuClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  const partName = contextMenuPartName(element);

  if (partName === "SubTrigger") {
    const sub = contextMenuSub(element);
    if (sub) {
      event.preventDefault();
      event.stopPropagation();
      openSubMenu(sub as HTMLElement, event instanceof MouseEvent && event.detail === 0 ? "first" : "none");
    }
    return;
  }

  if (partName === "Item") {
    event.preventDefault();
    activateMenuItem(element);
  }
}

export function handleContextMenuMouseOver(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const item = event.target.closest<HTMLElement>(contextMenuItemSelector);
  if (!item || contextMenuRoot(item) !== root || item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") {
    return;
  }

  const menu = contextMenuMenu(item);
  if (!(menu instanceof HTMLElement) || !contextMenuItems(menu).includes(item)) {
    return;
  }

  const sub = contextMenuPartName(item) === "SubTrigger" ? contextMenuSub(item) : null;
  closeSiblingSubMenus(menu, sub as HTMLElement | null);
  setContextMenuActiveItem(menu, item);
  menu.focus({ preventScroll: true });

  if (sub) {
    openSubMenu(sub as HTMLElement, "none");
  }
}

export function handleContextMenuKeyDown(element: HTMLElement, event: KeyboardEvent) {
  const partName = contextMenuPartName(element);

  if (partName === "SubTrigger") {
    const sub = contextMenuSub(element);
    const forwardKey = element.closest("[dir='rtl']") ? "ArrowLeft" : "ArrowRight";
    const backwardKey = forwardKey === "ArrowRight" ? "ArrowLeft" : "ArrowRight";

    if (sub && (event.key === forwardKey || event.key === "Enter" || isSpaceKey(event))) {
      event.preventDefault();
      event.stopPropagation();
      openSubMenu(sub as HTMLElement, "first");
      return;
    }

    if (sub && event.key === backwardKey && (sub as HTMLElement).hasAttribute("open")) {
      event.preventDefault();
      event.stopPropagation();
      closeSubMenu(sub as HTMLElement, true);
      return;
    }
  }

  const menu = keyboardMenuForElement(element);
  if (!menu) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveActiveItem(menu, 1);
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveActiveItem(menu, -1);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    setContextMenuActiveItem(menu, contextMenuEnabledItems(menu)[0] ?? null);
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    const items = contextMenuEnabledItems(menu);
    setContextMenuActiveItem(menu, items[items.length - 1] ?? null);
    return;
  }

  const forwardKey = element.closest("[dir='rtl']") ? "ArrowLeft" : "ArrowRight";
  const backwardKey = forwardKey === "ArrowRight" ? "ArrowLeft" : "ArrowRight";
  if (event.key === forwardKey) {
    const item = activeItem(menu);
    if (item && contextMenuPartName(item) === "SubTrigger") {
      const sub = contextMenuSub(item);
      if (sub) {
        event.preventDefault();
        openSubMenu(sub as HTMLElement, "first");
        return;
      }
    }
  }

  if (event.key === backwardKey && partName === "SubContent") {
    const sub = contextMenuSub(element);
    if (sub) {
      event.preventDefault();
      closeSubMenu(sub as HTMLElement, true);
      return;
    }
  }

  if (event.key === "Enter" || isSpaceKey(event)) {
    event.preventDefault();
    const item = activeItem(menu) ?? (contextMenuItems(menu).includes(element) ? element : null);
    if (item) {
      activateMenuItem(item);
    }
    return;
  }

  if (event.key === "Escape" || event.key === "Tab") {
    const root = contextMenuRoot(element);
    if (root) {
      event.preventDefault();
      closeRootContextMenu(root as HTMLElement, element);
    }
    return;
  }

  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
    setActiveByText(menu, event.key);
  }
}

export function handleContextMenuKeyUp(_element: HTMLElement, event: KeyboardEvent) {
  if (isSpaceKey(event)) {
    event.preventDefault();
  }
}
