import {
  createItemButton,
  itemForwardedAttributes,
  ownedItemButton,
  ownedToggleGroupItems,
  ownerToggleGroup,
} from "./toggle-group-dom";

export type ToggleGroupMode = "single" | "multiple";
export type ToggleGroupValue = string | string[] | null;

type RootState = {
  controlledValue: boolean;
  defaultValue: ToggleGroupValue;
  focusedItem: HTMLElement | null;
  initialized: boolean;
  mode: ToggleGroupMode;
  observer: MutationObserver | null;
  onActiveChange: ((active: boolean[]) => void) | null;
  onValueChange: ((value: ToggleGroupValue) => void) | null;
  selectedValue: ToggleGroupValue;
  syncing: boolean;
  usesValueState: boolean;
};

type ItemState = {
  controlClass: string;
  controlId: string | null;
  syncing: boolean;
};

const rootStates = new WeakMap<HTMLElement, RootState>();
const itemStates = new WeakMap<HTMLElement, ItemState>();
const boundButtons = new WeakSet<HTMLButtonElement>();

function parseValue(value: string | null): ToggleGroupValue {
  if (value == null || value === "") return null;
  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")) return parsed;
    } catch {}
  }
  return value;
}

function normalizeMode(value: string | null): ToggleGroupMode {
  return value === "single" ? "single" : "multiple";
}

