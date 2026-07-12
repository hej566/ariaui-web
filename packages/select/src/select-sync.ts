import {
  ensureSelectId,
  isSelectDisabled,
  selectElements,
  selectItemValue,
  selectMenu,
  selectMenuItems,
  selectPartName,
  selectRoot,
  selectRootContent,
  selectRootLabel,
  selectRootTrigger,
  selectRootValues,
  selectSelectionMode,
  selectSubContent,
  selectSubTrigger,
  selectValuesFromAttribute,
  writeSelectRootValues,
} from "./select-dom";

type SelectSyncState = {
  activeItemId: string | null;
  defaultOpenApplied: boolean;
  defaultValueApplied: boolean;
  syncing: boolean;
};

const selectStates = new WeakMap<Element, SelectSyncState>();
let selectId = 0;

function nextSelectId() {
  selectId += 1;
  return selectId;
}

function selectState(root: Element) {
  let state = selectStates.get(root);

  if (!state) {
    state = {
      activeItemId: null,
      defaultOpenApplied: false,
      defaultValueApplied: false,
      syncing: false,
    };
    selectStates.set(root, state);
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

function rootValues(root: Element, state: SelectSyncState) {
  if (!state.defaultValueApplied && !root.hasAttribute("value") && root.hasAttribute("default-value")) {
    writeSelectRootValues(root, selectValuesFromAttribute(root.getAttribute("default-value")));
    state.defaultValueApplied = true;
  }

  if (root.hasAttribute("value")) {
    state.defaultValueApplied = true;
  }

  return selectRootValues(root);
}

export function setSelectOpen(element: HTMLElement, open: boolean) {
  setBooleanAttribute(element, "open", open);
  element.setAttribute("data-state", open ? "open" : "closed");
}

export function syncSelectTreeAround(element: HTMLElement) {
  const root = element.matches("aria-select") ? element : selectRoot(element);
  if (root instanceof HTMLElement) {
    syncSelectTreeFromRoot(root);
    return;
  }

  syncSelectStandalonePart(element);
}

export function syncSelectTreeFromRoot(root: HTMLElement) {
  const state = selectState(root);
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

    const values = rootValues(root, state);
    const selectedSet = new Set(values);
    const mode = selectSelectionMode(root);
    const isOpen = root.hasAttribute("open");
    root.setAttribute("data-state", isOpen ? "open" : "closed");

    const label = selectRootLabel(root);
    const trigger = selectRootTrigger(root);
    const content = selectRootContent(root);

    if (label) {
      ensureSelectId(label, "label", nextSelectId);
    }

    if (trigger) {
      syncSelectTrigger(root, trigger, content, label, isOpen, values.length > 0);
    }

    if (content) {
      syncSelectContent(content, trigger, label, isOpen, mode, selectedSet);
    }

    for (const group of selectElements(root, "aria-select-group")) {
      syncSelectGroup(group);
    }

    for (const sub of selectElements(root, "aria-select-sub")) {
      syncSelectSub(root, sub, mode, selectedSet, isOpen);
    }
  } finally {
    state.syncing = false;
  }
}

export function syncSelectStandalonePart(element: HTMLElement) {
  const partName = selectPartName(element);

  if (partName === "Trigger") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "combobox");
    }
    element.setAttribute("aria-haspopup", "listbox");
    if (!element.hasAttribute("aria-expanded")) {
      element.setAttribute("aria-expanded", "false");
    }
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
    if (!element.hasAttribute("data-has-value")) {
      element.setAttribute("data-has-value", "false");
    }
  }

  if (partName === "Content" || partName === "SubContent") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "listbox");
    }
    if (!element.hasAttribute("aria-multiselectable")) {
      element.setAttribute("aria-multiselectable", "false");
    }
    setAttributeIfChanged(element, "tabindex", element.getAttribute("tabindex") ?? "0");
    if (!element.hasAttribute("open") && !element.hasAttribute("force-mount")) {
      element.hidden = true;
    }
  }

  if (partName === "SubTrigger") {
    if (!element.hasAttribute("role")) {
      element.setAttribute("role", "option");
    }
    element.setAttribute("aria-selected", String(element.hasAttribute("selected")));
    element.setAttribute("aria-expanded", "false");
    element.setAttribute("aria-haspopup", "listbox");
  }
}

export function syncSelectTrigger(root: HTMLElement, trigger: HTMLElement, content: HTMLElement | null, label: HTMLElement | null, isOpen: boolean, hasValue: boolean) {
  ensureSelectId(trigger, "trigger", nextSelectId);
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("data-has-value", String(hasValue));
  const rootDisabled = isSelectDisabled(root);
  const triggerDisabled = trigger.hasAttribute("disabled") || (trigger.getAttribute("aria-disabled") === "true" && !trigger.hasAttribute("data-select-root-disabled"));
  trigger.setAttribute("tabindex", rootDisabled || triggerDisabled ? "-1" : "0");
  trigger.removeAttribute("data-state");

  if (label) {
    trigger.setAttribute("aria-labelledby", ensureSelectId(label, "label", nextSelectId));
  }

  if (rootDisabled) {
    trigger.setAttribute("aria-disabled", "true");
    trigger.setAttribute("data-disabled", "");
    trigger.setAttribute("data-select-root-disabled", "");
  } else {
    trigger.removeAttribute("data-select-root-disabled");
  }

  if (!rootDisabled && triggerDisabled) {
    trigger.setAttribute("aria-disabled", "true");
    trigger.setAttribute("data-disabled", "");
  } else if (!rootDisabled && !triggerDisabled) {
    trigger.removeAttribute("aria-disabled");
    trigger.removeAttribute("data-disabled");
  }

  if (isOpen && content) {
    trigger.setAttribute("aria-controls", ensureSelectId(content, "content", nextSelectId));
  } else {
    trigger.removeAttribute("aria-controls");
  }

  trigger.setAttribute("aria-expanded", String(isOpen));
}

