import {
  dropdownMenuElements,
  dropdownMenuEnabledItems,
  dropdownMenuItems,
  dropdownMenuPartName,
  dropdownMenuRoot,
  dropdownMenuRootContent,
  dropdownMenuRootTrigger,
  dropdownMenuSubContent,
  dropdownMenuSubTrigger,
  ensureDropdownMenuId,
  isDropdownMenuRootElement,
} from "./dropdown-menu-dom";

let dropdownMenuId = 0;

function nextDropdownMenuId() {
  dropdownMenuId += 1;
  return dropdownMenuId;
}

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function setAttributeIfChanged(element: Element, attribute: string, value: string) {
  if (element.getAttribute(attribute) !== value) {
    element.setAttribute(attribute, value);
  }
}

function removeAttributeIfValue(element: Element, attribute: string, value: string) {
  if (element.getAttribute(attribute) === value) {
    element.removeAttribute(attribute);
  }
}

export function setDropdownMenuOpen(element: HTMLElement, open: boolean) {
  setBooleanAttribute(element, "open", open);
  element.setAttribute("data-state", open ? "open" : "closed");
}

export function syncDropdownMenuTreeAround(element: HTMLElement) {
  const root = element.matches("aria-dropdown-menu") ? element : dropdownMenuRoot(element);
  if (isDropdownMenuRootElement(root)) {
    root.syncDropdownMenuTreeFromRoot();
    return;
  }

  syncDropdownMenuStandalonePart(element);
}

export function syncDropdownMenuTreeFromRoot(root: HTMLElement) {
  if (!root.hasAttribute("data-dropdown-menu-default-open-applied")) {
    root.setAttribute("data-dropdown-menu-default-open-applied", "");
    if ((root.hasAttribute("default-open") || root.hasAttribute("defaultopen")) && !root.hasAttribute("open")) {
      root.setAttribute("open", "");
    }
  }

  const trigger = dropdownMenuRootTrigger(root);
  const content = dropdownMenuRootContent(root);
  const isOpen = root.hasAttribute("open");

  if (trigger) {
    syncDropdownMenuTrigger(root, trigger, content, isOpen);
  }

  if (content) {
    syncDropdownMenuContent(content, trigger, isOpen);
  }

  for (const sub of dropdownMenuElements(root, "aria-dropdown-menu-sub")) {
    syncDropdownMenuSub(sub);
  }

  for (const radioGroup of dropdownMenuElements(root, "aria-dropdown-menu-radio-group")) {
    if (!radioGroup.hasAttribute("role")) {
      radioGroup.setAttribute("role", "group");
    }
  }
}

export function syncDropdownMenuStandalonePart(element: HTMLElement) {
  const partName = dropdownMenuPartName(element);

  if (partName === "Content" || partName === "SubContent") {
    element.setAttribute("data-dropdown-menu-content", "");
    setAttributeIfChanged(element, "tabindex", "-1");
    if (!element.hasAttribute("open") && !element.hasAttribute("force-mount")) {
      element.hidden = true;
    }
  }

  if (partName === "Item") {
    setAttributeIfChanged(element, "tabindex", "-1");
    element.removeAttribute("aria-haspopup");
    element.removeAttribute("aria-expanded");
  }

  if (partName === "SubTrigger") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "menuitem");
    }
    if (!element.hasAttribute("aria-haspopup")) {
      element.setAttribute("aria-haspopup", "menu");
    }
    if (!element.hasAttribute("aria-expanded")) {
      element.setAttribute("aria-expanded", "false");
    }
    setAttributeIfChanged(element, "tabindex", "-1");
  }

  if (partName === "RadioGroup" && !element.hasAttribute("role")) {
    element.setAttribute("role", "group");
  }
}

export function syncDropdownMenuTrigger(root: HTMLElement, trigger: HTMLElement, content: HTMLElement | null, isOpen: boolean) {
  if (!trigger.id) {
    ensureDropdownMenuId(trigger, "trigger", nextDropdownMenuId);
  }
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", String(isOpen));
  trigger.setAttribute("data-state", isOpen ? "open" : "closed");
  setBooleanAttribute(trigger, "open", isOpen);

  if (isOpen && content) {
    trigger.setAttribute("aria-controls", ensureDropdownMenuId(content, "content", nextDropdownMenuId));
  } else {
    trigger.removeAttribute("aria-controls");
  }
}

