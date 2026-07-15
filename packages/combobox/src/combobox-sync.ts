import {
  comboboxButton,
  comboboxContent,
  comboboxElements,
  comboboxFallbacks,
  comboboxGroupOptions,
  comboboxInput,
  comboboxInputValue,
  comboboxItemValue,
  comboboxOptions,
  comboboxOptionsInContent,
  comboboxPartName,
  comboboxRoot,
  comboboxRootValues,
  comboboxSelectionMode,
  comboboxTrigger,
  comboboxValuesFromAttribute,
  comboboxVisibleOptions,
  ensureComboboxId,
  isComboboxDisabled,
  writeComboboxInputValue,
  writeComboboxRootValues,
} from "./combobox-dom";

type ComboboxSyncState = {
  activeOptionId: string | null;
  defaultInputValueApplied: boolean;
  defaultOpenApplied: boolean;
  defaultValueApplied: boolean;
  syncing: boolean;
};

const comboboxStates = new WeakMap<Element, ComboboxSyncState>();
let comboboxId = 0;

function nextComboboxId() {
  comboboxId += 1;
  return comboboxId;
}

function comboboxState(root: Element) {
  let state = comboboxStates.get(root);

  if (!state) {
    state = {
      activeOptionId: null,
      defaultInputValueApplied: false,
      defaultOpenApplied: false,
      defaultValueApplied: false,
      syncing: false,
    };
    comboboxStates.set(root, state);
  }

  return state;
}

function setBooleanAttribute(element: Element, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

function setAttributeIfChanged(element: Element, attribute: string, value: string) {
  if (element.getAttribute(attribute) !== value) {
    element.setAttribute(attribute, value);
  }
}

function rootValues(root: Element, state: ComboboxSyncState) {
  if (!state.defaultValueApplied && !root.hasAttribute("value") && root.hasAttribute("default-value")) {
    writeComboboxRootValues(root, comboboxValuesFromAttribute(root.getAttribute("default-value")));
    state.defaultValueApplied = true;
  }

  if (root.hasAttribute("value")) {
    state.defaultValueApplied = true;
  }

  return comboboxRootValues(root);
}

function rootInputValue(root: HTMLElement, input: HTMLElement | null, state: ComboboxSyncState) {
  if (!state.defaultInputValueApplied && !root.hasAttribute("input-value") && !root.hasAttribute("inputValue")) {
    const defaultValue = root.getAttribute("default-input-value") ?? root.getAttribute("defaultinputvalue");
    if (defaultValue != null) {
      writeComboboxInputValue(root, input, defaultValue);
    }
    state.defaultInputValueApplied = true;
  }

  if (root.hasAttribute("input-value") || root.hasAttribute("inputValue")) {
    state.defaultInputValueApplied = true;
  }

  const value = comboboxInputValue(root);
  writeComboboxInputValue(root, input, value);
  return value;
}

export function setComboboxOpen(root: HTMLElement, open: boolean) {
  setBooleanAttribute(root, "open", open);
  root.setAttribute("data-state", open ? "open" : "closed");
}

export function syncComboboxTreeAround(element: HTMLElement) {
  const root = element.matches("aria-combobox") ? element : comboboxRoot(element);
  if (root instanceof HTMLElement) {
    syncComboboxTreeFromRoot(root);
    return;
  }

  syncComboboxStandalonePart(element);
}

export function syncComboboxTreeFromRoot(root: HTMLElement) {
  const state = comboboxState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    if (!state.defaultOpenApplied) {
      state.defaultOpenApplied = true;
      if ((root.hasAttribute("default-open") || root.hasAttribute("defaultopen")) && !root.hasAttribute("open")) {
        root.setAttribute("open", "");
      }
    }

    const trigger = comboboxTrigger(root);
    const input = comboboxInput(root);
    const button = comboboxButton(root);
    const content = comboboxContent(root);
    const values = rootValues(root, state);
    const selectedSet = new Set(values);
    const mode = comboboxSelectionMode(root);
    const inputValue = rootInputValue(root, input, state);
    const isOpen = root.hasAttribute("open");

    root.setAttribute("data-state", isOpen ? "open" : "closed");

    if (trigger) {
      syncComboboxTrigger(root, trigger, content, isOpen, values.length > 0);
    }

    if (input) {
      syncComboboxInput(root, input, content);
    }

    if (button) {
      syncComboboxButton(root, button);
    }

    if (content) {
      syncComboboxContent(root, content, trigger, input, isOpen, mode, selectedSet, inputValue, state);
    } else {
      state.activeOptionId = null;
    }
  } finally {
    state.syncing = false;
  }
}

