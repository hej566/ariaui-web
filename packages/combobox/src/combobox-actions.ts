import {
  comboboxContent,
  comboboxInput,
  comboboxInputElementValue,
  comboboxItemValue,
  comboboxPartName,
  comboboxRoot,
  comboboxRootOwnsNode,
  comboboxRootValues,
  comboboxSelectionMode,
  isComboboxDisabled,
  writeComboboxInputValue,
  writeComboboxRootValues,
} from "./combobox-dom";
import {
  activeComboboxOption,
  clearComboboxActiveOption,
  firstEnabledComboboxOption,
  focusComboboxBoundaryOption,
  moveComboboxActiveOption,
  selectedComboboxValues,
  setComboboxActiveOption,
  setComboboxOpen,
  syncComboboxAfterInputChange,
  syncComboboxTreeFromRoot,
} from "./combobox-sync";

const comboboxOutsideHandlers = new WeakMap<HTMLElement, (event: Event) => void>();
const comboboxButtonMouseDownRoots = new WeakSet<HTMLElement>();

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}

function sameValues(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function dispatchComboboxOpenChange(root: HTMLElement, open: boolean) {
  root.dispatchEvent(new CustomEvent("openchange", {
    bubbles: true,
    detail: { open },
  }));
}

function dispatchComboboxInputValueChange(root: HTMLElement, value: string) {
  root.dispatchEvent(new CustomEvent("inputvaluechange", {
    bubbles: true,
    detail: { value },
  }));
}

function dispatchComboboxValueChange(root: HTMLElement, values: readonly string[]) {
  const mode = comboboxSelectionMode(root);
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: mode === "multiple" ? [...values] : values[0] ?? "",
      values: [...values],
    },
  }));
}

function setRootOpen(root: HTMLElement, open: boolean, emit = true) {
  const wasOpen = root.hasAttribute("open");
  setComboboxOpen(root, open);
  syncComboboxTreeFromRoot(root);

  if (emit && wasOpen !== open) {
    dispatchComboboxOpenChange(root, open);
  }
}

function openRootCombobox(root: HTMLElement, focusIntent: "none" | "first" | "last" | "selected" | "selected-last" = "none") {
  setRootOpen(root, true);

  if (focusIntent === "none") {
    return;
  }

  const content = comboboxContent(root);
  if (!content) {
    return;
  }

  const values = comboboxRootValues(root);
  const options = Array.from(content.querySelectorAll<HTMLElement>("aria-combobox-option")).filter((option) => !option.hidden && !isComboboxDisabled(option));
  const selectedOption = options.find((option) => values.includes(comboboxItemValue(option))) ?? null;
  const fallback = focusIntent === "last" || focusIntent === "selected-last" ? options[options.length - 1] ?? null : options[0] ?? null;
  setComboboxActiveOption(root, focusIntent.startsWith("selected") ? selectedOption ?? fallback : fallback);
}

function closeRootCombobox(root: HTMLElement) {
  setRootOpen(root, false);
}

function focusComboboxInput(root: HTMLElement) {
  const input = comboboxInput(root);
  if (!input || isComboboxDisabled(input)) {
    return;
  }

  input.focus({ preventScroll: true });
}

function clearComboboxInput(root: HTMLElement) {
  writeComboboxInputValue(root, comboboxInput(root), "");
}

function setComboboxValues(root: HTMLElement, values: readonly string[]) {
  const current = selectedComboboxValues(root);
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  writeComboboxRootValues(root, uniqueValues);
  clearComboboxInput(root);
  syncComboboxTreeFromRoot(root);

  if (!sameValues(current, uniqueValues)) {
    dispatchComboboxValueChange(root, uniqueValues);
  }
}

function selectComboboxOption(option: HTMLElement) {
  if (isComboboxDisabled(option)) {
    return false;
  }

  const root = comboboxRoot(option);
  if (!(root instanceof HTMLElement) || isComboboxDisabled(root)) {
    return false;
  }

  const value = comboboxItemValue(option);
  const mode = comboboxSelectionMode(root);

  if (mode === "multiple") {
    const current = comboboxRootValues(root);
    setComboboxValues(root, current.includes(value) ? current.filter((candidate) => candidate !== value) : [...current, value]);
    openRootCombobox(root, "none");
    return true;
  }

  setComboboxValues(root, [value]);
  closeRootCombobox(root);
  return true;
}

function removeLastComboboxValue(root: HTMLElement) {
  const current = comboboxRootValues(root);
  if (current.length === 0) {
    return false;
  }

  setComboboxValues(root, current.slice(0, -1));
  return true;
}

function handleComboboxListKeyDown(root: HTMLElement, event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!root.hasAttribute("open")) {
      openRootCombobox(root, "first");
    } else {
      moveComboboxActiveOption(root, 1);
    }
    return true;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!root.hasAttribute("open")) {
      openRootCombobox(root, "last");
    } else {
      moveComboboxActiveOption(root, -1);
    }
    return true;
  }

  if (event.key === "Home") {
    event.preventDefault();
    focusComboboxBoundaryOption(root, false);
    return true;
  }

  if (event.key === "End") {
    event.preventDefault();
    focusComboboxBoundaryOption(root, true);
    return true;
  }

  if (event.key === "Enter") {
    const active = activeComboboxOption(root);
    if (active) {
      event.preventDefault();
      selectComboboxOption(active);
      return true;
    }
  }

  if (event.key === "Escape" && root.hasAttribute("open")) {
    event.preventDefault();
    closeRootCombobox(root);
    return true;
  }

  return false;
}

