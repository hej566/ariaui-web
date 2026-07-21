import { computePrePositionStyle } from "@ariaui-web/position";
import {
  ensureNavigationMenuId,
  navigationMenuContentHost,
  navigationMenuContentItems,
  navigationMenuElements,
  navigationMenuEnabledContentItems,
  navigationMenuEntries,
  navigationMenuEntryValue,
  navigationMenuItemContent,
  navigationMenuItemText,
  navigationMenuItemTrigger,
  navigationMenuOwningTrigger,
  navigationMenuPartName,
  navigationMenuRoot,
  navigationMenuSubContent,
  navigationMenuSubTrigger,
  navigationMenuTopLevelItems,
  navigationMenuTopLevelLink,
} from "./navigation-menu-dom";
import { stopNavigationMenuPositioning } from "./navigation-menu-position";

type NavigationMenuState = {
  syncing: boolean;
};

type NavigationMenuTypeaheadState = {
  at: number;
  value: string;
};

const rootStates = new WeakMap<HTMLElement, NavigationMenuState>();
const typeaheadStates = new WeakMap<HTMLElement, NavigationMenuTypeaheadState>();
let navigationMenuId = 0;
const nextId = () => ++navigationMenuId;

function rootState(root: HTMLElement) {
  let state = rootStates.get(root);
  if (!state) {
    state = { syncing: false };
    rootStates.set(root, state);
  }
  return state;
}