export function syncComboboxStandalonePart(element: HTMLElement) {
  const partName = comboboxPartName(element);

  if (partName === "Trigger") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "combobox");
    }
    element.setAttribute("aria-haspopup", "listbox");
    element.setAttribute("aria-expanded", String(element.hasAttribute("open")));
    if (!element.hasAttribute("data-has-value")) {
      element.setAttribute("data-has-value", "false");
    }
  }

  if (partName === "Input") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "textbox");
    }
    element.setAttribute("aria-autocomplete", "list");
    if (!element.querySelector("input") && !element.hasAttribute("contenteditable")) {
      element.setAttribute("contenteditable", "plaintext-only");
    }
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
  }

  if (partName === "Button") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "button");
    }
    setAttributeIfChanged(element, "tabindex", "-1");
    setAttributeIfChanged(element, "type", "button");
  }

  if (partName === "Content") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "listbox");
    }
    if (!element.hasAttribute("aria-multiselectable")) {
      element.setAttribute("aria-multiselectable", "false");
    }
    setAttributeIfChanged(element, "tabindex", "0");
    if (!element.hasAttribute("open") && !element.hasAttribute("force-mount")) {
      element.hidden = true;
    }
  }

  if (partName === "Group") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "group");
    }
  }

  if (partName === "Label") {
    ensureComboboxId(element, "label", nextComboboxId);
  }

  if (partName === "Option") {
    const selectedSet = element.hasAttribute("selected") ? new Set([comboboxItemValue(element)]) : new Set<string>();
    syncComboboxOption(element, selectedSet, false, true, false);
    if (!isComboboxDisabled(element)) {
      element.setAttribute("tabindex", "0");
    }
  }
}

function syncComboboxTrigger(root: HTMLElement, trigger: HTMLElement, content: HTMLElement | null, isOpen: boolean, hasValue: boolean) {
  ensureComboboxId(trigger, "trigger", nextComboboxId);
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("data-has-value", String(hasValue));
  trigger.removeAttribute("data-state");

  const disabled = isComboboxDisabled(root) || isComboboxDisabled(trigger);
  if (disabled) {
    trigger.setAttribute("aria-disabled", "true");
    trigger.setAttribute("data-disabled", "");
  } else {
    trigger.removeAttribute("aria-disabled");
    trigger.removeAttribute("data-disabled");
  }

  if (isOpen && content) {
    trigger.setAttribute("aria-controls", ensureComboboxId(content, "content", nextComboboxId));
  } else {
    trigger.removeAttribute("aria-controls");
  }

  trigger.setAttribute("aria-expanded", String(isOpen));
}

function syncComboboxInput(root: HTMLElement, input: HTMLElement, content: HTMLElement | null) {
  ensureComboboxId(input, "input", nextComboboxId);
  input.setAttribute("role", "textbox");
  input.setAttribute("aria-autocomplete", "list");
  if (!input.querySelector("input") && !input.hasAttribute("contenteditable")) {
    input.setAttribute("contenteditable", "plaintext-only");
  }
  setAttributeIfChanged(input, "tabindex", isComboboxDisabled(root) || isComboboxDisabled(input) ? "-1" : "0");

  if (content) {
    input.setAttribute("aria-controls", ensureComboboxId(content, "content", nextComboboxId));
  } else {
    input.removeAttribute("aria-controls");
  }

  if (isComboboxDisabled(root) || isComboboxDisabled(input)) {
    input.setAttribute("aria-disabled", "true");
    input.setAttribute("data-disabled", "");
  } else {
    input.removeAttribute("aria-disabled");
    input.removeAttribute("data-disabled");
  }
}