export function bindComboboxOutsideEvents(root: HTMLElement) {
  if (comboboxOutsideHandlers.has(root)) {
    return;
  }

  const handler = (event: Event) => {
    if (!(event.target instanceof Node) || comboboxRootOwnsNode(root, event.target)) {
      return;
    }

    closeRootCombobox(root);
  };

  comboboxOutsideHandlers.set(root, handler);
  root.ownerDocument.addEventListener("pointerdown", handler, true);
}

export function unbindComboboxOutsideEvents(root: HTMLElement) {
  const handler = comboboxOutsideHandlers.get(root);
  if (!handler) {
    return;
  }

  comboboxOutsideHandlers.delete(root);
  root.ownerDocument.removeEventListener("pointerdown", handler, true);
}

export function handleComboboxInput(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || comboboxPartName(element) !== "Input") {
    return;
  }

  const root = comboboxRoot(element);
  if (!(root instanceof HTMLElement) || isComboboxDisabled(root) || isComboboxDisabled(element)) {
    return;
  }

  const value = event.target instanceof HTMLInputElement ? event.target.value : comboboxInputElementValue(element);
  writeComboboxInputValue(root, element, value);
  openRootCombobox(root, "none");
  syncComboboxAfterInputChange(root);
  setComboboxActiveOption(root, firstEnabledComboboxOption(comboboxContent(root) ?? element));
  dispatchComboboxInputValueChange(root, value);
}

export function handleComboboxMouseDown(element: HTMLElement, event: MouseEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const partName = comboboxPartName(element);
  const root = comboboxRoot(element);

  if (isComboboxDisabled(element) || isComboboxDisabled(root)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (!(root instanceof HTMLElement)) {
    return;
  }

  if (partName === "Input") {
    if (!root.hasAttribute("open")) {
      openRootCombobox(root, "none");
    }
    return;
  }

  if (partName === "Button") {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    comboboxButtonMouseDownRoots.add(root);
    if (root.hasAttribute("open")) {
      closeRootCombobox(root);
    } else {
      openRootCombobox(root, "none");
    }
    focusComboboxInput(root);
  }
}

export function handleComboboxClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  const partName = comboboxPartName(element);
  const root = comboboxRoot(element);

  if (isComboboxDisabled(element) || isComboboxDisabled(root)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (partName === "Input") {
    if (root instanceof HTMLElement) {
      openRootCombobox(root, "none");
    }
    event.stopPropagation();
    return;
  }

  if (partName === "Trigger" || partName === "Button") {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    if (partName === "Button" && comboboxButtonMouseDownRoots.has(root)) {
      comboboxButtonMouseDownRoots.delete(root);
      return;
    }

    if (root.hasAttribute("open")) {
      closeRootCombobox(root);
    } else {
      openRootCombobox(root, "none");
    }
    return;
  }

  if (partName === "Option") {
    if (!root) {
      if (event instanceof KeyboardEvent && event.key === "Enter") {
        element.click();
      }
      return;
    }

    event.preventDefault();
    selectComboboxOption(element);
  }
}

export function handleComboboxKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const partName = comboboxPartName(element);
  const root = comboboxRoot(element);

  if (isComboboxDisabled(element) || isComboboxDisabled(root)) {
    event.preventDefault();
    return;
  }

  if (partName === "Button" && !root) {
    if (event.key === "Enter") {
      event.preventDefault();
      element.click();
    }
    if (isSpaceKey(event)) {
      event.preventDefault();
    }
    return;
  }

  if (partName === "Option" && !root) {
    if (event.key === "Enter") {
      event.preventDefault();
      element.click();
    }
    if (isSpaceKey(event)) {
      event.preventDefault();
    }
    return;
  }

  if (!(root instanceof HTMLElement)) {
    return;
  }

  if (partName === "Trigger") {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openRootCombobox(root, "first");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openRootCombobox(root, "last");
      return;
    }

    if (event.key === "Enter" || isSpaceKey(event)) {
      event.preventDefault();
      if (root.hasAttribute("open")) {
        closeRootCombobox(root);
      } else {
        openRootCombobox(root, "first");
      }
      return;
    }
  }

  if (partName === "Input") {
    if (event.key === "Backspace" && comboboxInputElementValue(element) === "") {
      if (removeLastComboboxValue(root)) {
        event.preventDefault();
      }
      return;
    }

    handleComboboxListKeyDown(root, event);
    return;
  }

  if (partName === "Content") {
    handleComboboxListKeyDown(root, event);
    return;
  }

  if (partName === "Option") {
    if (event.key === "Enter" || isSpaceKey(event)) {
      event.preventDefault();
      selectComboboxOption(element);
      return;
    }

    handleComboboxListKeyDown(root, event);
  }
}

export function handleComboboxMouseOver(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const option = event.target.closest<HTMLElement>("aria-combobox-option");
  if (!option || comboboxRoot(option) !== root || isComboboxDisabled(option) || option.hidden) {
    return;
  }

  setComboboxActiveOption(root, option, false);
}

export function handleComboboxMouseOut(root: HTMLElement, event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const option = event.target.closest<HTMLElement>("aria-combobox-option");
  if (!option || comboboxRoot(option) !== root) {
    return;
  }

  clearComboboxActiveOption(root, option);
}
