import {
  contextMenuElements,
  contextMenuEnabledItems,
  contextMenuItems,
  contextMenuPartName,
  contextMenuRadioItems,
  contextMenuRadioScope,
  contextMenuRoot,
  contextMenuRootContent,
  contextMenuSubContent,
  contextMenuSubTrigger,
  ensureContextMenuId,
  isContextMenuRootElement,
} from "./context-menu-dom";

let contextMenuId = 0;

function nextContextMenuId() {
  contextMenuId += 1;
  return contextMenuId;
}

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (element.hasAttribute(attribute) === value) {
    return;
  }

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

export function setContextMenuOpen(element: HTMLElement, open: boolean) {
  setBooleanAttribute(element, "open", open);
  element.setAttribute("data-state", open ? "open" : "closed");
}

export function syncContextMenuTreeAround(element: HTMLElement) {
  const root = element.matches("aria-context-menu") ? element : contextMenuRoot(element);
  if (isContextMenuRootElement(root)) {
    root.syncContextMenuTreeFromRoot();
    return;
  }

  syncContextMenuStandalonePart(element);
}

export function syncContextMenuTreeFromRoot(root: HTMLElement) {
  if (!root.hasAttribute("data-context-menu-default-open-applied")) {
    root.setAttribute("data-context-menu-default-open-applied", "");
    if ((root.hasAttribute("default-open") || root.hasAttribute("defaultopen")) && !root.hasAttribute("open")) {
      root.setAttribute("open", "");
    }
  }

  const content = contextMenuRootContent(root);
  const isOpen = root.hasAttribute("open");

  if (content) {
    syncContextMenuContent(content, isOpen);
  }

  for (const sub of contextMenuElements(root, "aria-context-menu-sub")) {
    syncContextMenuSub(sub);
  }

  for (const group of contextMenuElements(root, "aria-context-menu-group")) {
    syncContextMenuGroup(group);
  }
}