function syncComboboxButton(root: HTMLElement, button: HTMLElement) {
  button.setAttribute("role", "button");
  setAttributeIfChanged(button, "tabindex", "-1");
  setAttributeIfChanged(button, "type", "button");

  if (isComboboxDisabled(root) || isComboboxDisabled(button)) {
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("data-disabled", "");
  } else {
    button.removeAttribute("aria-disabled");
    button.removeAttribute("data-disabled");
  }
}

function syncComboboxContent(
  root: HTMLElement,
  content: HTMLElement,
  trigger: HTMLElement | null,
  input: HTMLElement | null,
  isOpen: boolean,
  mode: "single" | "multiple",
  selectedSet: Set<string>,
  inputValue: string,
  state: ComboboxSyncState,
) {
  content.setAttribute("role", "listbox");
  content.setAttribute("aria-multiselectable", String(mode === "multiple"));
  setAttributeIfChanged(content, "tabindex", "0");

  if (trigger) {
    content.setAttribute("aria-labelledby", ensureComboboxId(trigger, "trigger", nextComboboxId));
  } else {
    content.removeAttribute("aria-labelledby");
  }

  setComboboxContentOpen(content, isOpen);

  syncComboboxOptions(content, selectedSet, inputValue, state.activeOptionId);
  syncComboboxGroups(root);
  syncComboboxFallback(content);

  const activeOption = state.activeOptionId ? content.ownerDocument.getElementById(state.activeOptionId) : null;
  if (!(activeOption instanceof HTMLElement) || activeOption.hidden || isComboboxDisabled(activeOption)) {
    state.activeOptionId = null;
  }

  mirrorActiveDescendant(input, content, state.activeOptionId);
}

function setComboboxContentOpen(content: HTMLElement, open: boolean) {
  setBooleanAttribute(content, "open", open);
  content.setAttribute("data-state", open ? "open" : "closed");
  content.hidden = !open && !content.hasAttribute("force-mount");
}

function syncComboboxOptions(content: HTMLElement, selectedSet: Set<string>, inputValue: string, activeId: string | null) {
  const normalizedInput = inputValue.trim().toLowerCase();

  for (const option of comboboxOptionsInContent(content)) {
    const value = comboboxItemValue(option);
    const matchesFilter = normalizedInput.length === 0 || value.toLowerCase().startsWith(normalizedInput);
    option.hidden = !matchesFilter;
    syncComboboxOption(option, selectedSet, Boolean(activeId && option.id === activeId), matchesFilter);
  }
}

export function syncComboboxOption(option: HTMLElement, selectedSet: Set<string>, active: boolean, visible = true, enforceRole = true) {
  if (!option.id) {
    ensureComboboxId(option, "option", nextComboboxId);
  }

  if (enforceRole || !option.hasAttribute("role")) {
    option.setAttribute("role", "option");
  }
  option.setAttribute("data-active", String(active));
  option.setAttribute("tabindex", active && visible && !isComboboxDisabled(option) ? "0" : "-1");

  if (isComboboxDisabled(option)) {
    option.setAttribute("aria-disabled", "true");
    option.setAttribute("data-disabled", "");
  } else {
    option.removeAttribute("aria-disabled");
    option.removeAttribute("data-disabled");
  }

  const value = comboboxItemValue(option);
  const selected = selectedSet.has(value);
  option.setAttribute("data-value", value);
  option.setAttribute("aria-selected", String(selected));
  option.setAttribute("data-state", selected ? "checked" : "unchecked");
}

