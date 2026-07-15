import {
  isListboxDisabled,
  listboxItemValue,
  listboxMenu,
  listboxMenuItems,
  listboxPartName,
  listboxRoot,
  listboxRootValues,
  listboxSelectionMode,
  writeListboxRootValues,
} from "./listbox-dom";
import {
  activeListboxItem,
  setListboxActiveItem,
  syncListboxTreeFromRoot,
} from "./listbox-sync";

const typeaheadStates = new WeakMap<HTMLElement, {
  buffer: string;
  timer: ReturnType<typeof setTimeout> | null;
}>();

function sameValues(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function dispatchValueChange(root: HTMLElement, values: readonly string[]) {
  const mode = listboxSelectionMode(root);
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    composed: true,
    detail: {
      value: mode === "multiple" ? [...values] : values[0] ?? "",
      values: [...values],
    },
  }));
}

export function setListboxValues(root: HTMLElement, values: readonly string[]) {
  const unique = Array.from(new Set(values.filter(Boolean)));
  if (sameValues(listboxRootValues(root), unique)) return false;
  writeListboxRootValues(root, unique);
  syncListboxTreeFromRoot(root);
  dispatchValueChange(root, unique);
  return true;
}

export function selectListboxOption(option: HTMLElement) {
  if (isListboxDisabled(option)) return false;
  const root = listboxRoot(option);
  if (!root) return false;
  const value = listboxItemValue(option);
  if (!value) return false;
  const current = listboxRootValues(root);
  return listboxSelectionMode(root) === "multiple"
    ? setListboxValues(root, current.includes(value)
      ? current.filter((candidate) => candidate !== value)
      : [...current, value])
    : setListboxValues(root, [value]);
}

export function handleListboxClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || listboxPartName(element) !== "Option") return;
  event.preventDefault();
  selectListboxOption(element);
}

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function moveActive(menu: HTMLElement, delta: number) {
  const items = listboxMenuItems(menu);
  if (!items.length) return setListboxActiveItem(menu, null);
  const current = activeListboxItem(menu);
  const index = current ? items.indexOf(current) : -1;
  const nextIndex = index === -1
    ? delta < 0 ? items.length - 1 : 0
    : (index + delta + items.length) % items.length;
  setListboxActiveItem(menu, items[nextIndex] ?? null);
}

function focusBoundary(menu: HTMLElement, last: boolean) {
  const items = listboxMenuItems(menu);
  setListboxActiveItem(menu, last ? items.at(-1) ?? null : items[0] ?? null);
}

function typeahead(menu: HTMLElement, keyValue: string) {
  const state = typeaheadStates.get(menu) ?? { buffer: "", timer: null };
  if (state.timer) clearTimeout(state.timer);
  state.buffer += keyValue.toLowerCase();
  state.timer = setTimeout(() => { state.buffer = ""; }, 500);
  typeaheadStates.set(menu, state);
  const items = listboxMenuItems(menu);
  const current = activeListboxItem(menu);
  const index = current ? items.indexOf(current) : -1;
  const ordered = items.slice(index + 1).concat(items.slice(0, index + 1));
  const match = ordered.find((item) => (item.textContent ?? "").trim().toLowerCase().startsWith(state.buffer));
  if (match) setListboxActiveItem(menu, match);
}

function handleMenuKeyDown(menu: HTMLElement, event: KeyboardEvent) {
  if (event.key === "ArrowDown") { event.preventDefault(); moveActive(menu, 1); return true; }
  if (event.key === "ArrowUp") { event.preventDefault(); moveActive(menu, -1); return true; }
  if (event.key === "Home") { event.preventDefault(); focusBoundary(menu, false); return true; }
  if (event.key === "End") { event.preventDefault(); focusBoundary(menu, true); return true; }
  if (event.key === "Enter" || isSpaceKey(event)) {
    const active = activeListboxItem(menu);
    if (!active) return false;
    event.preventDefault();
    if (!isListboxDisabled(active)) selectListboxOption(active);
    return true;
  }
  if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    typeahead(menu, event.key);
    return true;
  }
  return false;
}

export function handleListboxKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) return;
  const part = listboxPartName(element);
  const menu = part === "Content" || part === "SubContent" ? element : listboxMenu(element);
  if ((part === "Option" || part === "SubTrigger") &&
      menu &&
      (event.key === "Enter" || isSpaceKey(event))) {
    event.preventDefault();
    if (!isListboxDisabled(element)) selectListboxOption(element);
    return;
  }
  if (menu) handleMenuKeyDown(menu, event);
}

export function handleListboxMouseOver(owner: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const item = event.target.closest<HTMLElement>("aria-listbox-option, aria-listbox-sub-trigger");
  if (!item || isListboxDisabled(item)) return;
  const root = listboxRoot(item);
  if (owner.matches("aria-listbox") && root !== owner) return;
  const menu = listboxMenu(item);
  if (menu) setListboxActiveItem(menu, item, false);
}

export function cleanupListboxMenu(menu: HTMLElement) {
  const state = typeaheadStates.get(menu);
  if (state?.timer) clearTimeout(state.timer);
  typeaheadStates.delete(menu);
}
