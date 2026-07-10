import {
  inputOtpState,
  isInputOtpRoot,
  nearestInputOtpRoot,
  ownedInputOtpInput,
} from "./input-otp-dom";
import {
  ensureInputOtpControl,
  setInputOtpFocusedIndex,
  setInputOtpRootValue,
  setInputOtpSelection,
  syncInputOtpPart,
} from "./input-otp-sync";

export function bindInputOtpPart(element: HTMLElement) {
  if (!isInputOtpRoot(element)) {
    const root = nearestInputOtpRoot(element);
    if (root) {
      syncInputOtpPart(root);
    }
    return;
  }

  const root = element;
  const input = ensureInputOtpControl(root);
  const state = inputOtpState(root);

  if (!state.rootListening) {
    root.addEventListener("click", () => {
      focusInputOtpRoot(root);
    });
    state.rootListening = true;
  }

  if (!state.inputListening) {
    input.addEventListener("input", () => handleInputOtpInput(root));
    input.addEventListener("focus", () => handleInputOtpFocus(root));
    input.addEventListener("blur", () => handleInputOtpBlur(root));
    input.addEventListener("select", () => handleInputOtpSelect(root));
    input.addEventListener("keydown", (event) => handleInputOtpKeyDown(root, event));
    input.addEventListener("keyup", (event) => handleInputOtpKeyUp(root, event));
    state.inputListening = true;
  }
}

function handleInputOtpInput(root: HTMLElement) {
  const input = ownedInputOtpInput(root);
  const state = inputOtpState(root);
  if (!input) {
    return;
  }

  if (input.disabled) {
    input.value = state.value;
    return;
  }

  setInputOtpRootValue(root, input.value, { emit: true });
}

export function focusInputOtpRoot(root: HTMLElement, options?: FocusOptions) {
  const input = ensureInputOtpControl(root);
  if (input.disabled) {
    return;
  }

  input.focus(options);
  syncInputOtpFocusedRoot(root);
}

function syncInputOtpFocusedRoot(root: HTMLElement) {
  const input = ensureInputOtpControl(root);
  const state = inputOtpState(root);
  state.focused = true;
  setInputOtpSelection(root, input.value.length);
}

function handleInputOtpFocus(root: HTMLElement) {
  syncInputOtpFocusedRoot(root);
}

function handleInputOtpBlur(root: HTMLElement) {
  const state = inputOtpState(root);
  state.focused = false;
  state.focusedIndex = -1;
  syncInputOtpPart(root);
}

function handleInputOtpSelect(root: HTMLElement) {
  const input = ensureInputOtpControl(root);
  setInputOtpFocusedIndex(root, input.selectionStart ?? input.value.length);
}

export function handleInputOtpKeyDown(root: HTMLElement, event: KeyboardEvent) {
  if (event.key !== "Backspace" || event.defaultPrevented) {
    return;
  }

  const input = ensureInputOtpControl(root);
  if (input.disabled) {
    return;
  }

  const state = inputOtpState(root);
  const value = state.value;
  const selectionStart = input.selectionStart ?? value.length;
  const selectionEnd = input.selectionEnd ?? selectionStart;

  if (selectionStart !== selectionEnd) {
    event.preventDefault();
    setInputOtpRootValue(root, value.slice(0, selectionStart) + value.slice(selectionEnd), { emit: true });
    setInputOtpSelection(root, selectionStart);
    return;
  }

  if (value.length > 0 && value.length < input.maxLength && selectionStart === value.length) {
    event.preventDefault();
    const nextIndex = Math.max(value.length - 1, 0);
    setInputOtpRootValue(root, value.slice(0, nextIndex), { emit: true });
    setInputOtpSelection(root, nextIndex);
    return;
  }

  if (selectionStart < value.length) {
    event.preventDefault();
    setInputOtpRootValue(root, value.slice(0, selectionStart) + value.slice(selectionStart + 1), { emit: true });
    setInputOtpSelection(root, selectionStart);
  }
}

function handleInputOtpKeyUp(root: HTMLElement, event: KeyboardEvent) {
  const input = ensureInputOtpControl(root);
  if (event.key === "Tab") {
    setInputOtpSelection(root, input.value.length);
    return;
  }

  setInputOtpFocusedIndex(root, input.selectionStart ?? input.value.length);
}