export function syncContextMenuStandalonePart(element: HTMLElement) {
  const partName = contextMenuPartName(element);

  if (partName === "Content" || partName === "SubContent") {
    element.setAttribute("data-context-menu-content", "");
    setAttributeIfChanged(element, "tabindex", "0");
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

  if (partName === "Group") {
    syncContextMenuGroup(element);
  }
}

export function syncContextMenuContent(content: HTMLElement, isOpen: boolean) {
  content.setAttribute("role", "menu");
  content.setAttribute("data-context-menu-content", "");
  setAttributeIfChanged(content, "tabindex", "0");
  setContextMenuOpen(content, isOpen);
  content.hidden = !isOpen && !content.hasAttribute("force-mount");

  if (!isOpen) {
    content.removeAttribute("aria-activedescendant");
    content.setAttribute("data-focused", "false");
  }

  syncContextMenuItems(content);
}

function syncContextMenuRadioItems(menu: HTMLElement) {
  const selectedScopes = new Set<Element>();
  const defaultItems = new Map<Element, HTMLElement>();

  for (const item of contextMenuRadioItems(menu)) {
    const scope = contextMenuRadioScope(item, menu);
    if (item.hasAttribute("checked")) {
      if (selectedScopes.has(scope)) {
        setBooleanAttribute(item, "checked", false);
      } else {
        selectedScopes.add(scope);
      }
      continue;
    }

    if (item.hasAttribute("default-checked") && !defaultItems.has(scope)) {
      defaultItems.set(scope, item);
    }
  }

  for (const [scope, item] of defaultItems) {
    if (!selectedScopes.has(scope)) {
      setBooleanAttribute(item, "checked", true);
      selectedScopes.add(scope);
    }
  }
}

export function syncContextMenuItems(menu: HTMLElement) {
  syncContextMenuRadioItems(menu);

  const activeId = menu.getAttribute("aria-activedescendant");
  const enabledItems = contextMenuEnabledItems(menu);
  const activeItem = activeId ? enabledItems.find((item) => item.id === activeId) ?? null : null;

  for (const item of contextMenuItems(menu)) {
    syncContextMenuItem(item, activeItem === item);
  }

  if (activeItem) {
    menu.setAttribute("aria-activedescendant", activeItem.id);
  } else {
    menu.removeAttribute("aria-activedescendant");
  }
}

export function syncContextMenuItem(item: HTMLElement, active: boolean) {
  if (!item.id) {
    ensureContextMenuId(item, "item", nextContextMenuId);
  }

  const partName = contextMenuPartName(item);
  const disabled = item.hasAttribute("disabled");
  item.setAttribute("tabindex", disabled ? "-1" : active ? "0" : "-1");
  item.setAttribute("data-active", String(active));

  if (disabled) {
    item.setAttribute("data-disabled", "");
    item.setAttribute("aria-disabled", "true");
  } else {
    item.removeAttribute("data-disabled");
    item.removeAttribute("aria-disabled");
  }

  if (partName === "Item") {
    item.removeAttribute("aria-haspopup");
    item.removeAttribute("aria-expanded");
  }

  if (partName === "SubTrigger") {
    item.setAttribute("role", "menuitem");
    item.setAttribute("aria-haspopup", "menu");
  }
}

export function setContextMenuActiveItem(menu: HTMLElement, item: HTMLElement | null) {
  for (const candidate of contextMenuItems(menu)) {
    syncContextMenuItem(candidate, item === candidate);
  }

  if (item) {
    menu.setAttribute("aria-activedescendant", item.id || ensureContextMenuId(item, "item", nextContextMenuId));
  } else {
    menu.removeAttribute("aria-activedescendant");
  }
}

export function syncContextMenuSub(sub: HTMLElement) {
  if (!sub.hasAttribute("data-context-menu-default-open-applied")) {
    sub.setAttribute("data-context-menu-default-open-applied", "");
    if ((sub.hasAttribute("default-open") || sub.hasAttribute("defaultopen")) && !sub.hasAttribute("open")) {
      sub.setAttribute("open", "");
    }
  }

  const trigger = contextMenuSubTrigger(sub);
  const content = contextMenuSubContent(sub);
  const isOpen = sub.hasAttribute("open");
  sub.setAttribute("data-state", isOpen ? "open" : "closed");

  if (trigger) {
    if (!trigger.id) {
      ensureContextMenuId(trigger, "sub-trigger", nextContextMenuId);
    }
    trigger.setAttribute("role", "menuitem");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("data-state", isOpen ? "open" : "closed");
    setBooleanAttribute(trigger, "open", isOpen);
    setAttributeIfChanged(trigger, "tabindex", trigger.getAttribute("tabindex") ?? "-1");

    if (isOpen && content) {
      trigger.setAttribute("aria-controls", ensureContextMenuId(content, "sub-content", nextContextMenuId));
    } else {
      trigger.removeAttribute("aria-controls");
    }
  }

  if (content) {
    content.setAttribute("role", "menu");
    content.setAttribute("data-context-menu-content", "");
    setAttributeIfChanged(content, "tabindex", "0");
    setContextMenuOpen(content, isOpen);
    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    if (trigger) {
      content.setAttribute("aria-labelledby", ensureContextMenuId(trigger, "sub-trigger", nextContextMenuId));
    }
    if (!isOpen) {
      content.removeAttribute("aria-activedescendant");
      content.setAttribute("data-focused", "false");
    }
    syncContextMenuItems(content);
  }
}

export function syncContextMenuGroup(group: HTMLElement) {
  const label = Array.from(group.querySelectorAll<HTMLElement>("aria-context-menu-label"))
    .find((candidate) => candidate.closest("aria-context-menu-group") === group);
  if (!label) {
    return;
  }

  if (!group.id) {
    ensureContextMenuId(group, "group", nextContextMenuId);
  }
  if (!label.id) {
    label.id = group.id + "-label";
  }
  setAttributeIfChanged(group, "aria-labelledby", label.id);
}
