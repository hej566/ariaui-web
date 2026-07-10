import {
  createOwnedInput,
  inputForwardedAttributes,
  inputLegacyAttributes,
  inputPartName,
  ownedInput,
} from "./input-dom";

type InputSyncState = {
  defaultValueApplied: boolean;
  listening: boolean;
  role: string | null;
  syncing: boolean;
  valueAttribute: string | null;
};

const inputSyncStates = new WeakMap<HTMLElement, InputSyncState>();

function inputSyncState(element: HTMLElement) {
  let state = inputSyncStates.get(element);
  if (!state) {
    state = {
      defaultValueApplied: false,
      listening: false,
      role: null,
      syncing: false,
      valueAttribute: null,
    };
    inputSyncStates.set(element, state);
  }

  return state;
}

export function ensureInputControl(element: HTMLElement) {
  let input = ownedInput(element);
  if (!input) {
    input = createOwnedInput();
    element.append(input);
  }
  bindInputEvents(element, input);
  return input;
}

export function setInputHostValue(element: HTMLElement, value: string | null | undefined) {
  const input = ensureInputControl(element);
  const state = inputSyncState(element);
  input.value = value == null ? "" : String(value);
  state.defaultValueApplied = true;
  state.valueAttribute = element.getAttribute("value");
}

export function syncInputPart(element: HTMLElement) {
  if (inputPartName(element) !== "Root") {
    return;
  }

  const state = inputSyncState(element);
  if (state.syncing) {
    return;
  }

  state.syncing = true;
  try {
    const input = ensureInputControl(element);
    syncInputAttributes(element, input, state);
    removeInputStateReflection(element);
  } finally {
    state.syncing = false;
  }
}

function bindInputEvents(element: HTMLElement, input: HTMLInputElement) {
  const state = inputSyncState(element);
  if (state.listening) {
    return;
  }

  input.addEventListener("input", () => {
    element.dispatchEvent(new CustomEvent("valuechange", {
      bubbles: true,
      detail: {
        value: input.value,
      },
    }));
  });
  state.listening = true;
}

function syncInputAttributes(element: HTMLElement, input: HTMLInputElement, state: InputSyncState) {
  input.type = element.getAttribute("type") || "text";
  input.disabled = element.hasAttribute("disabled");
  input.required = element.hasAttribute("required");
  const hostRole = element.getAttribute("role");
  if (hostRole != null) {
    state.role = hostRole;
  }

  const valueAttribute = element.getAttribute("value");
  if (valueAttribute != null) {
    if (!state.defaultValueApplied || state.valueAttribute !== valueAttribute) {
      input.value = valueAttribute;
    }
    state.valueAttribute = valueAttribute;
    state.defaultValueApplied = true;
  } else if (!state.defaultValueApplied) {
    state.valueAttribute = null;
    input.value = element.getAttribute("default-value") ?? element.getAttribute("defaultvalue") ?? "";
    state.defaultValueApplied = true;
  } else {
    state.valueAttribute = null;
  }

  for (const attribute of inputForwardedAttributes) {
    const value = attribute === "role" && !element.hasAttribute("role") ? state.role : element.getAttribute(attribute);
    if (value == null) {
      input.removeAttribute(attribute);
    } else {
      input.setAttribute(attribute, value);
    }
  }

  for (const attribute of inputLegacyAttributes) {
    input.removeAttribute(attribute);
  }
}

function removeInputStateReflection(element: HTMLElement) {
  element.removeAttribute("role");
  element.removeAttribute("tabindex");
  element.removeAttribute("aria-disabled");
  element.removeAttribute("aria-expanded");
  element.removeAttribute("aria-pressed");
  element.removeAttribute("aria-selected");
  element.removeAttribute("data-disabled");
  element.removeAttribute("data-state");
  element.removeAttribute("data-value");
}
