import {
  ensureMenubarId,
  menubarContentHost,
  menubarEnabledItems,
  menubarElements,
  menubarItemText,
  menubarItems,
  menubarMenuContent,
  menubarMenus,
  menubarMenuTrigger,
  menubarPartName,
  menubarRoot,
  menubarSubContent,
  menubarSubTrigger,
  menubarTriggerValue,
  menubarTriggers,
} from "./menubar-dom";
import { stopMenubarPositioning } from "./menubar-position";

type MenubarState = { controlled: boolean; defaultApplied: boolean; syncing: boolean };
const states = new WeakMap<HTMLElement, MenubarState>();
let menubarId = 0;
const nextId = () => ++menubarId;

function state(root: HTMLElement) {
  let current = states.get(root);
  if (!current) {
    current = { controlled: root.hasAttribute("value"), defaultApplied: false, syncing: false };
    states.set(root, current);
  }
  return current;
}

function setAttribute(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setBoolean(element: Element, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function rootValue(root: HTMLElement, current: MenubarState) {
  if (!current.defaultApplied && !root.hasAttribute("value")) {
    const initial = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue");
    if (initial) root.setAttribute("value", initial);
    current.defaultApplied = true;
  }
  return root.getAttribute("value") ?? "";
}

export function menubarIsControlled(root: HTMLElement) {
  return state(root).controlled;
}

export function setMenubarActiveItem(content: HTMLElement, item: HTMLElement | null, focus = true) {
  for (const candidate of menubarItems(content)) {
    const active = candidate === item;
    setAttribute(candidate, "tabindex", active ? "0" : "-1");
    setBoolean(candidate, "data-highlighted", active);
  }
  const host = menubarContentHost(content);
  if (item) {
    ensureMenubarId(item, "item", nextId);
    setAttribute(host, "aria-activedescendant", item.id);
    if (focus) item.focus({ preventScroll: true });
  } else {
    host.removeAttribute("aria-activedescendant");
  }
}

function syncContent(content: HTMLElement, trigger: HTMLElement | null, open: boolean, side: "bottom" | "right") {
  const host = menubarContentHost(content);
  if (host !== content) {
    for (const token of content.classList) host.classList.add(token);
    content.removeAttribute("role");
  }
  setAttribute(host, "role", "menu");
  setAttribute(host, "tabindex", "-1");
  setAttribute(host, "data-state", open ? "open" : "closed");
  setAttribute(host, "data-side", side);
  setAttribute(host, "data-align", "start");
  host.hidden = !open;
  if (!open) stopMenubarPositioning(host);
  if (host !== content) content.hidden = false;
  if (trigger) {
    ensureMenubarId(trigger, "trigger", nextId);
    ensureMenubarId(host, "content", nextId);
    setAttribute(host, "aria-labelledby", trigger.id);
  }

  for (const item of menubarItems(content)) {
    ensureMenubarId(item, "item", nextId);
    setAttribute(item, "tabindex", "-1");
    const disabled = item.hasAttribute("disabled");
    setBoolean(item, "data-disabled", disabled);
    if (disabled) setAttribute(item, "aria-disabled", "true");
    else item.removeAttribute("aria-disabled");
    const textValue = item.getAttribute("text-value") || item.getAttribute("textvalue");
    if (textValue) setAttribute(item, "data-text-value", textValue);
    if (menubarPartName(item) !== "SubTrigger") {
      item.removeAttribute("aria-haspopup");
      item.removeAttribute("aria-expanded");
    }
  }
  if (!open) host.removeAttribute("aria-activedescendant");
}

function syncSub(sub: HTMLElement) {
  if (!sub.hasAttribute("data-default-open-applied")) {
    sub.setAttribute("data-default-open-applied", "");
    if (sub.hasAttribute("default-open") || sub.hasAttribute("defaultopen")) sub.setAttribute("open", "");
  }
  const open = sub.hasAttribute("open");
  const trigger = menubarSubTrigger(sub);
  const content = menubarSubContent(sub);
  if (trigger) {
    setAttribute(trigger, "role", "menuitem");
    setAttribute(trigger, "aria-haspopup", "menu");
    setAttribute(trigger, "aria-expanded", String(open));
    setAttribute(trigger, "data-state", open ? "open" : "closed");
    if (open && content) {
      const host = menubarContentHost(content);
      setAttribute(trigger, "aria-controls", ensureMenubarId(host, "sub-content", nextId));
    } else trigger.removeAttribute("aria-controls");
  }
  if (content) syncContent(content, trigger, open, "right");
}

function syncCheckable(root: HTMLElement) {
  for (const checkbox of menubarElements(root, "aria-menubar-checkbox-item")) {
    setAttribute(checkbox, "aria-checked", String(checkbox.hasAttribute("checked")));
    setAttribute(checkbox, "data-state", checkbox.hasAttribute("checked") ? "checked" : "unchecked");
  }
  for (const group of menubarElements(root, "aria-menubar-radio-group")) {
    if (!group.hasAttribute("data-default-value-applied")) {
      group.setAttribute("data-default-value-applied", "");
      if (!group.hasAttribute("value")) {
        const initial = group.getAttribute("default-value") ?? group.getAttribute("defaultvalue");
        if (initial) group.setAttribute("value", initial);
      }
    }
    setAttribute(group, "role", "group");
    const value = group.getAttribute("value") ?? "";
    for (const item of Array.from(group.querySelectorAll<HTMLElement>("aria-menubar-radio-item"))) {
      setBoolean(item, "checked", item.getAttribute("value") === value);
      setAttribute(item, "aria-checked", String(item.hasAttribute("checked")));
      setAttribute(item, "data-state", item.hasAttribute("checked") ? "checked" : "unchecked");
    }
  }
  for (const indicator of menubarElements(root, "aria-menubar-item-indicator")) {
    const owner = indicator.closest("aria-menubar-checkbox-item, aria-menubar-radio-item");
    indicator.hidden = !owner?.hasAttribute("checked");
  }
}

export function syncMenubarRoot(root: HTMLElement) {
  const current = state(root);
  if (current.syncing) return;
  current.syncing = true;
  try {
    if (!root.hasAttribute("role")) setAttribute(root, "role", "menubar");
    setAttribute(root, "data-orientation", root.getAttribute("orientation") ?? "horizontal");
    const value = rootValue(root, current);
    const triggers = menubarTriggers(root);
    for (const [index, menu] of menubarMenus(root).entries()) {
      const trigger = menubarMenuTrigger(menu);
      const content = menubarMenuContent(menu);
      if (!trigger) continue;
      const triggerValue = menubarTriggerValue(trigger);
      const open = value === triggerValue;
      setAttribute(trigger, "role", "menuitem");
      setAttribute(trigger, "aria-haspopup", "menu");
      setAttribute(trigger, "aria-expanded", String(open));
      setAttribute(trigger, "data-state", open ? "open" : "closed");
      setAttribute(trigger, "data-menubar-value", triggerValue);
      setAttribute(trigger, "tabindex", index === 0 ? "0" : "-1");
      ensureMenubarId(trigger, "trigger", nextId);
      if (open && content) setAttribute(trigger, "aria-controls", ensureMenubarId(menubarContentHost(content), "content", nextId));
      else trigger.removeAttribute("aria-controls");
      if (content) syncContent(content, trigger, open, "bottom");
    }
    if (triggers.some((trigger) => trigger === root.ownerDocument.activeElement)) {
      for (const trigger of triggers) setAttribute(trigger, "tabindex", trigger === root.ownerDocument.activeElement ? "0" : "-1");
    }
    for (const sub of menubarElements(root, "aria-menubar-sub")) syncSub(sub);
    syncCheckable(root);
  } finally {
    current.syncing = false;
  }
}

export function syncMenubarAround(element: HTMLElement) {
  const root = element.matches("aria-menubar") ? element : menubarRoot(element);
  if (root) syncMenubarRoot(root);
}

export function syncMenubarStandalone(element: HTMLElement) {
  const part = menubarPartName(element);
  if (part === "Trigger" || part === "SubTrigger") {
    if (!element.hasAttribute("role")) setAttribute(element, "role", "menuitem");
    setAttribute(element, "aria-haspopup", "menu");
  }
  if (part === "SubContent" && !element.hasAttribute("role")) setAttribute(element, "role", "menu");
  if (part === "RadioGroup" && !element.hasAttribute("role")) setAttribute(element, "role", "group");
}

export function enabledMenubarItems(content: HTMLElement) {
  return menubarEnabledItems(content);
}

export function menubarSearchText(item: HTMLElement) {
  return menubarItemText(item);
}
