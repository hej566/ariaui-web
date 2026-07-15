import {
  isListboxDisabled,
  listboxItemValue,
  listboxMenu,
  listboxMenuItems,
  listboxPartName,
  listboxRoot,
  listboxRootValues,
  listboxSelectionMode,
  listboxSub,
  listboxSubContent,
  listboxSubTrigger,
  writeListboxRootValues,
} from "./listbox-dom";
import {
  activeListboxItem,
  setListboxActiveItem,
  setListboxSubOpen,
  syncListboxTreeAround,
  syncListboxTreeFromRoot,
} from "./listbox-sync";

const typeaheadStates = new WeakMap<HTMLElement, {
  buffer: string;
  timer: ReturnType<typeof setTimeout> | null;
}>();
const outsideHandlers = new WeakMap<HTMLElement, (event: Event) => void>();

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

function openSub(sub: HTMLElement, focusFirst: boolean) {
  setListboxSubOpen(sub, true);
  syncListboxTreeAround(sub);
  const content = listboxSubContent(sub);
  if (focusFirst && content) setListboxActiveItem(content, listboxMenuItems(content)[0] ?? null);
}

function closeSub(sub: HTMLElement, restoreFocus: boolean) {
  setListboxSubOpen(sub, false);
  syncListboxTreeAround(sub);
  if (restoreFocus) listboxSubTrigger(sub)?.focus({ preventScroll: true });
}

export function bindListboxOutsideEvents(sub: HTMLElement) {
  if (outsideHandlers.has(sub)) return;
  const handler = (event: Event) => {
    if (!(event.target instanceof Node) || sub.contains(event.target)) return;
    closeSub(sub, false);
  };
  outsideHandlers.set(sub, handler);
  sub.ownerDocument.addEventListener("pointerdown", handler, true);
}

export function unbindListboxOutsideEvents(sub: HTMLElement) {
  const handler = outsideHandlers.get(sub);
  if (!handler) return;
  sub.ownerDocument.removeEventListener("pointerdown", handler, true);
  outsideHandlers.delete(sub);
}

function ownedListboxSubs(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll<HTMLElement>("aria-listbox-sub")).filter((sub) => {
    const trigger = listboxSubTrigger(sub);
    return Boolean(trigger && listboxMenu(trigger) === menu);
  });
}

function closeOwnedListboxSubs(menu: HTMLElement, except: HTMLElement | null = null) {
  for (const sub of ownedListboxSubs(menu)) {
    if (sub !== except && sub.hasAttribute("open")) closeSub(sub, false);
  }
}

function activateListboxItem(menu: HTMLElement, item: HTMLElement | null, focus = true) {
  setListboxActiveItem(menu, item, focus);
  const activeSub = item && listboxPartName(item) === "SubTrigger" ? listboxSub(item) : null;
  closeOwnedListboxSubs(menu, activeSub);
}

function closeAfterSingleSubSelection(option: HTMLElement, changed: boolean) {
  if (!changed) return;
  const root = listboxRoot(option);
  const sub = listboxSub(option);
  if (root && sub && listboxSelectionMode(root) === "single") closeSub(sub, true);
}

export function handleListboxClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) return;
  const part = listboxPartName(element);
  if (part === "SubTrigger") {
    const sub = listboxSub(element);
    const menu = listboxMenu(element);
    if (!sub || !menu) return;
    event.preventDefault();
    activateListboxItem(menu, element, false);
    openSub(sub, false);
    return;
  }
  if (part !== "Option") return;
  event.preventDefault();
  closeAfterSingleSubSelection(element, selectListboxOption(element));
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
  activateListboxItem(menu, items[nextIndex] ?? null);
}

function focusBoundary(menu: HTMLElement, last: boolean) {
  const items = listboxMenuItems(menu);
  activateListboxItem(menu, last ? items.at(-1) ?? null : items[0] ?? null);
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
  if (match) activateListboxItem(menu, match);
}

function handleMenuKeyDown(menu: HTMLElement, event: KeyboardEvent) {
  const active = activeListboxItem(menu);
  const activePart = active ? listboxPartName(active) : "";
  if (event.key === "ArrowRight" && active && activePart === "SubTrigger") {
    const sub = listboxSub(active);
    if (!sub) return false;
    event.preventDefault();
    openSub(sub, true);
    return true;
  }
  if ((event.key === "ArrowLeft" || event.key === "Escape") &&
      menu.matches("aria-listbox-sub-content")) {
    const sub = listboxSub(menu);
    if (!sub) return false;
    event.preventDefault();
    closeSub(sub, true);
    return true;
  }
  if (event.key === "ArrowDown") { event.preventDefault(); moveActive(menu, 1); return true; }
  if (event.key === "ArrowUp") { event.preventDefault(); moveActive(menu, -1); return true; }
  if (event.key === "Home") { event.preventDefault(); focusBoundary(menu, false); return true; }
  if (event.key === "End") { event.preventDefault(); focusBoundary(menu, true); return true; }
  if (event.key === "Enter" || isSpaceKey(event)) {
    if (!active) return false;
    event.preventDefault();
    if (activePart === "SubTrigger") {
      const sub = listboxSub(active);
      if (sub) openSub(sub, true);
      return true;
    }
    if (!isListboxDisabled(active)) {
      closeAfterSingleSubSelection(active, selectListboxOption(active));
    }
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
  if (!menu) return;
  if (part === "Option" || part === "SubTrigger") {
    activateListboxItem(menu, element, false);
  }
  handleMenuKeyDown(menu, event);
}

export function handleListboxMouseOver(owner: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const item = event.target.closest<HTMLElement>("aria-listbox-option, aria-listbox-sub-trigger");
  if (!item || isListboxDisabled(item)) return;
  const root = listboxRoot(item);
  if (owner.matches("aria-listbox") && root !== owner) return;
  const menu = listboxMenu(item);
  if (!menu) return;
  activateListboxItem(menu, item, false);
  if (listboxPartName(item) === "SubTrigger") {
    const sub = listboxSub(item);
    if (!sub) return;
    openSub(sub, false);
  }
}

export function cleanupListboxMenu(menu: HTMLElement) {
  const state = typeaheadStates.get(menu);
  if (state?.timer) clearTimeout(state.timer);
  typeaheadStates.delete(menu);
}