function normalizeValue(value: ToggleGroupValue, mode: ToggleGroupMode): ToggleGroupValue {
  if (mode === "multiple") {
    if (Array.isArray(value)) return [...value];
    return typeof value === "string" && value.length > 0 ? [value] : [];
  }
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function rootStateFor(root: HTMLElement) {
  let state = rootStates.get(root);
  if (!state) {
    const mode = normalizeMode(root.getAttribute("mode"));
    const controlledValue = root.hasAttribute("value");
    const hasDefaultValue = root.hasAttribute("default-value");
    const defaultValue = parseValue(root.getAttribute("default-value"));
    state = {
      controlledValue,
      defaultValue,
      focusedItem: null,
      initialized: false,
      mode,
      observer: null,
      onActiveChange: null,
      onValueChange: null,
      selectedValue: normalizeValue(controlledValue ? parseValue(root.getAttribute("value")) : defaultValue, mode),
      syncing: false,
      usesValueState: controlledValue || hasDefaultValue,
    };
    rootStates.set(root, state);
  }
  return state;
}

function itemStateFor(item: HTMLElement) {
  let state = itemStates.get(item);
  if (!state) {
    const control = ownedItemButton(item);
    state = {
      controlClass: control?.className ?? "",
      controlId: item.getAttribute("id"),
      syncing: false,
    };
    itemStates.set(item, state);
  }
  return state;
}

function itemValue(item: HTMLElement, index: number) {
  return item.getAttribute("value") || item.getAttribute("id") || itemStateFor(item).controlId || `toggle-item-${index}`;
}

function activeFor(item: HTMLElement, index: number, state: RootState) {
  if (!state.usesValueState) return item.hasAttribute("is-active");
  const value = itemValue(item, index);
  if (state.mode === "multiple") return (normalizeValue(state.selectedValue, state.mode) as string[]).includes(value);
  return normalizeValue(state.selectedValue, state.mode) === value;
}

function ensureItemControl(item: HTMLElement) {
  let control = ownedItemButton(item);
  if (!control) {
    control = createItemButton(item.ownerDocument);
    item.append(control);
  }
  for (const node of Array.from(item.childNodes)) {
    if (node !== control) control.append(node);
  }
  bindItemControl(item, control);
  return control;
}

function bindItemControl(item: HTMLElement, control: HTMLButtonElement) {
  if (boundButtons.has(control)) return;
  control.addEventListener("focus", () => {
    const root = ownerToggleGroup(item);
    if (!root) return;
    rootStateFor(root).focusedItem = item;
    syncToggleGroup(root);
  });
  control.addEventListener("click", () => {
    const root = ownerToggleGroup(item);
    if (!root || control.disabled) return;
    toggleGroupItem(root, item);
  });
  control.addEventListener("keydown", (event) => {
    const root = ownerToggleGroup(item);
    if (!root || control.disabled) return;
    if (event.key === "Enter" || event.key === " " || event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();
      control.click();
      return;
    }
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (direction !== 0 || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      moveToggleGroupFocus(root, item, event.key, direction);
    }
  });
  boundButtons.add(control);
}

function moveToggleGroupFocus(root: HTMLElement, current: HTMLElement, key: string, direction: number) {
  const items = ownedToggleGroupItems(root).filter((item) => !item.hasAttribute("disabled"));
  if (items.length === 0) return;
  let index = items.indexOf(current);
  if (key === "Home") index = 0;
  else if (key === "End") index = items.length - 1;
  else if (index === -1) index = direction >= 0 ? 0 : items.length - 1;
  else index = (index + direction + items.length) % items.length;
  const target = items[index]!;
  rootStateFor(root).focusedItem = target;
  syncToggleGroup(root);
  ensureItemControl(target).focus();
}

function nextValue(state: RootState, value: string) {
  if (state.mode === "multiple") {
    const values = normalizeValue(state.selectedValue, state.mode) as string[];
    return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
  }
  return normalizeValue(state.selectedValue, state.mode) === value ? null : value;
}

function toggleGroupItem(root: HTMLElement, item: HTMLElement) {
  const state = rootStateFor(root);
  const items = ownedToggleGroupItems(root);
  const index = items.indexOf(item);
  if (index === -1) return;
  state.focusedItem = item;

  if (state.usesValueState) {
    const value = nextValue(state, itemValue(item, index));
    if (!state.controlledValue) state.selectedValue = value;
    const active = items.map((entry, itemIndex) => {
      const entryValue = itemValue(entry, itemIndex);
      return state.mode === "multiple" ? (value as string[]).includes(entryValue) : value === entryValue;
    });
    state.onValueChange?.(value);
    state.onActiveChange?.(active);
    root.dispatchEvent(new CustomEvent("valuechange", { bubbles: true, detail: { value } }));
    root.dispatchEvent(new CustomEvent("activechange", { bubbles: true, detail: { active } }));
  } else {
    const current = items.map((entry) => entry.hasAttribute("is-active"));
    const active = current.map((active, itemIndex) => itemIndex === index ? !active : state.mode === "single" ? false : active);
    items.forEach((entry, itemIndex) => entry.toggleAttribute("is-active", active[itemIndex]));
    state.onActiveChange?.(active);
    root.dispatchEvent(new CustomEvent("activechange", { bubbles: true, detail: { active } }));
  }
  syncToggleGroup(root);
}

function syncItem(item: HTMLElement, index: number, active: boolean, tabIndex: number) {
  const state = itemStateFor(item);
  if (state.syncing) return;
  state.syncing = true;
  try {
    const control = ensureItemControl(item);
    const id = item.getAttribute("id");
    if (id) state.controlId = id;
    if (item.hasAttribute("id")) item.removeAttribute("id");
    control.id = state.controlId ?? "";
    const type = item.getAttribute("type");
    control.type = type === "reset" || type === "submit" ? type : "button";
    control.disabled = item.hasAttribute("disabled");
    control.tabIndex = control.disabled ? -1 : tabIndex;
    control.dataset.active = String(active);
    control.dataset.state = active ? "on" : "off";
    control.setAttribute("aria-pressed", String(active));
    control.toggleAttribute("data-disabled", control.disabled);
    for (const attribute of itemForwardedAttributes) {
      const value = item.getAttribute(attribute);
      if (value == null) control.removeAttribute(attribute);
      else control.setAttribute(attribute, value);
    }
    if (!item.hasAttribute("aria-label")) control.setAttribute("aria-label", `toggle-item-${index}`);
    const className = `${state.controlClass} ${item.className}`.trim();
    control.className = Array.from(new Set(className.split(/\s+/).filter(Boolean))).join(" ");
    for (const attribute of Array.from(item.attributes)) {
      if (!attribute.name.startsWith("data-") || attribute.name.startsWith("data-ariaui-web")) continue;
      if (["data-active", "data-disabled", "data-package", "data-part", "data-state", "data-value"].includes(attribute.name)) continue;
      control.setAttribute(attribute.name, attribute.value);
    }
    item.dataset.active = String(active);
    item.dataset.state = active ? "on" : "off";
    item.toggleAttribute("data-disabled", control.disabled);
    for (const attribute of ["role", "tabindex", "aria-disabled", "aria-expanded", "aria-pressed", "aria-selected", "data-value"]) {
      item.removeAttribute(attribute);
    }
  } finally {
    state.syncing = false;
  }
}

export function syncStandaloneItem(item: HTMLElement) {
  if (ownerToggleGroup(item)) return;
  syncItem(item, 0, item.hasAttribute("is-active"), -1);
}

export function syncToggleGroup(root: HTMLElement) {
  const state = rootStateFor(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    state.mode = normalizeMode(root.getAttribute("mode") ?? state.mode);
    if (!state.initialized) {
      state.selectedValue = normalizeValue(state.selectedValue, state.mode);
      state.initialized = true;
    }
    const items = ownedToggleGroupItems(root);
    if (state.focusedItem && !items.includes(state.focusedItem)) state.focusedItem = null;
    const enabled = items.filter((item) => !item.hasAttribute("disabled"));
    const rovingItem = state.focusedItem && enabled.includes(state.focusedItem) ? state.focusedItem : enabled[0] ?? null;
    items.forEach((item, index) => syncItem(item, index, activeFor(item, index, state), item === rovingItem ? 0 : -1));
    root.setAttribute("role", "group");
    root.setAttribute("mode", state.mode);
  } finally {
    state.syncing = false;
  }
}

export function observeToggleGroup(root: HTMLElement) {
  const state = rootStateFor(root);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncToggleGroup(root));
  state.observer.observe(root, { childList: true, subtree: true });
}

