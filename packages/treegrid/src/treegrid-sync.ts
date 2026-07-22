import {
  allRows,
  firstCell,
  focusElement,
  parseValues,
  rowCells,
  rowId,
  treegridGroupHost,
  treegridRoot,
  type TreegridFocus,
  visibleRows,
  writeValues,
} from "./treegrid-dom";

type RootState = {
  anchorCell: { rowId: string; col: number } | null;
  anchorRow: string | null;
  controlledExpanded: boolean;
  controlledValue: boolean;
  defaultExpandedApplied: boolean;
  defaultValueApplied: boolean;
  focus: TreegridFocus | null;
  observer: MutationObserver | null;
  onExpandedChange: ((value: string[]) => void) | null;
  onValueChange: ((value: string | string[]) => void) | null;
  selectedCells: Set<string>;
  syncing: boolean;
  typeaheadAt: number;
  typeaheadBuffer: string;
};

const states = new WeakMap<HTMLElement, RootState>();

export function treegridState(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = {
      anchorCell: null,
      anchorRow: null,
      controlledExpanded: root.hasAttribute("expanded"),
      controlledValue: root.hasAttribute("value"),
      defaultExpandedApplied: false,
      defaultValueApplied: false,
      focus: null,
      observer: null,
      onExpandedChange: null,
      onValueChange: null,
      selectedCells: new Set(),
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
  } else if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}

function setBoolean(element: HTMLElement, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function rootValues(root: HTMLElement, state: RootState, attribute: "expanded" | "value", defaultAttribute: "default-expanded" | "default-value") {
  const applied = attribute === "expanded" ? state.defaultExpandedApplied : state.defaultValueApplied;
  if (!applied && !root.hasAttribute(attribute) && root.hasAttribute(defaultAttribute)) {
    writeValues(root, attribute, parseValues(root.getAttribute(defaultAttribute)));
  }
  if (attribute === "expanded") state.defaultExpandedApplied = true;
  else state.defaultValueApplied = true;
  return parseValues(root.getAttribute(attribute));
}

function groupChildren(group: HTMLElement) {
  const host = treegridGroupHost(group);
  return host === group ? group : host;
}

function syncContainer(
  root: HTMLElement,
  container: HTMLElement,
  expanded: ReadonlySet<string>,
  selectedRows: ReadonlySet<string>,
  state: RootState,
  parentId: string | null,
  depth: number,
  ancestorCollapsed: boolean,
) {
  const children = Array.from(container.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
  let previousRow: HTMLElement | null = null;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]!;
    if (child.matches("aria-treegrid-row")) {
      previousRow = child;
      const id = rowId(child);
      const next = children[index + 1];
      const hasChildren = Boolean(next?.matches("aria-treegrid-group"));
      const isExpanded = expanded.has(id);
      const isSelected = selectedRows.has(id);

      setAttribute(child, "data-row-id", id);
      setAttribute(child, "data-parent-row-id", parentId);
      setAttribute(child, "aria-level", String(depth));
      setAttribute(child, "aria-expanded", hasChildren ? String(isExpanded) : null);
      setAttribute(child, "data-expanded", isExpanded ? "open" : "closed");
      setAttribute(child, "aria-selected", String(isSelected));
      setAttribute(child, "data-selected", isSelected ? "true" : null);
      setAttribute(child, "aria-disabled", root.hasAttribute("disabled") || child.hasAttribute("disabled") ? "true" : null);
      setAttribute(child, "aria-hidden", ancestorCollapsed ? "true" : null);
      setBoolean(child, "data-treegrid-collapsed-row", ancestorCollapsed);
      setBoolean(child, "hidden", ancestorCollapsed && !child.closest("aria-treegrid-group[native-composition]"));

      const cells = rowCells(child);
      cells.forEach((cell, col) => {
        const key = `${id}:${col}`;
        const selected = state.selectedCells.has(key);
        setAttribute(cell, "data-row-id", id);
        setAttribute(cell, "data-row", String(allRows(root).indexOf(child)));
        setAttribute(cell, "data-col", String(col));
        setAttribute(cell, "data-expanded", isExpanded ? "open" : "closed");
        setAttribute(cell, "aria-selected", String(selected));
        setAttribute(cell, "data-selected", selected ? "true" : null);
      });
      continue;
    }

    if (!child.matches("aria-treegrid-group")) continue;
    const parent = previousRow;
    const ownerId = parent?.dataset.rowId ?? null;
    const ownerExpanded = ownerId ? expanded.has(ownerId) : false;
    const collapsed = ancestorCollapsed || !ownerExpanded;
    const host = treegridGroupHost(child);
    const keepMounted = host !== child;

    if (host !== child) {
      setAttribute(child, "role", null);
      setBoolean(child, "hidden", false);
      setAttribute(host, "role", "rowgroup");
    }
    setAttribute(host, "data-expanded", ownerId ? String(ownerExpanded) : null);
    setBoolean(host, "hidden", collapsed && !keepMounted);
    setAttribute(host, "aria-hidden", collapsed && keepMounted ? "true" : null);
    setBoolean(host, "data-treegrid-collapsed-branch", collapsed && keepMounted);
    syncContainer(root, groupChildren(child), expanded, selectedRows, state, ownerId, depth + 1, collapsed);
  }
}

