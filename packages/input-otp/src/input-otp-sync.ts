import {
  createInputOtpInput,
  inputOtpCompositionTarget,
  inputOtpForwardedInputAttributes,
  inputOtpMaxLength,
  inputOtpPartName,
  inputOtpSlotIndex,
  inputOtpSlots,
  inputOtpState,
  isInputOtpRoot,
  isInputOtpSlot,
  nearestInputOtpRoot,
  ownedInputOtpInput,
} from "./input-otp-dom";

type InputOtpValueOptions = {
  emit?: boolean;
  read?: boolean;
};

export function ensureInputOtpControl(root: HTMLElement) {
  let input = ownedInputOtpInput(root);
  if (!input) {
    input = createInputOtpInput();
    root.prepend(input);
  }

  return input;
}

export function setInputOtpRootValue(root: HTMLElement, value?: string | null, options: InputOtpValueOptions = {}) {
  const input = ensureInputOtpControl(root);
  const state = inputOtpState(root);

  if (options.read) {
    return input.value;
  }

  const maxLength = inputOtpMaxLength(root);
  const nextValue = String(value ?? "").slice(0, maxLength);
  state.value = nextValue;
  state.valueAttribute = root.getAttribute("value");
  input.value = nextValue;
  syncInputOtpSlots(root);

  if (options.emit) {
    root.dispatchEvent(new CustomEvent("valuechange", {
      bubbles: true,
      detail: {
        value: nextValue,
      },
    }));

    if (nextValue.length === maxLength) {
      root.dispatchEvent(new CustomEvent("complete", {
        bubbles: true,
        detail: {
          value: nextValue,
        },
      }));
    }
  }

  return nextValue;
}

export function setInputOtpFocusedIndex(root: HTMLElement, index: number) {
  const state = inputOtpState(root);
  const maxLength = inputOtpMaxLength(root);
  state.focusedIndex = Math.min(Math.max(index, 0), Math.max(maxLength - 1, 0));
  syncInputOtpSlots(root);
}

export function setInputOtpSelection(root: HTMLElement, index: number) {
  const input = ensureInputOtpControl(root);
  const nextIndex = Math.min(Math.max(index, 0), Math.max(inputOtpMaxLength(root) - 1, 0));
  input.setSelectionRange(nextIndex, nextIndex);
  setInputOtpFocusedIndex(root, nextIndex);
}

export function syncInputOtpPart(element: HTMLElement) {
  const root = isInputOtpRoot(element) ? element : nearestInputOtpRoot(element);
  if (!root) {
    return;
  }

  const state = inputOtpState(root);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    syncInputOtpRoot(root);
  } finally {
    state.syncing = false;
  }
}

function syncInputOtpRoot(root: HTMLElement) {
  const state = inputOtpState(root);
  const input = ensureInputOtpControl(root);
  syncInputOtpRootPosition(root);
  syncInputOtpInput(root, input);

  const defaultValue = root.getAttribute("default-value") ?? root.getAttribute("defaultvalue") ?? "";

  const valueAttribute = root.getAttribute("value");
  if (valueAttribute != null) {
    setInputOtpRootValue(root, state.valueAttribute === valueAttribute ? state.value : valueAttribute, { emit: false });
    state.defaultValueApplied = true;
  } else if (!state.defaultValueApplied || (state.value === "" && defaultValue !== "")) {
    setInputOtpRootValue(root, defaultValue, { emit: false });
    state.defaultValueApplied = true;
  } else {
    setInputOtpRootValue(root, state.value, { emit: false });
  }

  observeInputOtpRoot(root);
  removeInputOtpRootStateReflection(root);
}

function syncInputOtpRootPosition(root: HTMLElement) {
  if (!root.style.position || root.style.position === "static") {
    root.style.position = "relative";
  }
}

function syncInputOtpInput(root: HTMLElement, input: HTMLInputElement) {
  input.type = "text";
  input.inputMode = "numeric";
  input.pattern = "[0-9]*";
  input.autocomplete = "one-time-code";
  input.maxLength = inputOtpMaxLength(root);
  input.disabled = root.hasAttribute("disabled");

  for (const attribute of inputOtpForwardedInputAttributes) {
    const value = root.getAttribute(attribute);
    if (value == null) {
      input.removeAttribute(attribute);
    } else {
      input.setAttribute(attribute, value);
    }
  }

  if ((root.hasAttribute("auto-focus") || root.hasAttribute("autofocus")) && document.activeElement !== input) {
    input.focus();
    const state = inputOtpState(root);
    state.focused = true;
    setInputOtpSelection(root, input.value.length);
  }
}

function syncInputOtpSlots(root: HTMLElement) {
  const state = inputOtpState(root);
  const slots = inputOtpSlots(root);
  const value = state.value;

  for (const slot of slots) {
    syncInputOtpSlot(slot, slots, value, state.focused, state.focusedIndex);
  }
}

function syncInputOtpSlot(slot: HTMLElement, slots: readonly HTMLElement[], value: string, focused: boolean, focusedIndex: number) {
  if (!isInputOtpSlot(slot)) {
    return;
  }

  const index = inputOtpSlotIndex(slot, slots);
  const char = index >= 0 ? value[index] ?? "" : "";
  const active = focused && focusedIndex === index;
  const target = inputOtpCompositionTarget(slot);

  slot.toggleAttribute("data-active", active);
  if (active) {
    slot.setAttribute("data-active", "true");
  }
  slot.setAttribute("data-slot-value", char);

  if (target !== slot) {
    target.toggleAttribute("data-active", active);
    if (active) {
      target.setAttribute("data-active", "true");
    }
    target.setAttribute("data-slot-value", char);
  }

  writeInputOtpSlotContent(target, char, active);
}

function writeInputOtpSlotContent(target: HTMLElement, char: string, active: boolean) {
  target.querySelector("[data-ariaui-web-input-otp-caret='true']")?.remove();

  if (target.childElementCount === 0) {
    target.textContent = char;
  } else if (char && target.textContent?.trim() === "") {
    target.textContent = char;
  }

  if (!char && active) {
    target.append(createInputOtpCaret());
  }
}

function createInputOtpCaret() {
  const caret = document.createElement("div");
  caret.dataset.ariauiWebInputOtpCaret = "true";
  caret.className = "ariaui-web-input-otp-caret pointer-events-none absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground";
  caret.style.pointerEvents = "none";
  caret.style.position = "absolute";
  caret.style.inset = "0";
  caret.style.display = "flex";
  caret.style.alignItems = "center";
  caret.style.justifyContent = "center";
  const line = document.createElement("div");
  line.style.height = "1rem";
  line.style.width = "1px";
  line.style.backgroundColor = "currentColor";
  caret.append(line);
  return caret;
}

function observeInputOtpRoot(root: HTMLElement) {
  const state = inputOtpState(root);
  if (state.observer || typeof MutationObserver === "undefined") {
    return;
  }

  state.observer = new MutationObserver(() => {
    syncInputOtpPart(root);
  });
  state.observer.observe(root, {
    childList: true,
  });
}

function removeInputOtpRootStateReflection(root: HTMLElement) {
  root.removeAttribute("aria-disabled");
  root.removeAttribute("aria-expanded");
  root.removeAttribute("aria-pressed");
  root.removeAttribute("aria-selected");
  root.removeAttribute("data-disabled");
  root.removeAttribute("data-state");
  root.removeAttribute("data-value");
}
