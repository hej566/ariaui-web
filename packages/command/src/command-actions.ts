import {
  commandInputValue,
  commandOptionValue,
  commandRoot,
  hasCommandBoolean,
  writeCommandSearchValue,
} from "./command-dom";
import { commandState, syncCommandTreeFromRoot } from "./command-sync";
import type { CommandOptionElement, CommandRootElement } from "./command-types";

function enabledVisibleItems(root: HTMLElement) {
  return Array.from(commandState(root).items.values()).filter(
    (item) => !item.disabled && !item.element.hidden,
  );
}

function dispatchSearchValueChange(root: HTMLElement, value: string) {
  (root as CommandRootElement).onSearchValueChange?.(value);
  root.dispatchEvent(new CustomEvent("searchvaluechange", {
    bubbles: true,
    detail: { value },
  }));
}

function dispatchValueChange(root: HTMLElement, value: string) {
  (root as CommandRootElement).onValueChange?.(value);
  root.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: { value },
  }));
}

function dispatchCommandSelect(root: HTMLElement, option: HTMLElement, value: string) {
  (option as CommandOptionElement).onSelect?.(value);
  root.dispatchEvent(new CustomEvent("commandselect", {
    bubbles: true,
    detail: { option, value },
  }));
}

export function setCommandActiveOption(root: HTMLElement, option: HTMLElement | null) {
  const state = commandState(root);
  state.activeId = option?.id ?? null;
  syncCommandTreeFromRoot(root);
  option?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
}

export function selectCommandOption(option: HTMLElement, options: { sourceEvent?: Event } = {}) {
  const root = commandRoot(option);
  if (!(root instanceof HTMLElement) || option.hasAttribute("disabled") || option.getAttribute("aria-disabled") === "true") {
    return false;
  }

  const commitSelection = () => {
    if (options.sourceEvent?.defaultPrevented) {
      return;
    }

    const value = commandOptionValue(option);
    const previous = root.getAttribute("value") ?? "";
    if (value) {
      root.setAttribute("value", value);
    } else {
      root.removeAttribute("value");
    }
    setCommandActiveOption(root, option);
    dispatchCommandSelect(root, option, value);
    if (previous !== value) {
      dispatchValueChange(root, value);
    }
  };

  if (options.sourceEvent) {
    queueMicrotask(commitSelection);
  } else {
    commitSelection();
  }
  return true;
}

export function handleCommandInput(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || element.getAttribute("data-part") !== "Input") {
    return;
  }

  const root = commandRoot(element);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const value = commandInputValue(element);
  const state = commandState(root);
  state.activeId = null;
  writeCommandSearchValue(root, element, value);
  syncCommandTreeFromRoot(root);
  dispatchSearchValueChange(root, value);
}

export function handleCommandClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || element.getAttribute("data-part") !== "Option") {
    return;
  }

  const root = commandRoot(element);
  if (!(root instanceof HTMLElement)) {
    if (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }

  if (!selectCommandOption(element, { sourceEvent: event })) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

export function handleCommandPointerMove(element: HTMLElement, event: Event) {
  if (event.defaultPrevented || element.getAttribute("data-part") !== "Option") {
    return;
  }

  const root = commandRoot(element);
  if (!(root instanceof HTMLElement) || hasCommandBoolean(root, "disable-pointer-selection")) {
    return;
  }

  if (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
    return;
  }

  setCommandActiveOption(root, element);
}

export function moveCommandActive(root: HTMLElement, change: 1 | -1) {
  const items = enabledVisibleItems(root);
  if (items.length === 0) {
    return;
  }

  const state = commandState(root);
  const currentIndex = state.activeId ? items.findIndex((item) => item.id === state.activeId) : -1;
  const loop = hasCommandBoolean(root, "loop");
  let nextIndex: number | undefined;

  if (currentIndex === -1) {
    nextIndex = change === 1 ? 0 : loop ? items.length - 1 : undefined;
  } else {
    const candidate = currentIndex + change;
    if (candidate >= 0 && candidate < items.length) {
      nextIndex = candidate;
    } else if (loop) {
      nextIndex = candidate < 0 ? items.length - 1 : 0;
    }
  }

  if (nextIndex !== undefined) {
    setCommandActiveOption(root, items[nextIndex]?.element ?? null);
  }
}

export function setCommandActiveToIndex(root: HTMLElement, index: number) {
  const item = enabledVisibleItems(root)[index];
  if (item) {
    setCommandActiveOption(root, item.element);
  }
}

export function handleCommandKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229) {
    return;
  }

  const root = element.matches("aria-command") ? element : commandRoot(element);
  if (!(root instanceof HTMLElement)) {
    handleStandaloneButtonLikeKeyDown(element, event);
    return;
  }

  if (event.key === "ArrowDown" || event.ctrlKey && (event.key === "n" || event.key === "j")) {
    event.preventDefault();
    moveCommandActive(root, 1);
    return;
  }

  if (event.key === "ArrowUp" || event.ctrlKey && (event.key === "p" || event.key === "k")) {
    event.preventDefault();
    moveCommandActive(root, -1);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    setCommandActiveToIndex(root, 0);
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    setCommandActiveToIndex(root, enabledVisibleItems(root).length - 1);
    return;
  }

  if (event.key === "Enter") {
    const active = commandState(root).activeId;
    const option = active ? root.ownerDocument.getElementById(active) : null;
    if (option instanceof HTMLElement) {
      event.preventDefault();
      selectCommandOption(option);
    }
  }
}

function handleStandaloneButtonLikeKeyDown(element: HTMLElement, event: KeyboardEvent) {
  const role = element.getAttribute("role");
  if (!role || !isButtonLikeRole(role)) {
    return;
  }

  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    return;
  }

  if (event.key === "Enter") {
    element.click();
  }

  if (isSpaceKey(event)) {
    event.preventDefault();
  }
}

function isButtonLikeRole(role: string | null) {
  return role === "button" || role === "checkbox" || role === "link" || role === "menuitemcheckbox" || role === "menuitemradio" || role === "option" || role === "radio" || role === "switch" || role === "tab";
}

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Space" || event.key === "Spacebar";
}