export function disconnectToggleGroup(root: HTMLElement) {
  const state = rootStates.get(root);
  state?.observer?.disconnect();
  if (state) state.observer = null;
}

export function updateToggleGroupAttribute(root: HTMLElement, name: string, value: string | null) {
  const state = rootStateFor(root);
  if (name === "mode") state.mode = normalizeMode(value);
  if (name === "value") {
    state.controlledValue = true;
    state.usesValueState = true;
    state.selectedValue = normalizeValue(parseValue(value), state.mode);
  }
  if (name === "default-value") {
    state.usesValueState = true;
    state.defaultValue = parseValue(value);
    if (!state.initialized && !state.controlledValue) state.selectedValue = normalizeValue(state.defaultValue, state.mode);
  }
}

export function getToggleGroupMode(root: HTMLElement) { return rootStateFor(root).mode; }
export function setToggleGroupMode(root: HTMLElement, mode: ToggleGroupMode) { root.setAttribute("mode", mode === "single" ? "single" : "multiple"); }
export function getToggleGroupValue(root: HTMLElement) { return rootStateFor(root).selectedValue; }
export function setToggleGroupValue(root: HTMLElement, value: ToggleGroupValue) {
  const state = rootStateFor(root);
  state.controlledValue = true;
  state.usesValueState = true;
  state.selectedValue = normalizeValue(value, state.mode);
  syncToggleGroup(root);
}
export function getToggleGroupDefaultValue(root: HTMLElement) { return rootStateFor(root).defaultValue; }
export function setToggleGroupDefaultValue(root: HTMLElement, value: ToggleGroupValue) {
  const state = rootStateFor(root);
  state.usesValueState = true;
  state.defaultValue = value;
  if (!state.initialized && !state.controlledValue) state.selectedValue = normalizeValue(value, state.mode);
  syncToggleGroup(root);
}
export function getToggleGroupValueChange(root: HTMLElement) { return rootStateFor(root).onValueChange; }
export function setToggleGroupValueChange(root: HTMLElement, callback: ((value: ToggleGroupValue) => void) | null) {
  const state = rootStateFor(root);
  state.onValueChange = callback;
  if (callback) state.usesValueState = true;
  syncToggleGroup(root);
}
export function getToggleGroupActiveChange(root: HTMLElement) { return rootStateFor(root).onActiveChange; }
export function setToggleGroupActiveChange(root: HTMLElement, callback: ((active: boolean[]) => void) | null) { rootStateFor(root).onActiveChange = callback; }
