import { defaultCommandFilter, isCommandItemVisible } from "./command-filter";
import {
  commandContent,
  commandEmptyElements,
  commandGroups,
  commandInput,
  commandInputValue,
  commandLoadingElements,
  commandOptionKeywords,
  commandOptions,
  commandOptionValue,
  commandRoot,
  commandSearchValue,
  commandSeparators,
  commandValue,
  ensureCommandId,
  hasCommandBoolean,
  writeCommandInputValue,
  writeCommandSearchValue,
} from "./command-dom";
import type { CommandFilter, CommandGroupRecord, CommandItemRecord, CommandOptionElement, CommandRootElement, CommandRootState } from "./command-types";

const commandStates = new WeakMap<HTMLElement, CommandRootState>();

export function commandState(root: HTMLElement) {
  let state = commandStates.get(root);
  if (!state) {
    state = {
      activeId: null,
      defaultSearchValueApplied: false,
      defaultValueApplied: false,
      groups: new Map<string, CommandGroupRecord>(),
      items: new Map<string, CommandItemRecord>(),
      labelId: null,
      syncing: false,
    };
    commandStates.set(root, state);
  }
  return state;
}

export function commandFilter(root: HTMLElement): CommandFilter {
  return (root as CommandRootElement).filter ?? defaultCommandFilter;
}

export function syncCommandTreeAround(element: HTMLElement) {
  const root = element.matches("aria-command") ? element : commandRoot(element);
  if (root instanceof HTMLElement) {
    syncCommandTreeFromRoot(root);
    return;
  }

  syncCommandStandalonePart(element);
}

export function syncCommandTreeFromRoot(root: HTMLElement) {
  const state = commandState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    const input = commandInput(root);
    const content = commandContent(root);
    applyCommandDefaults(root, input, state);
    syncCommandLabel(root, input, state);
    syncCommandInput(root, input, content, state);
    syncCommandContent(content);
    syncCommandItems(root, state);
    syncCommandActiveReferences(input, content, state);
    syncCommandGroups(root, state);
    syncCommandEmpty(root, state);
    syncCommandSeparators(root);
    syncCommandLoading(root);
  } finally {
    state.syncing = false;
  }
}

export function syncCommandStandalonePart(element: HTMLElement) {
  const part = element.getAttribute("data-part");
  if (part === "Input") {
    setDefaultAttribute(element, "role", "combobox");
    setAttributeIfChanged(element, "aria-autocomplete", "list");
    setAttributeIfChanged(element, "aria-expanded", "true");
    if (!element.querySelector("input") && !element.hasAttribute("contenteditable")) {
      setAttributeIfChanged(element, "contenteditable", "plaintext-only");
    }
    if (!element.hasAttribute("tabindex")) {
      setAttributeIfChanged(element, "tabindex", "0");
    }
  }

  if (part === "Content") {
    setDefaultAttribute(element, "role", "listbox");
    if (!element.hasAttribute("tabindex") || element.getAttribute("tabindex") === "0") {
      setAttributeIfChanged(element, "tabindex", "-1");
    }
  }

  if (part === "Option") {
    syncCommandOptionElement(element, null, true);
  }
}

export function syncCommandInputValueFromElement(element: HTMLElement) {
  if (element.getAttribute("data-part") !== "Input") {
    return;
  }

  const root = commandRoot(element);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const state = commandState(root);
  state.activeId = null;
  writeCommandSearchValue(root, element, commandInputValue(element));
  syncCommandTreeFromRoot(root);
}

function applyCommandDefaults(root: HTMLElement, input: HTMLElement | null, state: CommandRootState) {
  if (!state.defaultValueApplied) {
    const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultValue");
    if (defaultValue != null && !root.hasAttribute("value")) {
      root.setAttribute("value", defaultValue);
    }
    state.defaultValueApplied = true;
  }

  if (!state.defaultSearchValueApplied) {
    const defaultSearchValue = root.getAttribute("default-search-value") ?? root.getAttribute("defaultSearchValue");
    if (defaultSearchValue != null && !root.hasAttribute("search-value") && !root.hasAttribute("searchValue")) {
      writeCommandSearchValue(root, input, defaultSearchValue);
    }
    state.defaultSearchValueApplied = true;
  }
}

