import {
  dropdownMenuEnabledItems,
  dropdownMenuItemText,
  dropdownMenuItems,
  dropdownMenuMenu,
  dropdownMenuPartName,
  dropdownMenuRoot,
  dropdownMenuRootContent,
  dropdownMenuRootTrigger,
  dropdownMenuSub,
  dropdownMenuSubContent,
  dropdownMenuSubTrigger,
} from "./dropdown-menu-dom";
import {
  setDropdownMenuActiveItem,
  setDropdownMenuOpen,
  syncDropdownMenuSub,
  syncDropdownMenuTreeAround,
} from "./dropdown-menu-sync";

const dropdownMenuOutsideClickHandlers = new WeakMap<HTMLElement, (event: MouseEvent) => void>();
const dropdownMenuHoverHandlers = new WeakMap<HTMLElement, (event: MouseEvent) => void>();
const dropdownMenuItemSelector = "aria-dropdown-menu-item, aria-dropdown-menu-checkbox-item, aria-dropdown-menu-radio-item, aria-dropdown-menu-sub-trigger";

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function isCheckableRole(role: string | null) {
  return role === "checkbox" || role === "menuitemcheckbox" || role === "menuitemradio" || role === "radio" || role === "switch";
}

function isButtonLikeRole(role: string | null) {
  return role === "button" || isCheckableRole(role) || role === "link" || role === "option" || role === "tab";
}

function genericClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const role = element.getAttribute("role");
  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (isCheckableRole(role)) {
    if (element.hasAttribute("indeterminate")) {
      element.removeAttribute("indeterminate");
      setBooleanAttribute(element, "checked", true);
    } else {
      setBooleanAttribute(element, "checked", !element.hasAttribute("checked"));
    }
    return;
  }

  if (element.hasAttribute("pressed")) {
    setBooleanAttribute(element, "pressed", !element.hasAttribute("pressed"));
  }
}

function genericKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const role = element.getAttribute("role");
  if (!isButtonLikeRole(role)) {
    return;
  }

  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    element.click();
  }

  if (isSpaceKey(event)) {
    event.preventDefault();
  }
}

function genericKeyUp(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const role = element.getAttribute("role");
  if (!isButtonLikeRole(role) || element.hasAttribute("disabled")) {
    return;
  }

  if (isSpaceKey(event)) {
    event.preventDefault();
    element.click();
  }
}

function openRootMenu(root: HTMLElement, focusIntent: "first" | "last" = "first") {
  const content = dropdownMenuRootContent(root);
  setDropdownMenuOpen(root, true);
  syncDropdownMenuTreeAround(root);

  if (content) {
    const items = dropdownMenuEnabledItems(content);
    setDropdownMenuActiveItem(content, focusIntent === "last" ? items[items.length - 1] ?? null : items[0] ?? null);
    content.focus({ preventScroll: true });
  }
}

function closeRootMenu(root: HTMLElement, restoreFocus = true) {
  setDropdownMenuOpen(root, false);
  for (const sub of root.querySelectorAll<HTMLElement>("aria-dropdown-menu-sub")) {
    setDropdownMenuOpen(sub, false);
  }
  syncDropdownMenuTreeAround(root);
  if (restoreFocus) {
    dropdownMenuRootTrigger(root)?.focus({ preventScroll: true });
  }
}

function openSubMenu(sub: HTMLElement, focusIntent: "first" | "last" | "none" = "first") {
  const content = dropdownMenuSubContent(sub);
  setDropdownMenuOpen(sub, true);
  syncDropdownMenuSub(sub);

  if (content && focusIntent === "none") {
    setDropdownMenuActiveItem(content, null);
  }

  if (content && focusIntent !== "none") {
    const items = dropdownMenuEnabledItems(content);
    setDropdownMenuActiveItem(content, focusIntent === "last" ? items[items.length - 1] ?? null : items[0] ?? null);
    content.focus({ preventScroll: true });
  }
}

function closeSubMenu(sub: HTMLElement, restoreFocus = true) {
  setDropdownMenuOpen(sub, false);
  syncDropdownMenuSub(sub);
  if (restoreFocus) {
    dropdownMenuSubTrigger(sub)?.focus({ preventScroll: true });
  }
}

function closeSiblingSubMenus(menu: HTMLElement, exceptSub: HTMLElement | null = null) {
  for (const sub of Array.from(menu.querySelectorAll<HTMLElement>("aria-dropdown-menu-sub"))) {
    const trigger = dropdownMenuSubTrigger(sub);
    if (!trigger || dropdownMenuMenu(trigger) !== menu || sub === exceptSub) {
      continue;
    }

    setDropdownMenuOpen(sub, false);
    syncDropdownMenuSub(sub);
  }
}

