import {
  isSelectDisabled,
  selectItemValue,
  selectMenu,
  selectMenuItems,
  selectPartName,
  selectRoot,
  selectRootOwnsNode,
  selectRootContent,
  selectRootTrigger,
  selectRootValues,
  selectSelectionMode,
  selectSub,
  selectSubContent,
  selectSubTrigger,
  writeSelectRootValues,
} from "./select-dom";
import {
  activeSelectItem,
  closeSelectSubmenus,
  selectMenuForItem,
  setSelectActiveItem,
  setSelectOpen,
  syncSelectSub,
  syncSelectTreeFromRoot,
} from "./select-sync";

const selectOutsideHandlers = new WeakMap<HTMLElement, (event: Event) => void>();
const typeaheadState = new WeakMap<HTMLElement, { buffer: string; timer: ReturnType<typeof setTimeout> | null }>();

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function dispatchSelectValueChange(root: HTMLElement, values: readonly string[]) {
  const mode = selectSelectionMode(root);
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: mode === "multiple" ? [...values] : values[0] ?? "",
      values: [...values],
    },
  }));
}

function openRootSelect(root: HTMLElement, focusIntent: "none" | "selected" | "selected-last" | "first" | "last" = "none") {
  setSelectOpen(root, true);
  syncSelectTreeFromRoot(root);

  if (focusIntent === "none") {
    return;
  }

  const content = selectRootContent(root);
  if (!content) {
    return;
  }

  const items = selectMenuItems(content);
  const selectedValues = selectRootValues(root);
  const selectedItem = items.find((item) => selectedValues.includes(selectItemValue(item)));
  const fallback = focusIntent === "last" || focusIntent === "selected-last" ? items[items.length - 1] ?? null : items[0] ?? null;
  setSelectActiveItem(content, selectedItem ?? fallback);
}

function closeRootSelect(root: HTMLElement, restoreFocus = true) {
  closeSelectSubmenus(root);
  setSelectOpen(root, false);
  syncSelectTreeFromRoot(root);

  if (restoreFocus) {
    selectRootTrigger(root)?.focus({ preventScroll: true });
  }
}

function openSubSelect(sub: HTMLElement, focusFirst = true) {
  const root = selectRoot(sub);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  setSelectOpen(sub, true);
  syncSelectSub(root, sub, selectSelectionMode(root), new Set(selectRootValues(root)), root.hasAttribute("open"));

  const content = selectSubContent(sub);
  if (content && focusFirst) {
    setSelectActiveItem(content, selectMenuItems(content)[0] ?? null);
  }
}

function closeSubSelect(sub: HTMLElement, restoreFocus = true) {
  const root = selectRoot(sub);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  setSelectOpen(sub, false);
  syncSelectSub(root, sub, selectSelectionMode(root), new Set(selectRootValues(root)), root.hasAttribute("open"));
  if (restoreFocus) {
    selectSubTrigger(sub)?.focus({ preventScroll: true });
  }
}

function setSelectValues(root: HTMLElement, values: readonly string[]) {
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  writeSelectRootValues(root, uniqueValues);
  syncSelectTreeFromRoot(root);
  dispatchSelectValueChange(root, uniqueValues);
}

function selectOption(option: HTMLElement) {
  if (isSelectDisabled(option)) {
    return false;
  }

  const root = selectRoot(option);
  if (!(root instanceof HTMLElement)) {
    return false;
  }

  const value = selectItemValue(option);
  const mode = selectSelectionMode(root);
  if (mode === "multiple") {
    const current = selectRootValues(root);
    setSelectValues(root, current.includes(value) ? current.filter((candidate) => candidate !== value) : [...current, value]);
    return true;
  }

  setSelectValues(root, [value]);
  closeRootSelect(root, true);
  return true;
}

function moveActiveItem(menu: HTMLElement, direction: number) {
  const items = selectMenuItems(menu);
  if (items.length === 0) {
    setSelectActiveItem(menu, null);
    return;
  }

  const active = activeSelectItem(menu);
  const activeIndex = active ? items.indexOf(active) : -1;
  const nextIndex = (activeIndex + direction + items.length) % items.length;
  setSelectActiveItem(menu, items[nextIndex] ?? null);
}

function focusBoundaryItem(menu: HTMLElement, last = false) {
  const items = selectMenuItems(menu);
  setSelectActiveItem(menu, last ? items[items.length - 1] ?? null : items[0] ?? null);
}

function typeahead(menu: HTMLElement, key: string) {
  const state = typeaheadState.get(menu) ?? { buffer: "", timer: null };
  if (state.timer) {
    clearTimeout(state.timer);
  }

  state.buffer += key.toLowerCase();
  state.timer = setTimeout(() => {
    state.buffer = "";
  }, 500);
  typeaheadState.set(menu, state);

  const items = selectMenuItems(menu);
  const active = activeSelectItem(menu);
  const activeIndex = active ? items.indexOf(active) : -1;
  const ordered = items.slice(activeIndex + 1).concat(items.slice(0, activeIndex + 1));
  const next = ordered.find((item) => (item.textContent ?? "").trim().toLowerCase().startsWith(state.buffer));
  if (next) {
    setSelectActiveItem(menu, next);
  }
}