function syncCommandLabel(root: HTMLElement, input: HTMLElement | null, state: CommandRootState) {
  if (!input) {
    return;
  }

  const labelText = root.getAttribute("label") ?? root.getAttribute("aria-label");
  const existing = root.querySelector<HTMLElement>("[data-command-hidden-label]");
  if (!labelText) {
    existing?.remove();
    input.removeAttribute("aria-labelledby");
    state.labelId = null;
    return;
  }

  const label = existing ?? document.createElement("label");
  label.dataset.commandHiddenLabel = "true";
  label.hidden = true;
  label.textContent = labelText;
  state.labelId = ensureCommandId(label, "label");
  setAttributeIfChanged(input, "aria-labelledby", state.labelId);
  if (!existing) {
    root.prepend(label);
  }
}

function syncCommandInput(root: HTMLElement, input: HTMLElement | null, content: HTMLElement | null, _state: CommandRootState) {
  if (!input) {
    return;
  }

  setDefaultAttribute(input, "role", "combobox");
  setAttributeIfChanged(input, "aria-autocomplete", "list");
  setAttributeIfChanged(input, "aria-expanded", "true");
  setAttributeIfChanged(input, "tabindex", "0");
  if (!input.querySelector("input")) {
    setAttributeIfChanged(input, "contenteditable", "plaintext-only");
  }

  if (content) {
    setAttributeIfChanged(input, "aria-controls", ensureCommandId(content, "content"));
  } else {
    input.removeAttribute("aria-controls");
  }

  writeCommandInputValue(input, commandSearchValue(root));
}

function syncCommandContent(content: HTMLElement | null) {
  if (!content) {
    return;
  }

  setDefaultAttribute(content, "role", "listbox");
  setAttributeIfChanged(content, "tabindex", "-1");
  if (!content.hasAttribute("aria-label")) {
    setAttributeIfChanged(content, "aria-label", "Suggestions");
  }
}

function syncCommandItems(root: HTMLElement, state: CommandRootState) {
  state.items.clear();
  const selectedValue = commandValue(root);
  const searchValue = commandSearchValue(root);
  const shouldFilter = commandShouldFilter(root);
  const filter = commandFilter(root);

  for (const option of commandOptions(root)) {
    const group = option.closest("aria-command-group");
    const groupForceMount = group instanceof HTMLElement && hasCommandBoolean(group, "force-mount");
    const optionHasForceMount = option.hasAttribute("force-mount") || option.hasAttribute("forceMount");
    const optionOnSelect = (option as CommandOptionElement).onSelect;
    const record: CommandItemRecord = {
      disabled: option.hasAttribute("disabled") || option.getAttribute("aria-disabled") === "true",
      element: option,
      forceMount: optionHasForceMount ? hasCommandBoolean(option, "force-mount") : groupForceMount,
      groupId: group instanceof HTMLElement ? ensureCommandId(group, "group") : null,
      id: ensureCommandId(option, "option"),
      keywords: commandOptionKeywords(option),
      value: commandOptionValue(option),
    };
    if (optionOnSelect) {
      record.onSelect = optionOnSelect;
    }
    state.items.set(record.id, record);

    const visible = isCommandItemVisible(record, searchValue, shouldFilter, filter);
    syncCommandOptionElement(option, record, visible);
    const selected = state.activeId ? state.activeId === record.id : selectedValue !== "" && selectedValue === record.value;
    setAttributeIfChanged(option, "aria-selected", String(selected));
    setAttributeIfChanged(option, "data-selected", String(selected));
    setAttributeIfChanged(option, "tabindex", record.disabled ? "-1" : selected ? "0" : "-1");
  }

  if (state.activeId) {
    const activeItem = state.items.get(state.activeId);
    if (!activeItem || activeItem.disabled || activeItem.element.hidden) {
      state.activeId = null;
    }
  }
}

function syncCommandActiveReferences(input: HTMLElement | null, content: HTMLElement | null, state: CommandRootState) {
  if (state.activeId) {
    input?.setAttribute("aria-activedescendant", state.activeId);
    content?.setAttribute("aria-activedescendant", state.activeId);
    return;
  }

  input?.removeAttribute("aria-activedescendant");
  content?.removeAttribute("aria-activedescendant");
}

