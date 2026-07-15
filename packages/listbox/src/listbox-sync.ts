import {
  ensureListboxId,
  isListboxDisabled,
  listboxElements,
  listboxItemValue,
  listboxMenu,
  listboxMenuItems,
  listboxPartName,
  listboxRoot,
  listboxRootContent,
  listboxRootLabel,
  listboxRootValues,
  listboxSelectionMode,
  listboxValuesFromAttribute,
  writeListboxRootValues,
} from "./listbox-dom";

type ListboxSyncState = { defaultValueApplied: boolean; syncing: boolean };
const states = new WeakMap<Element, ListboxSyncState>();

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
  } finally {
    state.syncing = false;
  }
}

export function syncListboxStandalonePart(element: HTMLElement) {
  const part = listboxPartName(element);
  if (part === "Content") syncListboxMenu(element, "single", new Set(), null);
  if (part === "Viewport") {
    element.removeAttribute("role");
    element.setAttribute("data-listbox-viewport", "");
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
  if (item && focus) item.focus({ preventScroll: true });
}
