import {
  navigationMenuContentHost,
  navigationMenuContentWrapper,
  navigationMenuEnabledContentItems,
  navigationMenuEntries,
  navigationMenuEntryValue,
  navigationMenuItem,
  navigationMenuItemContent,
  navigationMenuItemText,
  navigationMenuItemTrigger,
  navigationMenuOwningTrigger,
  navigationMenuPartName,
  navigationMenuRoot,
  navigationMenuSub,
  navigationMenuSubContent,
  navigationMenuSubTrigger,
} from "./navigation-menu-dom";
import { positionNavigationMenuContent } from "./navigation-menu-position";
import {
  closeNavigationMenu,
  closeNavigationMenuSubmenus,
  currentNavigationMenuTrigger,
  enabledNavigationMenuItems,
  navigationMenuCurrentContent,
  nextNavigationMenuTypeahead,
  setNavigationMenuActiveItem,
  setNavigationMenuValue,
  syncNavigationMenuRoot,
} from "./navigation-menu-sync";

function isSpace(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function isTypeaheadKey(event: KeyboardEvent) {
  return event.key.length === 1 && /^[a-z0-9]$/i.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey;
}

function entryIndex(root: HTMLElement, entry: HTMLElement) {
  return navigationMenuEntries(root).indexOf(entry);
}

function openTrigger(trigger: HTMLElement, mode: "hover" | "click" | "focus", focusIntent: "first" | "last" | "none" = "none") {
  const root = navigationMenuRoot(trigger);
  const item = navigationMenuItem(trigger);
  const content = item ? navigationMenuItemContent(item) : null;
  if (!root || !item || !content || trigger.hasAttribute("disabled")) return;

  const value = navigationMenuEntryValue(trigger);
  setNavigationMenuValue(root, value, mode, trigger);
  if (root.getAttribute("value") !== value) return;

  positionNavigationMenuContent(trigger, navigationMenuContentHost(content), "content");
  if (focusIntent !== "none") {
    const items = enabledNavigationMenuItems(content);
    setNavigationMenuActiveItem(content, focusIntent === "last" ? items.at(-1) ?? null : items[0] ?? null);
  }
}

function openTopLevelLink(link: HTMLElement, mode: "hover" | "focus") {
  const root = navigationMenuRoot(link);
  const item = navigationMenuItem(link);
  if (!root || !item || navigationMenuContentWrapper(link) || link.hasAttribute("disabled")) return;

  setNavigationMenuValue(root, navigationMenuEntryValue(link), mode, link);
}

function openSubmenu(trigger: HTMLElement, focus = false) {
  const sub = navigationMenuSub(trigger);
  if (!sub || trigger.hasAttribute("disabled")) return;
  const parentContent = navigationMenuContentWrapper(trigger);
  if (parentContent) {
    for (const sibling of parentContent.querySelectorAll<HTMLElement>("aria-navigation-menu-sub[open]")) {
      if (sibling !== sub) sibling.removeAttribute("open");
    }
  }
  sub.setAttribute("open", "");
  const root = navigationMenuRoot(trigger);
  if (root) syncNavigationMenuRoot(root);
  const content = navigationMenuSubContent(sub);
  if (!content) return;
  positionNavigationMenuContent(trigger, navigationMenuContentHost(content), "subcontent");
  if (focus) {
    setNavigationMenuActiveItem(content, navigationMenuEnabledContentItems(content)[0] ?? null);
  }
}

function closeSubmenu(sub: HTMLElement, focus = true) {
  sub.removeAttribute("open");
  const root = navigationMenuRoot(sub);
  if (root) syncNavigationMenuRoot(root);
  if (focus) navigationMenuSubTrigger(sub)?.focus({ preventScroll: true });
}

function focusEntry(root: HTMLElement, index: number) {
  const entries = navigationMenuEntries(root);
  const entry = entries[index];
  if (!entry) return;

  for (const candidate of entries) {
    candidate.setAttribute("tabindex", candidate === entry ? "0" : "-1");
  }
  entry.focus({ preventScroll: true });

  syncFocusedEntryWithBarState(root, entry);
}

function moveEntry(entry: HTMLElement, direction: number) {
  const root = navigationMenuRoot(entry);
  if (!root) return false;
  const entries = navigationMenuEntries(root).filter((candidate) => !candidate.hasAttribute("disabled"));
  const index = entries.indexOf(entry);
  if (index < 0 || entries.length === 0) return false;
  const next = (index + direction + entries.length) % entries.length;
  focusEntry(root, entryIndex(root, entries[next]!));
  return true;
}

function moveFromContentToTrigger(item: HTMLElement, direction: number) {
  const content = navigationMenuContentWrapper(item);
  const trigger = content?.matches("aria-navigation-menu-content") ? navigationMenuOwningTrigger(content) : null;
  return trigger ? moveEntry(trigger, direction) : false;
}

function moveContentItem(item: HTMLElement, direction: number) {
  const content = navigationMenuContentWrapper(item);
  if (!content) return;
  const items = navigationMenuEnabledContentItems(content);
  const index = items.indexOf(item);
  const next = (index + direction + items.length) % items.length;
  setNavigationMenuActiveItem(content, items[next] ?? null);
}

function matchByTypeahead(scope: HTMLElement, candidates: HTMLElement[], key: string) {
  const value = nextNavigationMenuTypeahead(scope, key);
  const activeIndex = candidates.indexOf(scope.ownerDocument.activeElement as HTMLElement);
  const ordered = value.length > 1 && activeIndex >= 0
    ? candidates.slice(activeIndex).concat(candidates.slice(0, activeIndex))
    : candidates.slice(activeIndex + 1).concat(candidates.slice(0, activeIndex + 1));
  const exact = ordered.find((candidate) => navigationMenuItemText(candidate) === value);
  const match = exact ?? ordered.find((candidate) => navigationMenuItemText(candidate).startsWith(value));
  match?.focus({ preventScroll: true });
  const content = match ? navigationMenuContentWrapper(match) : null;
  if (match && content) setNavigationMenuActiveItem(content, match, false);
}

function rootDirection(root: HTMLElement) {
  const rtl = root.getAttribute("dir") === "rtl";
  return {
    backward: rtl ? "ArrowRight" : "ArrowLeft",
    forward: rtl ? "ArrowLeft" : "ArrowRight",
  };
}

function closeForHoverLeave(root: HTMLElement, source: Element, relatedTarget: EventTarget | null) {
  if (root.getAttribute("data-open-mode") !== "hover") return;
  if (relatedTarget instanceof Node && source.contains(relatedTarget)) return;
  closeNavigationMenu(root, source);
}

function navigationMenuBarHasOpenItem(root: HTMLElement) {
  return Boolean(root.getAttribute("value"));
}

function syncFocusedEntryWithBarState(root: HTMLElement, entry: HTMLElement) {
  if (!navigationMenuBarHasOpenItem(root)) return;
  if (entry.matches("aria-navigation-menu-trigger")) openTrigger(entry, "focus", "none");
  else if (entry.matches("aria-navigation-menu-link") && !navigationMenuContentWrapper(entry)) openTopLevelLink(entry, "focus");
  else closeNavigationMenu(root, entry);
}

export function dismissNavigationMenuFromOutside(root: HTMLElement, source: Element) {
  if (!root.getAttribute("value")) return;
  closeNavigationMenu(root, source);
}

export function handleNavigationMenuClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) return;
  const part = navigationMenuPartName(element);
  const root = navigationMenuRoot(element);

  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (!root) return;

  if (part === "Trigger") {
    event.preventDefault();
    element.focus({ preventScroll: true });
    openTrigger(element, "click", "none");
    return;
  }

  if (part === "SubTrigger") {
    event.preventDefault();
    event.stopPropagation();
    element.focus({ preventScroll: true });
    openSubmenu(element, false);
  }
}