function syncCommandGroups(root: HTMLElement, state: CommandRootState) {
  state.groups.clear();
  for (const group of commandGroups(root)) {
    const id = ensureCommandId(group, "group");
    const forceMount = hasCommandBoolean(group, "force-mount");
    const headingElement = group.querySelector<HTMLElement>("aria-command-label, [data-command-group-heading]");
    const heading = group.getAttribute("heading");
    let headingId: string | null = null;

    if (headingElement) {
      headingId = ensureCommandId(headingElement, "label");
      setAttributeIfChanged(group, "aria-labelledby", headingId);
    } else if (heading) {
      const existing = group.querySelector<HTMLElement>("[data-command-generated-heading]");
      const generated = existing ?? group.ownerDocument.createElement("span");
      generated.dataset.commandGeneratedHeading = "true";
      generated.hidden = true;
      generated.textContent = heading;
      headingId = ensureCommandId(generated, "label");
      setAttributeIfChanged(group, "aria-labelledby", headingId);
      if (!existing) {
        group.prepend(generated);
      }
    } else {
      group.removeAttribute("aria-labelledby");
    }

    setDefaultAttribute(group, "role", "group");
    state.groups.set(id, { element: group, forceMount, headingId, id });

    const childItems = Array.from(state.items.values()).filter((item) => item.groupId === id);
    group.hidden = !forceMount && childItems.length > 0 && childItems.every((item) => item.element.hidden);
  }
}

function syncCommandEmpty(root: HTMLElement, state: CommandRootState) {
  const totalItems = state.items.size;
  const visibleItems = Array.from(state.items.values()).filter((item) => !item.element.hidden).length;
  const shouldShowEmpty = totalItems > 0 && visibleItems === 0;

  for (const empty of commandEmptyElements(root)) {
    setAttributeIfChanged(empty, "role", "presentation");
    empty.hidden = !hasCommandBoolean(empty, "force-mount") && !shouldShowEmpty;
  }
}

function syncCommandSeparators(root: HTMLElement) {
  const hasSearch = commandSearchValue(root).trim().length > 0;
  for (const separator of commandSeparators(root)) {
    setAttributeIfChanged(separator, "role", "separator");
    separator.hidden = hasSearch && !hasCommandBoolean(separator, "always-render", "alwaysRender");
  }
}

function syncCommandLoading(root: HTMLElement) {
  for (const loading of commandLoadingElements(root)) {
    setAttributeIfChanged(loading, "role", "progressbar");
    setAttributeIfChanged(loading, "aria-valuemin", "0");
    setAttributeIfChanged(loading, "aria-valuemax", "100");
    setAttributeIfChanged(loading, "aria-label", loading.getAttribute("label") ?? loading.getAttribute("aria-label") ?? "Loading...");
    const progress = loading.getAttribute("progress");
    if (progress == null || progress === "") {
      loading.removeAttribute("aria-valuenow");
    } else {
      setAttributeIfChanged(loading, "aria-valuenow", progress);
    }
  }
}

function syncCommandOptionElement(option: HTMLElement, item: CommandItemRecord | null, visible: boolean) {
  setDefaultAttribute(option, "role", "option");
  setAttributeIfChanged(option, "tabindex", "-1");
  setAttributeIfChanged(option, "aria-selected", String(item ? false : option.hasAttribute("selected")));
  const value = item?.value ?? commandOptionValue(option);
  if (value) {
    setAttributeIfChanged(option, "data-value", value);
  } else {
    option.removeAttribute("data-value");
  }

  const disabled = item?.disabled ?? (option.hasAttribute("disabled") || option.getAttribute("aria-disabled") === "true");
  if (disabled) {
    setAttributeIfChanged(option, "aria-disabled", "true");
    option.setAttribute("data-disabled", "");
  } else {
    option.removeAttribute("aria-disabled");
    option.removeAttribute("data-disabled");
  }

  option.hidden = !visible;
}

function commandShouldFilter(root: HTMLElement) {
  if (!root.hasAttribute("should-filter") && !root.hasAttribute("shouldFilter")) {
    return true;
  }

  return hasCommandBoolean(root, "should-filter", "shouldFilter");
}

function setAttributeIfChanged(element: Element, attribute: string, value: string) {
  if (element.getAttribute(attribute) !== value) {
    element.setAttribute(attribute, value);
  }
}

function setDefaultAttribute(element: Element, attribute: string, value: string) {
  if (!element.hasAttribute(attribute)) {
    element.setAttribute(attribute, value);
  }
}