function activateMenuItem(item: HTMLElement) {
  const partName = dropdownMenuPartName(item);
  const root = dropdownMenuRoot(item);
  if (!root || item.hasAttribute("disabled")) {
    return false;
  }

  if (partName === "SubTrigger") {
    const sub = dropdownMenuSub(item);
    if (sub) {
      openSubMenu(sub as HTMLElement, "first");
    }
    return true;
  }

  if (partName === "CheckboxItem") {
    setBooleanAttribute(item, "checked", !item.hasAttribute("checked"));
    closeRootMenu(root as HTMLElement, true);
    return true;
  }

  if (partName === "RadioItem") {
    const group = item.closest("aria-dropdown-menu-radio-group");
    const siblings = group
      ? Array.from(group.querySelectorAll<HTMLElement>("aria-dropdown-menu-radio-item"))
      : Array.from(root.querySelectorAll<HTMLElement>("aria-dropdown-menu-radio-item"));
    for (const sibling of siblings) {
      setBooleanAttribute(sibling, "checked", sibling === item);
    }
    closeRootMenu(root as HTMLElement, true);
    return true;
  }

  if (partName === "Item") {
    if (item.hasAttribute("value")) {
      (root as HTMLElement).setAttribute("value", item.getAttribute("value") ?? "");
    }

    if ((root as HTMLElement).getAttribute("selection-mode") !== "multiple") {
      closeRootMenu(root as HTMLElement, true);
    }
    return true;
  }

  return false;
}

function moveActiveItem(menu: HTMLElement, direction: number) {
  const items = dropdownMenuEnabledItems(menu);
  if (items.length === 0) {
    setDropdownMenuActiveItem(menu, null);
    return;
  }

  const activeId = menu.getAttribute("aria-activedescendant");
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const nextIndex = (activeIndex + direction + items.length) % items.length;
  setDropdownMenuActiveItem(menu, items[nextIndex] ?? null);
}

function setActiveByText(menu: HTMLElement, key: string) {
  const items = dropdownMenuEnabledItems(menu);
  const lowerKey = key.toLowerCase();
  const activeId = menu.getAttribute("aria-activedescendant");
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const ordered = items.slice(activeIndex + 1).concat(items.slice(0, activeIndex + 1));
  const next = ordered.find((item) => dropdownMenuItemText(item).startsWith(lowerKey));
  if (next) {
    setDropdownMenuActiveItem(menu, next);
  }
}

function activeItem(menu: HTMLElement) {
  const activeId = menu.getAttribute("aria-activedescendant");
  return activeId ? menu.ownerDocument.getElementById(activeId) as HTMLElement | null : null;
}

function isDropdownMenuHandledElement(element: HTMLElement) {
  return dropdownMenuPartName(element).startsWith("Sub") || Boolean(dropdownMenuRoot(element));
}

export function handleDropdownMenuClick(element: HTMLElement, event: Event) {
  const partName = dropdownMenuPartName(element);

  if (!isDropdownMenuHandledElement(element)) {
    genericClick(element, event);
    return;
  }

  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (partName === "Trigger") {
    const root = dropdownMenuRoot(element);
    if (!root) {
      genericClick(element, event);
      return;
    }
    event.preventDefault();
    if ((root as HTMLElement).hasAttribute("open")) {
      closeRootMenu(root as HTMLElement, true);
    } else {
      openRootMenu(root as HTMLElement, "first");
    }
    return;
  }

  if (partName === "SubTrigger") {
    const sub = dropdownMenuSub(element);
    if (!sub) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    openSubMenu(sub as HTMLElement, event instanceof MouseEvent && event.detail === 0 ? "first" : "none");
    return;
  }

  if (partName === "Item" || partName === "CheckboxItem" || partName === "RadioItem") {
    event.preventDefault();
    activateMenuItem(element);
    return;
  }

  genericClick(element, event);
}

export function handleDropdownMenuMouseOver(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const item = event.target.closest<HTMLElement>(dropdownMenuItemSelector);
  if (!item || dropdownMenuRoot(item) !== root || item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") {
    return;
  }

  const menu = dropdownMenuMenu(item);
  if (!(menu instanceof HTMLElement) || !dropdownMenuItems(menu).includes(item)) {
    return;
  }

  const sub = dropdownMenuPartName(item) === "SubTrigger" ? dropdownMenuSub(item) : null;
  closeSiblingSubMenus(menu, sub as HTMLElement | null);
  setDropdownMenuActiveItem(menu, item);
  menu.focus({ preventScroll: true });

  if (sub) {
    openSubMenu(sub as HTMLElement, "none");
  }
}