export function handleNavigationMenuKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) return;
  const root = navigationMenuRoot(element);
  const part = navigationMenuPartName(element);

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

  const { backward, forward } = rootDirection(root);

  if (part === "Trigger" || (part === "Link" && !navigationMenuContentWrapper(element))) {
    if (event.key === forward || event.key === backward) {
      if (moveEntry(element, event.key === forward ? 1 : -1)) event.preventDefault();
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const entries = navigationMenuEntries(root);
      focusEntry(root, event.key === "Home" ? 0 : entries.length - 1);
      return;
    }

    if (part === "Trigger" && (event.key === "Enter" || isSpace(event) || event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openTrigger(element, "focus", event.key === "ArrowUp" ? "last" : "first");
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeNavigationMenu(root, element, true);
      return;
    }

    if (isTypeaheadKey(event)) {
      matchByTypeahead(root, navigationMenuEntries(root), event.key);
    }
    return;
  }

  if (part === "Link" || part === "SubTrigger") {
    const content = navigationMenuContentWrapper(element);
    if (!content) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      moveContentItem(element, event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      const items = navigationMenuEnabledContentItems(content);
      setNavigationMenuActiveItem(content, event.key === "Home" ? items[0] ?? null : items.at(-1) ?? null);
      return;
    }

    if (part === "SubTrigger" && (event.key === forward || event.key === "Enter" || isSpace(event))) {
      event.preventDefault();
      event.stopPropagation();
      openSubmenu(element, true);
      return;
    }

    if (content.matches("aria-navigation-menu-sub-content") && event.key === backward) {
      const sub = navigationMenuSub(content);
      if (sub) {
        event.preventDefault();
        event.stopPropagation();
        closeSubmenu(sub, true);
      }
      return;
    }

    if (event.key === forward || event.key === backward) {
      if (moveFromContentToTrigger(element, event.key === forward ? 1 : -1)) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeNavigationMenu(root, element, true);
      return;
    }

    if (isTypeaheadKey(event)) {
      matchByTypeahead(content, navigationMenuEnabledContentItems(content), event.key);
    }
  }
}