export function syncSelectContent(content: HTMLElement, trigger: HTMLElement | null, label: HTMLElement | null, isOpen: boolean, mode: "single" | "multiple", selectedSet: Set<string>) {
  content.setAttribute("role", "listbox");
  content.setAttribute("aria-multiselectable", String(mode === "multiple"));
  setAttributeIfChanged(content, "tabindex", "0");
  setSelectOpen(content, isOpen);
  content.hidden = !isOpen && !content.hasAttribute("force-mount");

  if (label) {
    content.setAttribute("aria-labelledby", ensureSelectId(label, "label", nextSelectId));
  } else if (trigger) {
    content.setAttribute("aria-labelledby", ensureSelectId(trigger, "trigger", nextSelectId));
  }

  syncSelectItems(content, selectedSet);
}

function syncSelectGroup(group: HTMLElement) {
  if (!group.hasAttribute("role")) {
    group.setAttribute("role", "group");
  }

  const label = Array.from(group.querySelectorAll<HTMLElement>("aria-select-group-label")).find((candidate) => candidate.closest("aria-select-group") === group) ?? null;
  if (label) {
    group.setAttribute("aria-labelledby", ensureSelectId(label, "group-label", nextSelectId));
  }
}

export function syncSelectItems(menu: HTMLElement, selectedSet: Set<string>) {
  const activeId = menu.getAttribute("aria-activedescendant");
  for (const item of selectMenuItems(menu)) {
    syncSelectItem(item, selectedSet, Boolean(activeId && item.id === activeId));
  }
}

export function syncSelectItem(item: HTMLElement, selectedSet: Set<string>, active: boolean) {
  const partName = selectPartName(item);
  if (!item.id) {
    ensureSelectId(item, partName === "SubTrigger" ? "sub-trigger" : "option", nextSelectId);
  }

  item.setAttribute("role", "option");
  item.setAttribute("tabindex", active ? "0" : "-1");
  item.setAttribute("data-active", String(active));

  if (item.hasAttribute("disabled")) {
    item.setAttribute("aria-disabled", "true");
    item.setAttribute("data-disabled", "");
  } else {
    item.removeAttribute("aria-disabled");
    item.removeAttribute("data-disabled");
  }

  if (partName === "SubTrigger") {
    item.setAttribute("aria-selected", "false");
    item.setAttribute("aria-haspopup", "listbox");
    return;
  }

  const value = selectItemValue(item);
  const selected = selectedSet.has(value);
  item.setAttribute("data-value", value);
  item.setAttribute("aria-selected", String(selected));
  item.setAttribute("data-state", selected ? "checked" : "unchecked");
}

export function setSelectActiveItem(menu: HTMLElement, item: HTMLElement | null, focus = true) {
  if (item && !item.id) {
    ensureSelectId(item, selectPartName(item) === "SubTrigger" ? "sub-trigger" : "option", nextSelectId);
  }

  if (item) {
    menu.setAttribute("aria-activedescendant", item.id);
  } else {
    menu.removeAttribute("aria-activedescendant");
  }

  const root = selectRoot(menu);
  const selectedSet = root ? new Set(selectRootValues(root)) : new Set<string>();
  for (const candidate of selectMenuItems(menu)) {
    syncSelectItem(candidate, selectedSet, candidate === item);
  }

  if (item && focus) {
    item.focus({ preventScroll: true });
  }
}

export function syncSelectSub(root: HTMLElement, sub: HTMLElement, mode: "single" | "multiple", selectedSet: Set<string>, rootOpen: boolean) {
  if (!sub.hasAttribute("data-select-default-open-applied")) {
    sub.setAttribute("data-select-default-open-applied", "");
    if ((sub.hasAttribute("default-open") || sub.hasAttribute("defaultopen")) && !sub.hasAttribute("open")) {
      sub.setAttribute("open", "");
    }
  }

  const trigger = selectSubTrigger(sub);
  const content = selectSubContent(sub);
  const isOpen = rootOpen && sub.hasAttribute("open");
  sub.setAttribute("data-state", isOpen ? "open" : "closed");

  if (trigger) {
    trigger.setAttribute("role", "option");
    trigger.setAttribute("aria-selected", "false");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("data-state", isOpen ? "open" : "closed");
    if (isOpen && content) {
      trigger.setAttribute("aria-controls", ensureSelectId(content, "sub-content", nextSelectId));
    } else {
      trigger.removeAttribute("aria-controls");
    }
    trigger.setAttribute("aria-expanded", String(isOpen));
  }

  if (content) {
    content.setAttribute("role", "listbox");
    content.setAttribute("aria-multiselectable", String(mode === "multiple"));
    setAttributeIfChanged(content, "tabindex", "0");
    setSelectOpen(content, isOpen);
    content.hidden = !isOpen && !content.hasAttribute("force-mount");
    if (trigger) {
      content.setAttribute("aria-labelledby", ensureSelectId(trigger, "sub-trigger", nextSelectId));
    }
    syncSelectItems(content, selectedSet);
  }
}

export function closeSelectSubmenus(root: HTMLElement) {
  for (const sub of selectElements(root, "aria-select-sub")) {
    setSelectOpen(sub, false);
  }
}

export function activeSelectItem(menu: HTMLElement) {
  const activeId = menu.getAttribute("aria-activedescendant");
  return activeId ? menu.ownerDocument.getElementById(activeId) as HTMLElement | null : null;
}

export function selectMenuForItem(item: HTMLElement) {
  return selectMenu(item) as HTMLElement | null;
}
