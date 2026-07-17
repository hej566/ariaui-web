import {
  menubarContentHost,
  menubarContentWrapper,
  menubarEnabledItems,
  menubarItemText,
  menubarItems,
  menubarMenu,
  menubarMenuContent,
  menubarMenuTrigger,
  menubarMenus,
  menubarPartName,
  menubarRoot,
  menubarSub,
  menubarSubContent,
  menubarSubTrigger,
  menubarTriggerValue,
  menubarTriggers,
} from "./menubar-dom";
import { positionMenubarContent } from "./menubar-position";
import { menubarIsControlled, setMenubarActiveItem, syncMenubarRoot } from "./menubar-sync";

const typeahead = new WeakMap<HTMLElement, { at: number; value: string }>();

function dispatchLifecycle(content: HTMLElement | null, type: string, source: Element) {
  if (!content) return true;
  return content.dispatchEvent(new CustomEvent(type, {
    cancelable: true,
    detail: { source },
  }));
}

function currentMenubarContent(root: HTMLElement) {
  const value = root.getAttribute("value") ?? "";
  const menu = menubarMenus(root).find((candidate) => {
    const trigger = menubarMenuTrigger(candidate);
    return trigger && menubarTriggerValue(trigger) === value;
  });
  return menu ? menubarMenuContent(menu) : null;
}