export function handleNavigationMenuMouseOver(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) return;

  const trigger = event.target.closest<HTMLElement>("aria-navigation-menu-trigger");
  if (trigger && navigationMenuRoot(trigger) === root) {
    openTrigger(trigger, "hover", "none");
    return;
  }

  const subTrigger = event.target.closest<HTMLElement>("aria-navigation-menu-sub-trigger");
  if (subTrigger && navigationMenuRoot(subTrigger) === root) {
    const content = navigationMenuContentWrapper(subTrigger);
    if (content) setNavigationMenuActiveItem(content, subTrigger, false);
    openSubmenu(subTrigger, false);
    return;
  }

  const link = event.target.closest<HTMLElement>("aria-navigation-menu-link");
  if (link && navigationMenuRoot(link) === root && !navigationMenuContentWrapper(link)) {
    openTopLevelLink(link, "hover");
    return;
  }

  if (link && navigationMenuRoot(link) === root && navigationMenuContentWrapper(link)) {
    const content = navigationMenuContentWrapper(link);
    if (content) {
      closeNavigationMenuSubmenus(content);
      setNavigationMenuActiveItem(content, link, false);
    }
  }
}

export function handleNavigationMenuMouseOut(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const trigger = event.target.closest<HTMLElement>("aria-navigation-menu-trigger");
  if (trigger && navigationMenuRoot(trigger) === root) {
    closeForHoverLeave(root, trigger, event.relatedTarget);
    return;
  }

  const link = event.target.closest<HTMLElement>("aria-navigation-menu-link");
  if (link && navigationMenuRoot(link) === root && !navigationMenuContentWrapper(link)) {
    closeForHoverLeave(root, link, event.relatedTarget);
    return;
  }

  const content = event.target.closest<HTMLElement>("aria-navigation-menu-content");
  if (content && navigationMenuRoot(content) === root) {
    closeForHoverLeave(root, content, event.relatedTarget);
  }
}

export function handleNavigationMenuFocusIn(root: HTMLElement, event: FocusEvent) {
  if (!(event.target instanceof HTMLElement)) return;
  const entry = navigationMenuEntries(root).find((candidate) => candidate === event.target);
  if (!entry) return;

  for (const candidate of navigationMenuEntries(root)) {
    candidate.setAttribute("tabindex", candidate === entry ? "0" : "-1");
  }

  syncFocusedEntryWithBarState(root, entry);
}

export function positionCurrentNavigationMenu(root: HTMLElement) {
  const trigger = currentNavigationMenuTrigger(root);
  const content = navigationMenuCurrentContent(root);
  if (trigger && content && !navigationMenuContentHost(content).hidden) {
    positionNavigationMenuContent(trigger, navigationMenuContentHost(content), "content");
  }

  for (const sub of root.querySelectorAll<HTMLElement>("aria-navigation-menu-sub[open]")) {
    const subTrigger = navigationMenuSubTrigger(sub);
    const subContent = navigationMenuSubContent(sub);
    if (subTrigger && subContent && !navigationMenuContentHost(subContent).hidden) {
      positionNavigationMenuContent(subTrigger, navigationMenuContentHost(subContent), "subcontent");
    }
  }
}
