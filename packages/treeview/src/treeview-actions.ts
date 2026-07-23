import { allItems, eventItem, isItemDisabled, itemGroup, itemLabel, itemValue, parentItem, parseValues, visibleItems } from "./treeview-dom";
import { requestExpanded, requestValue, setTreeviewFocus, syncTreeview, treeviewState } from "./treeview-sync";

const boundRoots = new WeakSet<HTMLElement>();

function toggleExpansion(root: HTMLElement, item: HTMLElement) {
  if (!itemGroup(item) || isItemDisabled(root, item)) return;
  const id = itemValue(item);
  const current = parseValues(root.getAttribute("expanded"));
  requestExpanded(root, current.includes(id) ? current.filter((value) => value !== id) : [...current, id], item);
}

function selectItem(root: HTMLElement, item: HTMLElement, options: { additive?: boolean; range?: boolean } = {}) {
  if (isItemDisabled(root, item)) return;
  const state = treeviewState(root);
  const id = itemValue(item);
  const current = new Set(parseValues(root.getAttribute("value")));
  if (options.range && state.anchor) {
    const ids = visibleItems(root).map(itemValue);
    const start = ids.indexOf(state.anchor);
    const end = ids.indexOf(id);
    if (!options.additive) current.clear();
    if (start >= 0 && end >= 0) {
      for (let index = Math.min(start, end); index <= Math.max(start, end); index += 1) current.add(ids[index]!);
    }
  } else if (root.hasAttribute("multi-select") && options.additive) {
    if (current.has(id)) current.delete(id); else current.add(id);
    state.anchor = id;
  } else {
    const clearSingleSelection = !root.hasAttribute("multi-select") && current.size === 1 && current.has(id);
    current.clear();
    if (!clearSingleSelection) current.add(id);
    state.anchor = id;
  }
  requestValue(root, Array.from(current), item);
}

function checkboxDescendants(root: HTMLElement, item: HTMLElement) {
  const group = itemGroup(item);
  if (!group) return [];
  return Array.from(group.querySelectorAll<HTMLElement>("aria-treeview-checkbox-item"))
    .filter((child) => child.closest("aria-treeview") === root);
}

function syncCheckboxAncestors(root: HTMLElement, selected: Set<string>, item: HTMLElement) {
  let ancestor = parentItem(item);
  while (ancestor) {
    if (ancestor.matches("aria-treeview-checkbox-item")) {
      const descendants = checkboxDescendants(root, ancestor);
      const all = descendants.length > 0 && descendants.every((child) => selected.has(itemValue(child)));
      if (all) selected.add(itemValue(ancestor)); else selected.delete(itemValue(ancestor));
    }
    ancestor = parentItem(ancestor);
  }
}

function toggleCheckbox(root: HTMLElement, item: HTMLElement) {
  if (isItemDisabled(root, item)) return;
  const selected = new Set(parseValues(root.getAttribute("value")));
  const descendants = checkboxDescendants(root, item);
  const values = [item, ...descendants].map(itemValue);
  const checked = item.getAttribute("aria-checked") === "true";
  if (!root.hasAttribute("multi-select")) selected.clear();
  for (const value of values) checked ? selected.delete(value) : selected.add(value);
  syncCheckboxAncestors(root, selected, item);
  requestValue(root, Array.from(selected), item);
}

function activate(root: HTMLElement, item: HTMLElement) {
  if (item.matches("aria-treeview-checkbox-item")) toggleCheckbox(root, item);
  else if (!root.hasAttribute("multi-select") && itemGroup(item)) toggleExpansion(root, item);
  else selectItem(root, item, { additive: root.hasAttribute("multi-select") });
}

function move(root: HTMLElement, current: HTMLElement, next: HTMLElement | undefined, range = false, additive = false) {
  if (!next) return;
  setTreeviewFocus(root, next);
  if (range && root.hasAttribute("multi-select")) selectItem(root, next, { range: true, additive });
}

function handleKey(root: HTMLElement, item: HTMLElement, event: KeyboardEvent) {
  const items = visibleItems(root);
  const index = items.indexOf(item);
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    move(root, item, items[Math.max(0, Math.min(items.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))], event.shiftKey, event.ctrlKey || event.metaKey);
  } else if (event.key === "Home" || event.key === "End") {
    move(root, item, event.key === "Home" ? items[0] : items[items.length - 1], event.shiftKey, event.ctrlKey || event.metaKey);
  } else if (event.key === "ArrowRight") {
    if (item.getAttribute("aria-expanded") === "false") toggleExpansion(root, item);
  } else if (event.key === "ArrowLeft") {
    if (item.getAttribute("aria-expanded") === "true") toggleExpansion(root, item);
    else move(root, item, parentItem(item) ?? undefined);
  } else if (event.key === "*" || event.key === "Multiply") {
    const parent = parentItem(item);
    const values = parseValues(root.getAttribute("expanded"));
    const siblings = allItems(root).filter((candidate) => parentItem(candidate) === parent && itemGroup(candidate));
    requestExpanded(root, [...values, ...siblings.map(itemValue)], item);
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a" && root.hasAttribute("multi-select")) {
    requestValue(root, visibleItems(root).map(itemValue), root);
  } else if (event.key === " " || event.key === "Enter") {
    if (event.shiftKey && event.key === " " && root.hasAttribute("multi-select")) selectItem(root, item, { range: true, additive: event.ctrlKey || event.metaKey });
    else activate(root, item);
  } else if (event.key.length === 1 && event.key !== " ") {
    const state = treeviewState(root);
    const now = Date.now();
    const sameRepeated = now - state.typeaheadAt <= 500 && state.typeaheadBuffer.split("").every((part) => part === event.key.toLowerCase());
    state.typeaheadBuffer = now - state.typeaheadAt > 500 || sameRepeated ? event.key.toLowerCase() : state.typeaheadBuffer + event.key.toLowerCase();
    state.typeaheadAt = now;
    const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
    const match = ordered.find((candidate) => itemLabel(candidate).startsWith(state.typeaheadBuffer));
    if (!match) return false;
    setTreeviewFocus(root, match);
  } else return false;
  return true;
}

export function bindTreeviewRoot(root: HTMLElement) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  root.addEventListener("focusin", (event) => {
    const item = eventItem(event.target, root);
    if (item && !isItemDisabled(root, item)) setTreeviewFocus(root, item, false);
  });
  root.addEventListener("click", (event) => {
    const item = eventItem(event.target, root);
    if (!item || isItemDisabled(root, item)) return;
    setTreeviewFocus(root, item, false);
    const toggle = event.target instanceof Element ? event.target.closest("aria-treeview-toggle") : null;
    if (toggle && toggle.closest("aria-treeview-item, aria-treeview-checkbox-item") === item) toggleExpansion(root, item);
    else if (item.matches("aria-treeview-checkbox-item")) toggleCheckbox(root, item);
    else if (!root.hasAttribute("multi-select") && itemGroup(item)) toggleExpansion(root, item);
    else selectItem(root, item, { additive: root.hasAttribute("multi-select") && (event.ctrlKey || event.metaKey), range: root.hasAttribute("multi-select") && event.shiftKey });
  });
  root.addEventListener("keydown", (event) => {
    if (root.hasAttribute("disabled")) return;
    const item = eventItem(event.target, root) ?? visibleItems(root).find((candidate) => candidate.tabIndex === 0);
    if (item && handleKey(root, item, event)) event.preventDefault();
  });
  syncTreeview(root);
}