function syncFocus(root: HTMLElement, state: RootState) {
  const rows = allRows(root);
  const focusTarget = focusElement(root, state.focus) ?? firstCell(root);
  for (const row of rows) {
    const focused = focusTarget === row;
    setAttribute(row, "tabindex", focused ? "0" : "-1");
    setAttribute(row, "data-focused", focused ? "true" : null);
    for (const cell of rowCells(row)) {
      const cellFocused = focusTarget === cell;
      setAttribute(cell, "tabindex", cellFocused ? "0" : "-1");
      setAttribute(cell, "data-focused", cellFocused ? "true" : null);
    }
  }
}

export function syncTreegrid(root: HTMLElement) {
  const state = treegridState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    setAttribute(root, "tabindex", "-1");
    setAttribute(root, "aria-multiselectable", root.hasAttribute("multi-select") ? "true" : null);
    setAttribute(root, "aria-disabled", root.hasAttribute("disabled") ? "true" : null);

    for (const body of root.querySelectorAll<HTMLElement>("aria-treegrid-body")) {
      if (body.closest("aria-treegrid") !== root) continue;
      const expanded = new Set(rootValues(root, state, "expanded", "default-expanded"));
      const selected = new Set(rootValues(root, state, "value", "default-value"));
      syncContainer(root, body, expanded, selected, state, null, 1, false);
    }
    for (const header of root.querySelectorAll<HTMLElement>("aria-treegrid-column-header")) {
      if (header.closest("aria-treegrid") !== root) continue;
      setAttribute(header, "aria-sort", header.getAttribute("sort-direction"));
    }
    syncFocus(root, state);
  } finally {
    state.syncing = false;
  }
}

export function syncTreegridAround(element: HTMLElement) {
  const root = treegridRoot(element);
  if (root) syncTreegrid(root);
}

export function observeTreegrid(root: HTMLElement) {
  const state = treegridState(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncTreegrid(root));
  state.observer.observe(root, { attributes: true, childList: true, subtree: true });
}

export function disconnectTreegrid(root: HTMLElement) {
  const state = treegridState(root);
  state.observer?.disconnect();
  state.observer = null;
}

export function setTreegridFocus(root: HTMLElement, focus: TreegridFocus, move = true) {
  treegridState(root).focus = focus;
  syncTreegrid(root);
  if (move) focusElement(root, focus)?.focus();
}

export function expandedValues(root: HTMLElement) {
  return parseValues(root.getAttribute("expanded"));
}

export function selectedRowValues(root: HTMLElement) {
  return parseValues(root.getAttribute("value"));
}

export function requestExpanded(root: HTMLElement, values: readonly string[], source: Element) {
  const state = treegridState(root);
  const next = Array.from(new Set(values));
  const event = new CustomEvent("expandedchange", { bubbles: true, cancelable: true, detail: { expanded: next, value: next, source } });
  if (!root.dispatchEvent(event)) return false;
  state.onExpandedChange?.(next);
  if (!state.controlledExpanded) writeValues(root, "expanded", next);
  syncTreegrid(root);
  return true;
}

export function requestSelectedRows(root: HTMLElement, values: readonly string[], source: Element) {
  const state = treegridState(root);
  const next = Array.from(new Set(values));
  const value = root.hasAttribute("multi-select") ? next : next[0] ?? "";
  const event = new CustomEvent("valuechange", { bubbles: true, cancelable: true, detail: { value, values: next, source } });
  if (!root.dispatchEvent(event)) return false;
  state.onValueChange?.(value);
  if (!state.controlledValue) writeValues(root, "value", next);
  syncTreegrid(root);
  return true;
}

export function getExpandedCallback(root: HTMLElement) { return treegridState(root).onExpandedChange; }
export function setExpandedCallback(root: HTMLElement, value: ((items: string[]) => void) | null) { treegridState(root).onExpandedChange = value; }
export function getValueCallback(root: HTMLElement) { return treegridState(root).onValueChange; }
export function setValueCallback(root: HTMLElement, value: ((items: string | string[]) => void) | null) { treegridState(root).onValueChange = value; }

export function treegridVisibleRows(root: HTMLElement) { return visibleRows(root); }