function syncComboboxGroups(root: HTMLElement) {
  for (const group of comboboxElements(root, "aria-combobox-group")) {
    group.setAttribute("role", "group");

    const label = Array.from(group.querySelectorAll<HTMLElement>("aria-combobox-label")).find((candidate) => candidate.closest("aria-combobox-group") === group) ?? null;
    if (label) {
      group.setAttribute("aria-labelledby", ensureComboboxId(label, "group-label", nextComboboxId));
    }

    group.hidden = comboboxGroupOptions(group).every((option) => option.hidden);
  }
}

function syncComboboxFallback(content: HTMLElement) {
  const hasVisibleOptions = comboboxOptionsInContent(content).some((option) => !option.hidden);
  for (const fallback of comboboxFallbacks(content)) {
    fallback.hidden = hasVisibleOptions;
  }
}

function mirrorActiveDescendant(input: HTMLElement | null, content: HTMLElement, activeId: string | null) {
  if (activeId) {
    content.setAttribute("aria-activedescendant", activeId);
    input?.setAttribute("aria-activedescendant", activeId);
  } else {
    content.removeAttribute("aria-activedescendant");
    input?.removeAttribute("aria-activedescendant");
  }
}

export function setComboboxActiveOption(root: HTMLElement, option: HTMLElement | null, focus = false) {
  const state = comboboxState(root);
  const content = comboboxContent(root);
  const input = comboboxInput(root);

  if (option && !option.id) {
    ensureComboboxId(option, "option", nextComboboxId);
  }

  state.activeOptionId = option?.id ?? null;

  if (content) {
    const selectedSet = new Set(comboboxRootValues(root));
    for (const candidate of comboboxOptionsInContent(content)) {
      syncComboboxOption(candidate, selectedSet, candidate === option, !candidate.hidden);
    }

    mirrorActiveDescendant(input, content, state.activeOptionId);
  }

  if (focus) {
    option?.focus({ preventScroll: true });
  }
}

export function activeComboboxOption(root: HTMLElement) {
  const state = comboboxState(root);
  return state.activeOptionId ? root.ownerDocument.getElementById(state.activeOptionId) as HTMLElement | null : null;
}

export function firstEnabledComboboxOption(content: HTMLElement, last = false) {
  const items = comboboxVisibleOptions(content);
  return last ? items[items.length - 1] ?? null : items[0] ?? null;
}

export function moveComboboxActiveOption(root: HTMLElement, direction: number) {
  const content = comboboxContent(root);
  if (!content) {
    return;
  }

  const items = comboboxVisibleOptions(content);
  if (items.length === 0) {
    setComboboxActiveOption(root, null);
    return;
  }

  const active = activeComboboxOption(root);
  const activeIndex = active ? items.indexOf(active) : -1;
  const nextIndex = (activeIndex + direction + items.length) % items.length;
  setComboboxActiveOption(root, items[nextIndex] ?? null);
}

export function focusComboboxBoundaryOption(root: HTMLElement, last = false) {
  const content = comboboxContent(root);
  if (!content) {
    return;
  }

  setComboboxActiveOption(root, firstEnabledComboboxOption(content, last));
}

export function clearComboboxActiveOption(root: HTMLElement, option: HTMLElement) {
  if (activeComboboxOption(root) === option) {
    setComboboxActiveOption(root, null);
  }
}

export function syncComboboxAfterInputChange(root: HTMLElement) {
  syncComboboxTreeFromRoot(root);
  const content = comboboxContent(root);
  if (content && activeComboboxOption(root)?.hidden) {
    setComboboxActiveOption(root, firstEnabledComboboxOption(content));
  }
}

export function selectedComboboxValues(root: HTMLElement) {
  return rootValues(root, comboboxState(root));
}