export function handleDropdownMenuKeyDown(element: HTMLElement, event: KeyboardEvent) {
  const partName = dropdownMenuPartName(element);

  if (partName === "Trigger") {
    const root = dropdownMenuRoot(element);
    if (!root) {
      genericKeyDown(element, event);
      return;
    }

    if (event.key === "Enter" || isSpaceKey(event) || event.key === "ArrowDown") {
      event.preventDefault();
      openRootMenu(root as HTMLElement, "first");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openRootMenu(root as HTMLElement, "last");
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeRootMenu(root as HTMLElement, true);
      return;
    }
  }

  if (partName === "SubTrigger") {
    const sub = dropdownMenuSub(element);
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

  if (partName === "Content" || partName === "SubContent") {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveItem(element, 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveItem(element, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setDropdownMenuActiveItem(element, dropdownMenuEnabledItems(element)[0] ?? null);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const items = dropdownMenuEnabledItems(element);
      setDropdownMenuActiveItem(element, items[items.length - 1] ?? null);
      return;
    }

    const forwardKey = element.closest("[dir='rtl']") ? "ArrowLeft" : "ArrowRight";
    if (event.key === forwardKey) {
      const item = activeItem(element);
      if (item && dropdownMenuPartName(item) === "SubTrigger") {
        const sub = dropdownMenuSub(item);
        if (sub) {
          event.preventDefault();
          openSubMenu(sub as HTMLElement, "first");
          return;
        }
      }
    }

    if (event.key === "Enter" || isSpaceKey(event)) {
      event.preventDefault();
      const item = activeItem(element);
      if (item) {
        activateMenuItem(item);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      const sub = partName === "SubContent" ? dropdownMenuSub(element) : null;
      if (sub) {
        closeSubMenu(sub as HTMLElement, true);
      } else {
        const root = dropdownMenuRoot(element);
        if (root) {
          closeRootMenu(root as HTMLElement, true);
        }
      }
      return;
    }

    if (event.key === "ArrowLeft" && partName === "SubContent") {
      const sub = dropdownMenuSub(element);
      if (sub) {
        event.preventDefault();
        closeSubMenu(sub as HTMLElement, true);
        return;
      }
    }

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      setActiveByText(element, event.key);
      return;
    }
  }

  genericKeyDown(element, event);
}

export function handleDropdownMenuKeyUp(element: HTMLElement, event: KeyboardEvent) {
  if (dropdownMenuPartName(element) === "Trigger" && dropdownMenuRoot(element)) {
    return;
  }

  genericKeyUp(element, event);
}

export function bindDropdownMenuOutsideEvents(root: HTMLElement) {
  if (dropdownMenuOutsideClickHandlers.has(root)) {
    return;
  }

  const ownerDocument = root.ownerDocument;
  const handleDocumentClick = (event: MouseEvent) => {
    closeDropdownMenuFromDocumentEvent(root, event.target);
  };

  dropdownMenuOutsideClickHandlers.set(root, handleDocumentClick);
  ownerDocument.addEventListener("click", handleDocumentClick, true);
}

export function unbindDropdownMenuOutsideEvents(root: HTMLElement) {
  const handleDocumentClick = dropdownMenuOutsideClickHandlers.get(root);
  if (!handleDocumentClick) {
    return;
  }

  dropdownMenuOutsideClickHandlers.delete(root);
  root.ownerDocument.removeEventListener("click", handleDocumentClick, true);
}

export function bindDropdownMenuHoverEvents(root: HTMLElement) {
  if (dropdownMenuHoverHandlers.has(root)) {
    return;
  }

  const handleMouseOver = (event: MouseEvent) => {
    handleDropdownMenuMouseOver(root, event);
  };

  dropdownMenuHoverHandlers.set(root, handleMouseOver);
  root.addEventListener("mouseover", handleMouseOver);
}

export function unbindDropdownMenuHoverEvents(root: HTMLElement) {
  const handleMouseOver = dropdownMenuHoverHandlers.get(root);
  if (!handleMouseOver) {
    return;
  }

  dropdownMenuHoverHandlers.delete(root);
  root.removeEventListener("mouseover", handleMouseOver);
}

export function closeDropdownMenuFromDocumentEvent(root: HTMLElement, target: EventTarget | null) {
  if (!root.hasAttribute("open")) {
    return;
  }

  if (target instanceof Node && root.contains(target)) {
    return;
  }

  closeRootMenu(root, false);
}
