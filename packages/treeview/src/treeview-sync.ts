import {
  allItems,
  groupHost,
  itemByValue,
  itemGroup,
  itemValue,
  parseValues,
  parentItem,
  treeviewRoot,
  visibleItems,
  writeValues,
} from "./treeview-dom";

type RootState = {
  anchor: string | null;
  controlledExpanded: boolean;
  controlledValue: boolean;
  defaultsApplied: boolean;
  focused: string | null;
  observer: MutationObserver | null;
  onExpandedChange: ((value: string[]) => void) | null;
  onValueChange: ((value: string | string[]) => void) | null;
  syncing: boolean;
  typeaheadAt: number;
  typeaheadBuffer: string;
};

const states = new WeakMap<HTMLElement, RootState>();

export function treeviewState(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = {
      anchor: null,
      controlledExpanded: root.hasAttribute("expanded"),
      controlledValue: root.hasAttribute("value"),
      defaultsApplied: false,
      focused: null,
      observer: null,
      onExpandedChange: null,
      onValueChange: null,
      syncing: false,
      typeaheadAt: 0,
      typeaheadBuffer: "",
    };
    states.set(root, state);
  }
  return state;
}

function setAttribute(element: Element, name: string, value: string | null) {
  if (value === null) {
    if (element.hasAttribute(name)) element.removeAttribute(name);
  } else if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setBoolean(element: HTMLElement, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function applyDefaults(root: HTMLElement, state: RootState) {
  if (state.defaultsApplied) return;
  if (!root.hasAttribute("expanded") && root.hasAttribute("default-expanded")) {
    writeValues(root, "expanded", parseValues(root.getAttribute("default-expanded")));
  }
  if (!root.hasAttribute("value") && root.hasAttribute("default-value")) {
    writeValues(root, "value", parseValues(root.getAttribute("default-value")));
  }
  state.defaultsApplied = true;
}

function syncItem(root: HTMLElement, item: HTMLElement, expanded: Set<string>, selected: Set<string>, depth: number, ancestorCollapsed: boolean) {
  const id = itemValue(item);
  const group = itemGroup(item);
  const open = Boolean(group && expanded.has(id));
  const disabled = root.hasAttribute("disabled") || item.hasAttribute("disabled");
  const checkbox = item.matches("aria-treeview-checkbox-item");
  let isSelected = selected.has(id);

  if (checkbox && group) {
    const descendants = Array.from(group.querySelectorAll<HTMLElement>("aria-treeview-checkbox-item"))
      .filter((child) => child.closest("aria-treeview") === root);
    const selectedCount = descendants.filter((child) => selected.has(itemValue(child))).length;
    const state = descendants.length > 0 && selectedCount === descendants.length ? "checked" : selectedCount > 0 ? "indeterminate" : isSelected ? "checked" : "unchecked";
    isSelected = state === "checked";
    setAttribute(item, "aria-checked", state === "indeterminate" ? "mixed" : String(state === "checked"));
    setAttribute(item, "data-state", state);
  } else if (checkbox) {
    setAttribute(item, "aria-checked", String(isSelected));
    setAttribute(item, "data-state", isSelected ? "checked" : "unchecked");
  } else {
    setAttribute(item, "data-state", isSelected ? "selected" : "unchecked");
  }

  setAttribute(item, "data-value", id);
  setAttribute(item, "aria-level", String(depth));
  setAttribute(item, "aria-expanded", group ? String(open) : null);
  setAttribute(item, "data-expanded", group ? String(open) : "false");
  setAttribute(item, "aria-selected", String(isSelected));
  setAttribute(item, "data-selected", isSelected ? "true" : null);
  setAttribute(item, "aria-disabled", disabled ? "true" : null);
  setBoolean(item, "data-disabled", disabled);
  setBoolean(item, "hidden", ancestorCollapsed && !item.closest("aria-treeview-group[native-composition]"));
  setAttribute(item, "aria-hidden", ancestorCollapsed ? "true" : null);

  for (const toggle of Array.from(item.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.matches("aria-treeview-toggle"))) {
    setAttribute(toggle, "data-expanded", group ? String(open) : null);
    setAttribute(toggle, "data-state", group ? (open ? "open" : "closed") : null);
    setBoolean(toggle, "data-disabled", disabled);
    setAttribute(toggle, "aria-hidden", toggle.getAttribute("aria-hidden") ?? "true");
  }

  if (!group) return;
  const host = groupHost(group);
  const mounted = host !== group || group.hasAttribute("force-mount");
  if (host !== group) {
    setAttribute(group, "role", null);
    setAttribute(host, "role", "group");
  }
  setAttribute(host, "data-expanded", mounted ? String(open) : null);
  setBoolean(host, "hidden", !open && !mounted);
  setAttribute(host, "aria-hidden", !open && mounted ? "true" : null);
  setBoolean(host, "data-treeview-collapsed-branch", !open && mounted);
  const nested = Array.from(host.querySelectorAll<HTMLElement>("aria-treeview-item, aria-treeview-checkbox-item"))
    .filter((child) => parentItem(child) === item);
  for (const child of nested) syncItem(root, child, expanded, selected, depth + 1, ancestorCollapsed || !open);
}

function syncFocus(root: HTMLElement, state: RootState) {
  const candidates = visibleItems(root);
  let target = state.focused ? itemByValue(root, state.focused) : null;
  if (!target || !candidates.includes(target)) {
    const selected = new Set(parseValues(root.getAttribute("value")));
    target = candidates.find((item) => selected.has(itemValue(item))) ?? candidates[0] ?? null;
    state.focused = target ? itemValue(target) : null;
  }
  for (const item of allItems(root)) setAttribute(item, "tabindex", item === target ? "0" : "-1");
}

export function syncTreeview(root: HTMLElement) {
  const state = treeviewState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    applyDefaults(root, state);
    setAttribute(root, "aria-multiselectable", root.hasAttribute("multi-select") ? "true" : null);
    setAttribute(root, "aria-disabled", root.hasAttribute("disabled") ? "true" : null);
    const expanded = new Set(parseValues(root.getAttribute("expanded")));
    const selected = new Set(parseValues(root.getAttribute("value")));
    const top = allItems(root).filter((item) => parentItem(item) === null);
    for (const item of top) syncItem(root, item, expanded, selected, 1, false);
    syncFocus(root, state);
  } finally {
    state.syncing = false;
  }
}

export function syncTreeviewAround(element: HTMLElement) {
  const root = treeviewRoot(element);
  if (root) syncTreeview(root);
}

export function observeTreeview(root: HTMLElement) {
  const state = treeviewState(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncTreeview(root));
  state.observer.observe(root, { attributes: true, childList: true, subtree: true });
}

export function disconnectTreeview(root: HTMLElement) {
  const state = treeviewState(root);
  state.observer?.disconnect();
  state.observer = null;
}

export function setTreeviewFocus(root: HTMLElement, item: HTMLElement, move = true) {
  treeviewState(root).focused = itemValue(item);
  syncTreeview(root);
  if (move) item.focus();
}

export function requestExpanded(root: HTMLElement, values: readonly string[], source: Element) {
  const state = treeviewState(root);
  const next = Array.from(new Set(values));
  const event = new CustomEvent("expandedchange", { bubbles: true, cancelable: true, detail: { expanded: next, value: next, source } });
  if (!root.dispatchEvent(event)) return false;
  state.onExpandedChange?.(next);
  if (!state.controlledExpanded) writeValues(root, "expanded", next);
  syncTreeview(root);
  return true;
}

export function requestValue(root: HTMLElement, values: readonly string[], source: Element) {
  const state = treeviewState(root);
  const next = Array.from(new Set(values));
  const value = root.hasAttribute("multi-select") ? next : next[0] ?? "";
  const event = new CustomEvent("valuechange", { bubbles: true, cancelable: true, detail: { value, values: next, source } });
  if (!root.dispatchEvent(event)) return false;
  state.onValueChange?.(value);
  if (!state.controlledValue) writeValues(root, "value", next);
  syncTreeview(root);
  return true;
}

export function getExpandedCallback(root: HTMLElement) { return treeviewState(root).onExpandedChange; }
export function setExpandedCallback(root: HTMLElement, value: ((items: string[]) => void) | null) { treeviewState(root).onExpandedChange = value; }
export function getValueCallback(root: HTMLElement) { return treeviewState(root).onValueChange; }
export function setValueCallback(root: HTMLElement, value: ((items: string | string[]) => void) | null) { treeviewState(root).onValueChange = value; }