export function syncDropdownMenuContent(content: HTMLElement, trigger: HTMLElement | null, isOpen: boolean) {
  content.setAttribute("role", "menu");
  content.setAttribute("data-dropdown-menu-content", "");
  setAttributeIfChanged(content, "tabindex", "-1");
  setDropdownMenuOpen(content, isOpen);
  content.hidden = !isOpen && !content.hasAttribute("force-mount");

  if (trigger) {
    ensureDropdownMenuId(trigger, "trigger", nextDropdownMenuId);
    ensureDropdownMenuId(content, "content", nextDropdownMenuId);
    content.setAttribute("aria-labelledby", trigger.id);
  }

  syncDropdownMenuItems(content, isOpen);
}

export function syncDropdownMenuItems(menu: HTMLElement, isMenuOpen: boolean) {
  const items = dropdownMenuItems(menu);
  const enabledItems = dropdownMenuEnabledItems(menu);

  for (const item of items) {
    syncDropdownMenuItem(item, false);
  }

  if (!isMenuOpen) {
    menu.removeAttribute("aria-activedescendant");
    return;
  }

  const activeId = menu.getAttribute("aria-activedescendant");
  const activeItem = activeId ? enabledItems.find((item) => item.id === activeId) : null;
  const nextActiveItem = activeItem ?? enabledItems[0] ?? null;

  if (!nextActiveItem) {
    menu.removeAttribute("aria-activedescendant");
    return;
  }

  setDropdownMenuActiveItem(menu, nextActiveItem);
}

export function syncDropdownMenuItem(item: HTMLElement, active: boolean) {
  if (!item.id) {
    ensureDropdownMenuId(item, "item", nextDropdownMenuId);
  }

  const partName = dropdownMenuPartName(item);
  const disabled = item.hasAttribute("disabled");
  item.setAttribute("tabindex", disabled ? "-1" : active ? "0" : "-1");
  item.setAttribute("data-active", String(active));

  if (disabled) {
    item.setAttribute("data-disabled", "");
    item.setAttribute("aria-disabled", "true");
  }

  if (partName === "Item") {
    item.removeAttribute("aria-haspopup");
    item.removeAttribute("aria-expanded");
  }

  if (partName === "SubTrigger") {
    item.setAttribute("aria-haspopup", "menu");
  }
}

export function setDropdownMenuActiveItem(menu: HTMLElement, item: HTMLElement | null) {
  for (const candidate of dropdownMenuItems(menu)) {
    syncDropdownMenuItem(candidate, item === candidate);
  }

  if (item) {
    menu.setAttribute("aria-activedescendant", item.id || ensureDropdownMenuId(item, "item", nextDropdownMenuId));
  } else {
    menu.removeAttribute("aria-activedescendant");
  }
}

export function syncDropdownMenuSub(sub: HTMLElement) {
  if (!sub.hasAttribute("data-dropdown-menu-default-open-applied")) {
    sub.setAttribute("data-dropdown-menu-default-open-applied", "");
    if ((sub.hasAttribute("default-open") || sub.hasAttribute("defaultopen")) && !sub.hasAttribute("open")) {
      sub.setAttribute("open", "");
    }
  }

  const trigger = dropdownMenuSubTrigger(sub);
  const content = dropdownMenuSubContent(sub);
  const isOpen = sub.hasAttribute("open");
  sub.setAttribute("data-state", isOpen ? "open" : "closed");

  if (trigger) {
    if (!trigger.id) {
      ensureDropdownMenuId(trigger, "sub-trigger", nextDropdownMenuId);
    }
    trigger.setAttribute("role", "menuitem");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("data-state", isOpen ? "open" : "closed");
    setBooleanAttribute(trigger, "open", isOpen);
    setAttributeIfChanged(trigger, "tabindex", trigger.getAttribute("tabindex") ?? "-1");

    if (isOpen && content) {
      trigger.setAttribute("aria-controls", ensureDropdownMenuId(content, "sub-content", nextDropdownMenuId));
    } else {
      trigger.removeAttribute("aria-controls");
    }
  }

  if (content) {
    content.setAttribute("role", "menu");
    content.setAttribute("data-dropdown-menu-content", "");
    setAttributeIfChanged(content, "tabindex", "-1");
    setDropdownMenuOpen(content, isOpen);
    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    if (trigger) {
      content.setAttribute("aria-labelledby", ensureDropdownMenuId(trigger, "sub-trigger", nextDropdownMenuId));
    }
    syncDropdownMenuItems(content, isOpen);
  }
}

export function removeDropdownMenuGeneratedDefault(element: HTMLElement, attribute: string, value: string) {
  removeAttributeIfValue(element, attribute, value);
}
