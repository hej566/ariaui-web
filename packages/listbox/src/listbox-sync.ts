import {
  ensureListboxId,
  isListboxDisabled,
  listboxElements,
  listboxItemValue,
  listboxMenu,
  listboxMenuItems,
  listboxMenuOptions,
  listboxPartName,
  listboxRoot,
  listboxRootContent,
  listboxRootLabel,
  listboxRootValues,
  listboxSelectionMode,
  listboxSubContent,
  listboxSubTrigger,
  listboxValuesFromAttribute,
  writeListboxRootValues,
} from "./listbox-dom";
import { syncListboxSubPosition } from "./listbox-position";

type ListboxSyncState = { defaultValueApplied: boolean; syncing: boolean };
const states = new WeakMap<Element, ListboxSyncState>();
const viewportObservers = new WeakMap<HTMLElement, ResizeObserver>();

function stateFor(root: Element) {
  let state = states.get(root);
  if (!state) {
    state = { defaultValueApplied: false, syncing: false };
    states.set(root, state);
  }
  return state;
}

function valuesFor(root: HTMLElement, state: ListboxSyncState) {
  if (!state.defaultValueApplied && !root.hasAttribute("value") && root.hasAttribute("default-value")) {
    writeListboxRootValues(root, listboxValuesFromAttribute(root.getAttribute("default-value")));
  }
  if (root.hasAttribute("value") || root.hasAttribute("default-value")) state.defaultValueApplied = true;
  return listboxRootValues(root);
}

function clearViewportConstraint(viewport: HTMLElement) {
  viewport.style.removeProperty("max-height");
  viewport.style.removeProperty("overflow-y");
}

export function syncListboxViewport(viewport: HTMLElement) {
  viewport.removeAttribute("role");
  viewport.setAttribute("data-listbox-viewport", "");
  viewportObservers.get(viewport)?.disconnect();
  viewportObservers.delete(viewport);

  const menu = listboxMenu(viewport);
  const count = Number(viewport.getAttribute("max-visible-items"));
  if (!menu || !Number.isFinite(count) || count <= 0) {
    clearViewportConstraint(viewport);
    return;
  }

  const first = listboxMenuOptions(menu)[0];
  const height = first?.getBoundingClientRect().height ?? 0;
  if (!first || height <= 0) {
    clearViewportConstraint(viewport);
    return;
  }

  viewport.style.maxHeight = `${height * count}px`;
  viewport.style.overflowY = "auto";

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => syncListboxViewport(viewport));
    observer.observe(first);
    viewportObservers.set(viewport, observer);
  }
}

export function cleanupListboxViewport(viewport: HTMLElement) {
  viewportObservers.get(viewport)?.disconnect();
  viewportObservers.delete(viewport);
}

export function syncListboxItem(item: HTMLElement, selected: Set<string>, active: boolean) {
  const part = listboxPartName(item);
  ensureListboxId(item, part === "SubTrigger" ? "sub-trigger" : "option");
  item.setAttribute("role", "option");
  item.setAttribute("tabindex", active ? "0" : "-1");
  item.setAttribute("data-active", String(active));

  if (isListboxDisabled(item)) {
    item.setAttribute("aria-disabled", "true");
    item.setAttribute("data-disabled", "");
  } else {
    item.removeAttribute("aria-disabled");
    item.removeAttribute("data-disabled");
  }

  if (part === "SubTrigger") {
    item.setAttribute("aria-selected", "false");
    item.setAttribute("aria-haspopup", "listbox");
    return;
  }

  const value = listboxItemValue(item);
  const isSelected = selected.has(value);
  item.setAttribute("data-value", value);
  item.setAttribute("aria-selected", String(isSelected));
  item.setAttribute("data-state", isSelected ? "checked" : "unchecked");
}

export function syncListboxMenu(
  menu: HTMLElement,
  mode: "single" | "multiple",
  selected: Set<string>,
  labelledBy: HTMLElement | null,
) {
  menu.setAttribute("role", "listbox");
  menu.setAttribute("tabindex", "0");
  menu.setAttribute("aria-multiselectable", String(mode === "multiple"));
  if (labelledBy) menu.setAttribute("aria-labelledby", ensureListboxId(labelledBy, "label"));

  let activeId = menu.getAttribute("aria-activedescendant");
  if (activeId) {
    const active = menu.ownerDocument.getElementById(activeId);
    if (!active || !listboxMenuItems(menu).includes(active)) {
      menu.removeAttribute("aria-activedescendant");
      activeId = null;
    }
  }
  for (const item of listboxMenuItems(menu)) {
    syncListboxItem(item, selected, Boolean(activeId && item.id === activeId));
  }
}