function isSpace(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function isCheckable(element: HTMLElement) {
  return ["menuitemcheckbox", "menuitemradio", "checkbox", "radio", "switch"].includes(element.getAttribute("role") ?? "");
}

function handleStandaloneClick(element: HTMLElement, event: Event) {
  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (isCheckable(element)) {
    if (element.hasAttribute("indeterminate")) {
      element.removeAttribute("indeterminate");
      element.setAttribute("checked", "");
    } else {
      element.toggleAttribute("checked", !element.hasAttribute("checked"));
    }
  } else if (element.hasAttribute("pressed")) {
    element.toggleAttribute("pressed", !element.hasAttribute("pressed"));
  }
}

function dispatchValueChange(root: HTMLElement, value: string, source: Element) {
  root.dispatchEvent(new CustomEvent("valuechange", { bubbles: true, detail: { source, value } }));
}

function setRootValue(root: HTMLElement, value: string, source: Element) {
  if (!menubarIsControlled(root)) root.setAttribute("value", value);
  dispatchValueChange(root, value, source);
  syncMenubarRoot(root);
}

function closeSubmenus(root: HTMLElement) {
  for (const sub of root.querySelectorAll<HTMLElement>("aria-menubar-sub[open]")) sub.removeAttribute("open");
}

export function closeMenubar(root: HTMLElement, source: Element, restoreFocus = false) {
  const current = root.getAttribute("value") ?? "";
  const trigger = menubarTriggers(root).find((candidate) => menubarTriggerValue(candidate) === current) ?? null;
  const content = currentMenubarContent(root);
  closeSubmenus(root);
  setRootValue(root, "", source);
  if (restoreFocus && dispatchLifecycle(content, "closeautofocus", source)) trigger?.focus({ preventScroll: true });
}

export function dismissMenubarFromOutside(root: HTMLElement, source: Element, type: "focusoutside" | "pointerdownoutside") {
  const openSubContent = Array.from(root.querySelectorAll<HTMLElement>("aria-menubar-sub[open] aria-menubar-sub-content")).at(-1) ?? null;
  const content = openSubContent ?? currentMenubarContent(root);
  const allowDismiss = dispatchLifecycle(content, type, source);
  const allowInteractionDismiss = dispatchLifecycle(content, "interactoutside", source);
  if (allowDismiss && allowInteractionDismiss) closeMenubar(root, source);
}

function openMenu(trigger: HTMLElement, focusIntent: "first" | "last" | "none" = "none") {
  const root = menubarRoot(trigger);
  const menu = menubarMenu(trigger);
  if (!root || !menu) return;
  setRootValue(root, menubarTriggerValue(trigger), trigger);
  if (root.getAttribute("value") !== menubarTriggerValue(trigger)) return;
  const content = menubarMenuContent(menu);
  if (!content) return;
  positionMenubarContent(trigger, menubarContentHost(content), "content");
  if (focusIntent !== "none") {
    if (!dispatchLifecycle(content, "entryfocus", trigger)) return;
    const items = menubarEnabledItems(content);
    setMenubarActiveItem(content, focusIntent === "last" ? items.at(-1) ?? null : items[0] ?? null);
  }
}

function openSubmenu(trigger: HTMLElement, focus = false) {
  const sub = menubarSub(trigger);
  if (!sub) return;
  sub.setAttribute("open", "");
  const root = menubarRoot(trigger);
  if (root) syncMenubarRoot(root);
  const content = menubarSubContent(sub);
  if (!content) return;
  positionMenubarContent(trigger, menubarContentHost(content), "subcontent");
  if (focus && dispatchLifecycle(content, "entryfocus", trigger)) {
    setMenubarActiveItem(content, menubarEnabledItems(content)[0] ?? null);
  }
}

function closeSubmenu(sub: HTMLElement, focus = true) {
  sub.removeAttribute("open");
  const root = menubarRoot(sub);
  if (root) syncMenubarRoot(root);
  if (focus) menubarSubTrigger(sub)?.focus({ preventScroll: true });
}

function focusTrigger(root: HTMLElement, index: number) {
  const triggers = menubarTriggers(root);
  const trigger = triggers[index];
  if (!trigger) return;
  for (const candidate of triggers) candidate.setAttribute("tabindex", candidate === trigger ? "0" : "-1");
  trigger.focus({ preventScroll: true });
  if (root.getAttribute("value")) openMenu(trigger, "none");
}

function moveTrigger(trigger: HTMLElement, direction: number) {
  const root = menubarRoot(trigger);
  if (!root) return false;
  const triggers = menubarTriggers(root).filter((candidate) => !candidate.hasAttribute("disabled"));
  const index = triggers.indexOf(trigger);
  if (index < 0) return false;
  let next = index + direction;
  if (next < 0 || next >= triggers.length) {
    if (!root.hasAttribute("loop")) return false;
    next = (next + triggers.length) % triggers.length;
  }
  focusTrigger(root, menubarTriggers(root).indexOf(triggers[next]!));
  return true;
}

function moveFromItemToTrigger(item: HTMLElement, direction: number) {
  const menu = menubarMenu(item);
  const trigger = menu ? menubarMenuTrigger(menu) : null;
  return trigger ? moveTrigger(trigger, direction) : false;
}

function moveItem(item: HTMLElement, direction: number) {
  const content = menubarContentWrapper(item);
  if (!content) return;
  const items = menubarEnabledItems(content);
  const index = items.indexOf(item);
  let next = index + direction;
  const loop = content.hasAttribute("loop");
  if (next < 0 || next >= items.length) {
    if (!loop) return;
    next = (next + items.length) % items.length;
  }
  setMenubarActiveItem(content, items[next] ?? null);
}

function matchByTypeahead(scope: HTMLElement, candidates: HTMLElement[], key: string) {
  const now = Date.now();
  const previous = typeahead.get(scope);
  const normalizedKey = key.toLowerCase();
  const recent = previous && now - previous.at < 500;
  const repeated = recent && Array.from(previous.value).every((character) => character === normalizedKey);
  const value = recent && !repeated ? previous.value + normalizedKey : normalizedKey;
  typeahead.set(scope, { at: now, value });
  const active = candidates.indexOf(scope.ownerDocument.activeElement as HTMLElement);
  const ordered = candidates.slice(active + 1).concat(candidates.slice(0, active + 1));
  const exact = ordered.find((candidate) => menubarItemText(candidate) === value);
  const prefix = exact ?? ordered.find((candidate) => menubarItemText(candidate).startsWith(value));
  prefix?.focus({ preventScroll: true });
  const content = prefix ? menubarContentWrapper(prefix) : null;
  if (prefix && content) setMenubarActiveItem(content, prefix, false);
}

function selectItem(item: HTMLElement) {
  const root = menubarRoot(item);
  if (!root || item.hasAttribute("disabled")) return;
  const part = menubarPartName(item);
  if (part === "SubTrigger") {
    openSubmenu(item, false);
    return;
  }
  if (part === "CheckboxItem") {
    const checked = !item.hasAttribute("checked");
    item.toggleAttribute("checked", checked);
    item.dispatchEvent(new CustomEvent("checkedchange", { bubbles: true, detail: { checked, source: item } }));
  } else if (part === "RadioItem") {
    const group = item.closest<HTMLElement>("aria-menubar-radio-group");
    if (group) {
      const value = item.getAttribute("value") ?? "";
      group.setAttribute("value", value);
      group.dispatchEvent(new CustomEvent("valuechange", { bubbles: true, detail: { source: item, value } }));
    }
  } else {
    const selected = item.dispatchEvent(new CustomEvent("select", {
      bubbles: true,
      cancelable: true,
      detail: { source: item, value: item.getAttribute("value") ?? item.textContent?.trim() ?? "" },
    }));
    if (!selected) return;
  }
  syncMenubarRoot(root);
  closeMenubar(root, item, true);
}

export function handleMenubarClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) return;
  if (!menubarRoot(element)) {
    handleStandaloneClick(element, event);
    return;
  }
  const part = menubarPartName(element);
  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (part === "Trigger") {
    event.preventDefault();
    element.focus({ preventScroll: true });
    const root = menubarRoot(element);
    if (root?.getAttribute("value") === menubarTriggerValue(element)) closeMenubar(root, element, true);
    else openMenu(element, "none");
  } else if (["Item", "CheckboxItem", "RadioItem", "SubTrigger"].includes(part)) {
    event.preventDefault();
    event.stopPropagation();
    if (part === "SubTrigger") element.focus({ preventScroll: true });
    selectItem(element);
  }
}