function setAttribute(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setBoolean(element: Element, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function removeAttribute(element: Element, name: string) {
  if (element.hasAttribute(name)) element.removeAttribute(name);
}

function setStyle(element: HTMLElement, property: "left" | "position" | "top" | "visibility", value: string) {
  if (element.style[property] !== value) element.style[property] = value;
}

function addClass(element: Element, token: string) {
  if (!element.classList.contains(token)) element.classList.add(token);
}

function setHidden(element: HTMLElement, value: boolean) {
  if (element.hidden !== value) element.hidden = value;
}

function forceMounted(element: Element) {
  return element.hasAttribute("force-mount") || element.hasAttribute("forcemount");
}

function prePositionHiddenContent(host: HTMLElement) {
  const style = computePrePositionStyle(false, "always");
  setStyle(host, "position", style.position);
  if (style.left !== undefined) setStyle(host, "left", `${style.left}px`);
  if (style.top !== undefined) setStyle(host, "top", `${style.top}px`);
  if (style.visibility) setStyle(host, "visibility", style.visibility);
}

function rootValue(root: HTMLElement) {
  return root.getAttribute("value") ?? "";
}

function currentRootContent(root: HTMLElement) {
  const value = rootValue(root);
  for (const item of navigationMenuTopLevelItems(root)) {
    const trigger = navigationMenuItemTrigger(item);
    if (trigger && navigationMenuEntryValue(trigger) === value) {
      return navigationMenuItemContent(item);
    }
  }
  return null;
}

export function currentNavigationMenuTrigger(root: HTMLElement) {
  const value = rootValue(root);
  return navigationMenuEntries(root)
    .find((entry) => entry.matches("aria-navigation-menu-trigger") && navigationMenuEntryValue(entry) === value) ?? null;
}

function resetNavigationMenuContent(content: HTMLElement, host: HTMLElement) {
  typeaheadStates.delete(content);
  setNavigationMenuActiveItem(content, null, false);
  content.scrollLeft = 0;
  content.scrollTop = 0;
  if (host !== content) {
    host.scrollLeft = 0;
    host.scrollTop = 0;
  }
  for (const sub of content.querySelectorAll<HTMLElement>("aria-navigation-menu-sub[open]")) {
    sub.removeAttribute("open");
  }
}

function syncContent(content: HTMLElement, trigger: HTMLElement | null, open: boolean, kind: "content" | "subcontent") {
  const host = navigationMenuContentHost(content);
  if (open && (host.hidden || host.style.visibility !== "visible")) prePositionHiddenContent(host);

  if (host !== content) {
    for (const token of content.classList) addClass(host, token);
    removeAttribute(content, "role");
    setHidden(content, false);
  }

  const marker = kind === "content" ? "data-ariaui-navigation-menu-content" : "data-ariaui-navigation-menu-subcontent";
  const side = kind === "content" ? "bottom" : "right";
  const keepMounted = forceMounted(content) || forceMounted(host);

  setAttribute(host, "role", "menu");
  setAttribute(host, "tabindex", "-1");
  setAttribute(host, "data-state", open ? "open" : "closed");
  if (!host.hasAttribute("data-side")) setAttribute(host, "data-side", side);
  if (!host.hasAttribute("data-align")) setAttribute(host, "data-align", "start");
  setBoolean(host, marker, true);
  setBoolean(content, marker, true);
  setHidden(host, !open && !keepMounted);
  if (open) {
    removeAttribute(host, "aria-hidden");
  } else {
    setAttribute(host, "aria-hidden", "true");
    stopNavigationMenuPositioning(host);
    resetNavigationMenuContent(content, host);
  }

  if (trigger) {
    ensureNavigationMenuId(trigger, "trigger", nextId);
    setAttribute(host, "id", ensureNavigationMenuId(host, kind, nextId));
    setAttribute(host, "aria-labelledby", trigger.id);
  }

  const activeItemId = open ? host.getAttribute("aria-activedescendant") : null;
  for (const item of navigationMenuContentItems(content)) {
    const part = navigationMenuPartName(item);
    const active = item.id === activeItemId;
    setAttribute(item, "role", "menuitem");
    setAttribute(item, "tabindex", active ? "0" : "-1");
    setBoolean(item, "data-highlighted", active);
    if (item.hasAttribute("active")) setAttribute(item, "aria-current", "page");
    else removeAttribute(item, "aria-current");

    if (item.hasAttribute("disabled")) {
      setAttribute(item, "aria-disabled", "true");
      setBoolean(item, "data-disabled", true);
    } else {
      removeAttribute(item, "aria-disabled");
      setBoolean(item, "data-disabled", false);
    }

    const textValue = item.getAttribute("text-value") || item.getAttribute("textvalue");
    if (textValue) setAttribute(item, "data-text-value", textValue);

    if (part !== "SubTrigger") {
      removeAttribute(item, "aria-haspopup");
      removeAttribute(item, "aria-expanded");
      removeAttribute(item, "aria-controls");
    }
  }
}

function syncSub(sub: HTMLElement) {
  if (!sub.hasAttribute("data-default-open-applied")) {
    sub.setAttribute("data-default-open-applied", "");
    if (sub.hasAttribute("default-open") || sub.hasAttribute("defaultopen")) sub.setAttribute("open", "");
  }

  const trigger = navigationMenuSubTrigger(sub);
  const content = navigationMenuSubContent(sub);
  const open = sub.hasAttribute("open");

  if (trigger) {
    setAttribute(trigger, "role", "menuitem");
    setAttribute(trigger, "tabindex", "-1");
    setAttribute(trigger, "aria-haspopup", "menu");
    setAttribute(trigger, "aria-expanded", String(open));
    setAttribute(trigger, "data-state", open ? "open" : "closed");
    if (content) {
      setAttribute(trigger, "aria-controls", ensureNavigationMenuId(navigationMenuContentHost(content), "sub-content", nextId));
    }
  }

  if (content) syncContent(content, trigger, open, "subcontent");
}

export function syncNavigationMenuRoot(root: HTMLElement) {
  const state = rootState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    if (!root.hasAttribute("role")) setAttribute(root, "role", "navigation");
    setBoolean(root, "open", Boolean(rootValue(root)));
    const list = root.querySelector<HTMLElement>("aria-navigation-menu-list");
    if (list) {
      setAttribute(list, "role", "menubar");
      setAttribute(list, "data-orientation", root.getAttribute("orientation") ?? "horizontal");
    }

    const value = rootValue(root);
    const entries = navigationMenuEntries(root);
    const activeEntry = entries.includes(root.ownerDocument.activeElement as HTMLElement)
      ? root.ownerDocument.activeElement as HTMLElement
      : entries[0] ?? null;

    for (const item of navigationMenuTopLevelItems(root)) {
      if (!item.hasAttribute("role")) setAttribute(item, "role", "none");
      const trigger = navigationMenuItemTrigger(item);
      const link = navigationMenuTopLevelLink(item);
      const content = navigationMenuItemContent(item);
      const entry = trigger ?? link;
      const entryValue = entry ? navigationMenuEntryValue(entry) : "";
      const triggerValue = trigger ? navigationMenuEntryValue(trigger) : "";
      const open = Boolean(entry && value === entryValue);
      setAttribute(item, "data-state", open ? "open" : "closed");

      if (trigger) {
        setAttribute(trigger, "role", "menuitem");
        setAttribute(trigger, "aria-haspopup", "menu");
        setAttribute(trigger, "aria-expanded", String(open));
        setAttribute(trigger, "data-state", open ? "open" : "closed");
        setAttribute(trigger, "data-ariaui-navigation-menu-value", triggerValue);
        setAttribute(trigger, "tabindex", activeEntry === trigger ? "0" : "-1");
        ensureNavigationMenuId(trigger, "trigger", nextId);
        if (content) {
          const host = navigationMenuContentHost(content);
          setAttribute(trigger, "aria-controls", ensureNavigationMenuId(host, "content", nextId));
          syncContent(content, trigger, open, "content");
        }
      } else if (link) {
        setAttribute(link, "role", "menuitem");
        setAttribute(link, "tabindex", activeEntry === link ? "0" : "-1");
        if (link.hasAttribute("active")) setAttribute(link, "aria-current", "page");
        else removeAttribute(link, "aria-current");
      }
    }

    for (const sub of navigationMenuElements(root, "aria-navigation-menu-sub")) {
      syncSub(sub);
    }
  } finally {
    state.syncing = false;
  }
}

export function syncNavigationMenuAround(element: HTMLElement) {
  const root = element.matches("aria-navigation-menu") ? element : navigationMenuRoot(element);
  if (root) syncNavigationMenuRoot(root);
  else syncNavigationMenuStandalone(element);
}

export function syncNavigationMenuStandalone(element: HTMLElement) {
  const part = navigationMenuPartName(element);
  if (part === "List" && !element.hasAttribute("role")) setAttribute(element, "role", "menubar");
  if (part === "Content" && !element.hasAttribute("role")) setAttribute(element, "role", "menu");
  if (part === "SubContent" && !element.hasAttribute("role")) setAttribute(element, "role", "menu");
  if (part === "Trigger" || part === "SubTrigger") {
    if (!element.hasAttribute("role")) setAttribute(element, "role", "menuitem");
    setAttribute(element, "aria-haspopup", "menu");
    if (!element.hasAttribute("aria-expanded")) setAttribute(element, "aria-expanded", "false");
  }
}

export function setNavigationMenuValue(
  root: HTMLElement,
  value: string,
  mode: "hover" | "click" | "focus" | null,
  source: Element,
) {
  const previousOpen = root.hasAttribute("open");
  const previousValue = rootValue(root);
  if (value) root.setAttribute("value", value);
  else removeAttribute(root, "value");
  if (mode) root.setAttribute("data-open-mode", mode);
  else removeAttribute(root, "data-open-mode");
  setBoolean(root, "open", Boolean(value));
  syncNavigationMenuRoot(root);
  if (previousValue !== value) {
    root.dispatchEvent(new CustomEvent("valuechange", { bubbles: true, detail: { source, value } }));
  }
  if (previousOpen !== root.hasAttribute("open")) {
    root.dispatchEvent(new CustomEvent("openchange", { bubbles: true, detail: { open: root.hasAttribute("open"), source } }));
  }
}

export function closeNavigationMenu(root: HTMLElement, source: Element, restoreFocus = false) {
  const trigger = currentNavigationMenuTrigger(root);
  setNavigationMenuValue(root, "", null, source);
  if (restoreFocus) trigger?.focus({ preventScroll: true });
}

export function closeNavigationMenuSubmenus(scope: HTMLElement) {
  const wrapper = navigationMenuContentHost(scope);
  const content = wrapper.matches("aria-navigation-menu-content, aria-navigation-menu-sub-content")
    ? wrapper
    : scope.closest<HTMLElement>("aria-navigation-menu-content, aria-navigation-menu-sub-content");
  const root = navigationMenuRoot(scope);
  const queryRoot = content ?? root ?? scope;
  for (const sub of queryRoot.querySelectorAll<HTMLElement>("aria-navigation-menu-sub[open]")) {
    removeAttribute(sub, "open");
  }
  if (root) syncNavigationMenuRoot(root);
}

export function setNavigationMenuActiveItem(content: HTMLElement, item: HTMLElement | null, focus = true) {
  for (const candidate of navigationMenuContentItems(content)) {
    const active = candidate === item;
    setAttribute(candidate, "tabindex", active ? "0" : "-1");
    setBoolean(candidate, "data-highlighted", active);
  }

  const host = navigationMenuContentHost(content);
  if (item) {
    ensureNavigationMenuId(item, "item", nextId);
    setAttribute(host, "aria-activedescendant", item.id);
    if (focus) item.focus({ preventScroll: true });
  } else {
    removeAttribute(host, "aria-activedescendant");
  }
}

export function enabledNavigationMenuItems(content: HTMLElement) {
  return navigationMenuEnabledContentItems(content);
}

export function navigationMenuSearchText(item: HTMLElement) {
  return navigationMenuItemText(item);
}

export function nextNavigationMenuTypeahead(scope: HTMLElement, key: string) {
  const now = Date.now();
  const previous = typeaheadStates.get(scope);
  const normalizedKey = key.toLowerCase();
  const recent = previous && now - previous.at < 500;
  const repeated = recent && Array.from(previous.value).every((character) => character === normalizedKey);
  const value = recent && !repeated ? previous.value + normalizedKey : normalizedKey;
  typeaheadStates.set(scope, { at: now, value });
  return value;
}

export function navigationMenuCurrentContent(root: HTMLElement) {
  return currentRootContent(root);
}

export function navigationMenuForceSyncRoot(root: HTMLElement) {
  syncNavigationMenuRoot(root);
}
