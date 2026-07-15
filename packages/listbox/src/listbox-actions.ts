import {
  isListboxDisabled,
  listboxItemValue,
  listboxPartName,
  listboxRoot,
  listboxRootValues,
  listboxSelectionMode,
  writeListboxRootValues,
} from "./listbox-dom";
import { syncListboxTreeFromRoot } from "./listbox-sync";

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

export function handleListboxKeyDown(_element: HTMLElement, _event: KeyboardEvent) {
  return false;
}