export function handleMenubarKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) return;
  const part = menubarPartName(element);
  const root = menubarRoot(element);
  if (!root) {
    if (element.hasAttribute("disabled")) {
      event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      element.click();
    } else if (isSpace(event)) {
      event.preventDefault();
    }
    return;
  }
  const rtl = root.getAttribute("dir") === "rtl";
  const forward = rtl ? "ArrowLeft" : "ArrowRight";
  const backward = rtl ? "ArrowRight" : "ArrowLeft";

  if (part === "Trigger") {
    if (event.key === forward || event.key === backward) {
      if (moveTrigger(element, event.key === forward ? 1 : -1)) event.preventDefault();
      return;
    }
    if (event.key === "Tab" && root.getAttribute("value")) {
      if (moveTrigger(element, event.shiftKey ? -1 : 1)) event.preventDefault();
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusTrigger(root, event.key === "Home" ? 0 : menubarTriggers(root).length - 1);
      return;
    }
    if (event.key === "Enter" || isSpace(event) || event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(element, event.key === "ArrowUp" ? "last" : "first");
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      matchByTypeahead(root, menubarTriggers(root), event.key);
      return;
    }
  }

  if (["Item", "CheckboxItem", "RadioItem", "SubTrigger"].includes(part)) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      moveItem(element, event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      const content = menubarContentWrapper(element);
      if (content) {
        event.preventDefault();
        event.stopPropagation();
        const items = menubarEnabledItems(content);
        setMenubarActiveItem(content, event.key === "Home" ? items[0] ?? null : items.at(-1) ?? null);
      }
      return;
    }
    if (part === "SubTrigger" && event.key === forward) {
      event.preventDefault();
      event.stopPropagation();
      openSubmenu(element, true);
      return;
    }
    const content = menubarContentWrapper(element);
    if (content?.matches("aria-menubar-sub-content") && event.key === backward) {
      const sub = menubarSub(content);
      if (sub) {
        event.preventDefault();
        event.stopPropagation();
        closeSubmenu(sub, true);
      }
      return;
    }
    if (event.key === forward || event.key === backward) {
      if (moveFromItemToTrigger(element, event.key === forward ? 1 : -1)) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    if (event.key === "Enter" || isSpace(event)) {
      event.preventDefault();
      event.stopPropagation();
      selectItem(element);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (content) matchByTypeahead(content, menubarEnabledItems(content), event.key);
      return;
    }
  }

  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    const content = menubarContentWrapper(element) ?? currentMenubarContent(root);
    if (dispatchLifecycle(content, "escapekeydown", element)) closeMenubar(root, element, true);
  }
}

export function handleMenubarMouseOver(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const trigger = event.target.closest<HTMLElement>("aria-menubar-trigger");
  if (trigger && menubarRoot(trigger) === root && root.getAttribute("value")) {
    openMenu(trigger, "none");
    return;
  }
  const item = event.target.closest<HTMLElement>("aria-menubar-item, aria-menubar-checkbox-item, aria-menubar-radio-item, aria-menubar-sub-trigger");
  if (!item || menubarRoot(item) !== root || item.hasAttribute("disabled")) return;
  const content = menubarContentWrapper(item);
  if (content) setMenubarActiveItem(content, item, false);
  const activeSub = menubarSub(item);
  for (const sub of root.querySelectorAll<HTMLElement>("aria-menubar-sub[open]")) {
    if (sub !== activeSub) sub.removeAttribute("open");
  }
  if (menubarPartName(item) === "SubTrigger") openSubmenu(item, false);
  else syncMenubarRoot(root);
}

export function handleMenubarFocusIn(root: HTMLElement, event: FocusEvent) {
  if (!(event.target instanceof HTMLElement)) return;
  const triggers = menubarTriggers(root);
  if (triggers.includes(event.target)) {
    for (const trigger of triggers) {
      trigger.setAttribute("tabindex", trigger === event.target ? "0" : "-1");
      trigger.toggleAttribute("data-highlighted", trigger === event.target);
    }
  }
  const content = menubarContentWrapper(event.target);
  if (content && menubarItems(content).includes(event.target)) setMenubarActiveItem(content, event.target, false);
}