export function setListboxSubOpen(sub: HTMLElement, open: boolean) {
  if (open) sub.setAttribute("open", "");
  else sub.removeAttribute("open");
  sub.setAttribute("data-state", open ? "open" : "closed");
}

export function syncListboxSub(
  sub: HTMLElement,
  selected: Set<string>,
  mode: "single" | "multiple",
) {
  const trigger = listboxSubTrigger(sub);
  const content = listboxSubContent(sub);
  const ownerMenu = trigger ? listboxMenu(trigger) : null;
  if (!trigger || !content || !ownerMenu) {
    if (content) content.hidden = true;
    syncListboxSubPosition(sub);
    return;
  }

  const open = sub.hasAttribute("open");
  sub.removeAttribute("aria-expanded");
  sub.setAttribute("data-state", open ? "open" : "closed");
  trigger.setAttribute("role", "option");
  trigger.setAttribute("aria-selected", "false");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("data-state", open ? "open" : "closed");
  trigger.setAttribute("aria-controls", ensureListboxId(content, "sub-content"));
  trigger.setAttribute("aria-expanded", String(open));
  content.hidden = !open;
  content.setAttribute("data-state", open ? "open" : "closed");
  syncListboxMenu(content, mode, selected, trigger);
  syncListboxSubPosition(sub);
}

function syncGroups(root: HTMLElement) {
  for (const group of listboxElements(root, "aria-listbox-group")) {
    group.setAttribute("role", "group");
    const label = Array.from(group.querySelectorAll<HTMLElement>("aria-listbox-group-label")).find(
      (candidate) => candidate.closest("aria-listbox-group") === group,
    );
    if (label) group.setAttribute("aria-labelledby", ensureListboxId(label, "group-label"));
  }
}

export function syncListboxTreeFromRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    const values = valuesFor(root, state);
    const mode = listboxSelectionMode(root);
    const label = listboxRootLabel(root);
    const content = listboxRootContent(root);
    if (label) ensureListboxId(label, "label");
    if (content) syncListboxMenu(content, mode, new Set(values), label);
    syncGroups(root);
    for (const sub of listboxElements(root, "aria-listbox-sub")) {
      syncListboxSub(sub, new Set(values), mode);
    }
    for (const viewport of listboxElements(root, "aria-listbox-viewport")) {
      syncListboxViewport(viewport);
    }
  } finally {
    state.syncing = false;
  }
}

export function syncListboxStandalonePart(element: HTMLElement) {
  const part = listboxPartName(element);
  if (part === "Content") {
    syncListboxMenu(element, "single", new Set(), null);
    for (const viewport of element.querySelectorAll<HTMLElement>("aria-listbox-viewport")) {
      if (listboxMenu(viewport) === element) syncListboxViewport(viewport);
    }
    for (const sub of element.querySelectorAll<HTMLElement>("aria-listbox-sub")) {
      const trigger = listboxSubTrigger(sub);
      if (trigger && listboxMenu(trigger) === element) {
        syncListboxSub(sub, new Set(), "single");
      }
    }
  }
  if (part === "Viewport") {
    syncListboxViewport(element);
  }
  if (part === "SubTrigger") {
    element.removeAttribute("role");
    element.removeAttribute("tabindex");
    element.removeAttribute("aria-selected");
    element.removeAttribute("aria-haspopup");
    element.removeAttribute("aria-expanded");
  }
  if (part === "SubContent") {
    element.removeAttribute("role");
    element.removeAttribute("tabindex");
    element.hidden = true;
  }
}

export function syncListboxTreeAround(element: HTMLElement) {
  const root = element.matches("aria-listbox") ? element : listboxRoot(element);
  if (root) syncListboxTreeFromRoot(root);
  else if (listboxMenu(element)) syncListboxStandalonePart(listboxMenu(element)!);
  else syncListboxStandalonePart(element);
}

export function activeListboxItem(menu: HTMLElement) {
  const id = menu.getAttribute("aria-activedescendant");
  return id ? menu.ownerDocument.getElementById(id) as HTMLElement | null : null;
}

export function setListboxActiveItem(menu: HTMLElement, item: HTMLElement | null, focus = true) {
  if (item) menu.setAttribute("aria-activedescendant", ensureListboxId(item, "option"));
  else menu.removeAttribute("aria-activedescendant");
  const root = listboxRoot(menu);
  const selected = root ? new Set(listboxRootValues(root)) : new Set<string>();
  for (const candidate of listboxMenuItems(menu)) {
    syncListboxItem(candidate, selected, candidate === item);
  }
  if (item && focus) {
    item.focus({ preventScroll: true });
    item.scrollIntoView?.({ block: "nearest" });
  }
}
