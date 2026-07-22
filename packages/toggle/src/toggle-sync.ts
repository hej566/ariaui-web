import {
  createToggleButton,
  ownedToggleButton,
  toggleForwardedAttributes,
  togglePartName,
} from "./toggle-dom";

type ToggleState = {
  controlClass: string;
  controlId: string | null;
  controlled: boolean;
  initialized: boolean;
  observer: MutationObserver | null;
  onPressedChange: ((pressed: boolean) => void) | null;
  pressed: boolean;
  reflectingPressed: boolean;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, ToggleState>();
const boundButtons = new WeakSet<HTMLButtonElement>();

function stateFor(element: HTMLElement) {
  let state = states.get(element);
  if (!state) {
    const control = ownedToggleButton(element);
    const controlled = element.hasAttribute("pressed");
    state = {
      controlClass: control?.className ?? "",
      controlId: element.getAttribute("id"),
      controlled,
      initialized: false,
      observer: null,
      onPressedChange: null,
      pressed: controlled ? true : element.hasAttribute("default-pressed"),
      reflectingPressed: false,
      syncing: false,
    };
    states.set(element, state);
  }
  return state;
}

export function ensureToggleControl(element: HTMLElement) {
  let control = ownedToggleButton(element);
  if (!control) {
    control = createToggleButton(element.ownerDocument);
    element.append(control);
  }
  moveAuthoredChildren(element, control);
  bindToggleControl(element, control);
  return control;
}

function moveAuthoredChildren(element: HTMLElement, control: HTMLButtonElement) {
  for (const node of Array.from(element.childNodes)) {
    if (node !== control) control.append(node);
  }
}

function bindToggleControl(element: HTMLElement, control: HTMLButtonElement) {
  if (boundButtons.has(control)) return;
  control.addEventListener("click", (event) => {
    queueMicrotask(() => {
      if (event.defaultPrevented || control.disabled) return;
      const state = stateFor(element);
      const nextPressed = !state.pressed;
      if (!state.controlled) {
        state.pressed = nextPressed;
        syncTogglePart(element);
      }
      state.onPressedChange?.(nextPressed);
      element.dispatchEvent(new CustomEvent("pressedchange", {
        bubbles: true,
        detail: { pressed: nextPressed },
      }));
    });
  });
  boundButtons.add(control);
}

export function observeToggleHost(element: HTMLElement) {
  const state = stateFor(element);
  if (state.observer || typeof MutationObserver === "undefined") return;
  state.observer = new MutationObserver(() => syncTogglePart(element));
  state.observer.observe(element, { childList: true });
}

export function disconnectToggleHost(element: HTMLElement) {
  const state = states.get(element);
  state?.observer?.disconnect();
  if (state) state.observer = null;
}

export function updateTogglePressedAttribute(element: HTMLElement, pressed: boolean) {
  const state = stateFor(element);
  if (state.reflectingPressed) return;
  state.controlled = true;
  state.pressed = pressed;
}

export function getTogglePressed(element: HTMLElement) {
  return stateFor(element).pressed;
}

export function setTogglePressed(element: HTMLElement, pressed: boolean) {
  const state = stateFor(element);
  state.controlled = true;
  state.pressed = Boolean(pressed);
  state.reflectingPressed = true;
  element.toggleAttribute("pressed", state.pressed);
  state.reflectingPressed = false;
  syncTogglePart(element);
}

export function getToggleDefaultPressed(element: HTMLElement) {
  return element.hasAttribute("default-pressed");
}

export function setToggleDefaultPressed(element: HTMLElement, pressed: boolean) {
  element.toggleAttribute("default-pressed", Boolean(pressed));
  const state = stateFor(element);
  if (!state.initialized && !state.controlled) state.pressed = Boolean(pressed);
  syncTogglePart(element);
}

export function getTogglePressedChange(element: HTMLElement) {
  return stateFor(element).onPressedChange;
}

export function setTogglePressedChange(element: HTMLElement, callback: ((pressed: boolean) => void) | null) {
  stateFor(element).onPressedChange = callback;
}

export function syncTogglePart(element: HTMLElement) {
  if (togglePartName(element) !== "Root") return;
  const state = stateFor(element);
  if (state.syncing) return;
  state.syncing = true;
  try {
    if (!state.initialized) {
      if (element.hasAttribute("pressed")) {
        state.controlled = true;
        state.pressed = true;
      } else if (!state.controlled) {
        state.pressed = element.hasAttribute("default-pressed");
      }
      state.initialized = true;
    }

    const control = ensureToggleControl(element);
    const id = element.getAttribute("id");
    if (id) state.controlId = id;
    if (element.hasAttribute("id")) element.removeAttribute("id");

    control.id = state.controlId ?? "";
    const type = element.getAttribute("type");
    control.type = type === "reset" || type === "submit" ? type : "button";
    control.disabled = element.hasAttribute("disabled");
    control.setAttribute("aria-pressed", String(state.pressed));
    control.dataset.state = state.pressed ? "on" : "off";
    control.toggleAttribute("data-disabled", control.disabled);

    for (const attribute of toggleForwardedAttributes) {
      const value = element.getAttribute(attribute);
      if (value == null) control.removeAttribute(attribute);
      else control.setAttribute(attribute, value);
    }

    const className = `${state.controlClass} ${element.className}`.trim();
    control.className = Array.from(new Set(className.split(/\s+/).filter(Boolean))).join(" ");
    for (const attribute of Array.from(element.attributes)) {
      if (!attribute.name.startsWith("data-") || attribute.name.startsWith("data-ariaui-web")) continue;
      if (["data-disabled", "data-package", "data-part", "data-state", "data-value"].includes(attribute.name)) continue;
      control.setAttribute(attribute.name, attribute.value);
    }

    element.dataset.state = state.pressed ? "on" : "off";
    element.toggleAttribute("data-disabled", control.disabled);
    for (const attribute of ["role", "tabindex", "aria-disabled", "aria-expanded", "aria-pressed", "aria-selected", "data-value"]) {
      element.removeAttribute(attribute);
    }
  } finally {
    state.syncing = false;
  }
}