function handleMenuKeyDown(menu: HTMLElement, event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveActiveItem(menu, 1);
    return true;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveActiveItem(menu, -1);
    return true;
  }

  if (event.key === "Home") {
    event.preventDefault();
    focusBoundaryItem(menu, false);
    return true;
  }

  if (event.key === "End") {
    event.preventDefault();
    focusBoundaryItem(menu, true);
    return true;
  }

  if (event.key === "Escape") {
    const root = selectRoot(menu);
    if (root instanceof HTMLElement) {
      event.preventDefault();
      closeRootSelect(root, true);
      return true;
    }
  }

  if (event.key === "ArrowLeft" && selectPartName(menu) === "SubContent") {
    const sub = selectSub(menu);
    if (sub instanceof HTMLElement) {
      event.preventDefault();
      closeSubSelect(sub, true);
      return true;
    }
  }

  if (event.key === "ArrowRight") {
    const active = activeSelectItem(menu);
    if (active && selectPartName(active) === "SubTrigger") {
      event.preventDefault();
      openSubSelect(selectSub(active) as HTMLElement, true);
      return true;
    }
  }

  if (event.key === "Enter" || isSpaceKey(event)) {
    const active = activeSelectItem(menu);
    if (active) {
      event.preventDefault();
      activateSelectItem(active);
      return true;
    }
  }

  if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    typeahead(menu, event.key);
    return true;
  }

  return false;
}

function activateSelectItem(item: HTMLElement) {
  if (selectPartName(item) === "SubTrigger") {
    openSubSelect(selectSub(item) as HTMLElement, true);
    return true;
  }

  return selectOption(item);
}

export function bindSelectOutsideEvents(root: HTMLElement) {
  if (selectOutsideHandlers.has(root)) {
    return;
  }

  const handler = (event: Event) => {
    if (!(event.target instanceof Node) || selectRootOwnsNode(root, event.target)) {
      return;
    }

    closeRootSelect(root, false);
  };

  selectOutsideHandlers.set(root, handler);
  root.ownerDocument.addEventListener("pointerdown", handler, true);
}

export function unbindSelectOutsideEvents(root: HTMLElement) {
  const handler = selectOutsideHandlers.get(root);
  if (!handler) {
    return;
  }

  selectOutsideHandlers.delete(root);
  root.ownerDocument.removeEventListener("pointerdown", handler, true);
}

export function handleSelectClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const partName = selectPartName(element);

  if (isSelectDisabled(element) || isSelectDisabled(selectRoot(element))) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (partName === "Trigger") {
    const root = selectRoot(element);
    if (!(root instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    if (root.hasAttribute("open")) {
      closeRootSelect(root, true);
    } else {
      openRootSelect(root, "none");
    }
    return;
  }

  if (partName === "Option") {
    event.preventDefault();
    selectOption(element);
    return;
  }

  if (partName === "SubTrigger") {
    const sub = selectSub(element);
    if (!(sub instanceof HTMLElement) || !(selectRoot(sub) instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    setSelectActiveItem(selectMenuForItem(element) ?? element, element);
    openSubSelect(sub, true);
  }
}

export function handleSelectKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const partName = selectPartName(element);

  if (isSelectDisabled(element) || isSelectDisabled(selectRoot(element))) {
    event.preventDefault();
    return;
  }

  if (partName === "Trigger") {
    const root = selectRoot(element);
    if (!(root instanceof HTMLElement)) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      openRootSelect(root, "selected");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openRootSelect(root, "selected-last");
      return;
    }

    if (event.key === "Enter" || isSpaceKey(event)) {
      event.preventDefault();
      openRootSelect(root, "selected");
      return;
    }

    if (event.key === "Escape" && root.hasAttribute("open")) {
      event.preventDefault();
      closeRootSelect(root, true);
      return;
    }
  }

  if (partName === "Content" || partName === "SubContent") {
    handleMenuKeyDown(element, event);
    return;
  }

  if (partName === "Option") {
    if (event.key === "Enter" || isSpaceKey(event)) {
      event.preventDefault();
      if (!selectRoot(element)) {
        if (event.key === "Enter") {
          element.click();
        }
        return;
      }
      selectOption(element);
      return;
    }

    const menu = selectMenu(element);
    if (menu instanceof HTMLElement) {
      handleMenuKeyDown(menu, event);
    }
    return;
  }

  if (partName === "SubTrigger") {
    if (event.key === "ArrowRight" || event.key === "Enter" || isSpaceKey(event)) {
      event.preventDefault();
      if (!selectRoot(element)) {
        if (event.key === "Enter") {
          element.click();
        }
        return;
      }
      openSubSelect(selectSub(element) as HTMLElement, true);
      return;
    }

    if (event.key === "ArrowLeft") {
      const sub = selectSub(element);
      if (sub instanceof HTMLElement) {
        event.preventDefault();
        closeSubSelect(sub, true);
      }
      return;
    }

    const menu = selectMenu(element);
    if (menu instanceof HTMLElement) {
      handleMenuKeyDown(menu, event);
    }
  }
}

export function handleSelectMouseOver(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const item = event.target.closest<HTMLElement>("aria-select-option, aria-select-sub-trigger");
  if (!item || selectRoot(item) !== root || isSelectDisabled(item)) {
    return;
  }

  const menu = selectMenu(item);
  if (!(menu instanceof HTMLElement)) {
    return;
  }

  for (const sub of Array.from(menu.querySelectorAll<HTMLElement>("aria-select-sub"))) {
    if (sub !== selectSub(item)) {
      setSelectOpen(sub, false);
      syncSelectSub(root, sub, selectSelectionMode(root), new Set(selectRootValues(root)), root.hasAttribute("open"));
    }
  }

  setSelectActiveItem(menu, item, false);
  if (selectPartName(item) === "SubTrigger") {
    const sub = selectSub(item);
    if (sub instanceof HTMLElement) {
      openSubSelect(sub, false);
    }
  }
}
