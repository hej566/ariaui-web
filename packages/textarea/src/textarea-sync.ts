import {
  createOwnedTextarea,
  ownedTextarea,
  textareaForwardedAttributes,
  textareaPartName,
} from "./textarea-dom";

type TextareaSyncState = {
  controlClass: string;
  controlId: string | null;
  defaultValueApplied: boolean;
  forwardedData: Set<string>;
  observer: MutationObserver | null;
  role: string | null;
  syncing: boolean;
  tabIndex: string | null;
  valueAttribute: string | null;
};

const states = new WeakMap<HTMLElement, TextareaSyncState>();
const boundControls = new WeakSet<HTMLTextAreaElement>();

function stateFor(element: HTMLElement) {
  let state = states.get(element);
  if (!state) {
    const control = ownedTextarea(element);
    state = {
      controlClass: control?.className ?? "",
      controlId: element.getAttribute("id"),
      defaultValueApplied: false,
      forwardedData: new Set(),
      observer: null,
      role: element.getAttribute("role"),
      syncing: false,
      tabIndex: element.getAttribute("tabindex"),
      valueAttribute: null,
    };
    states.set(element, state);
  }
  return state;
}

export function ensureTextareaControl(element: HTMLElement) {
  let control = ownedTextarea(element);
  if (!control) {
    control = createOwnedTextarea(element.ownerDocument);
    element.append(control);
  }
  bindTextareaEvents(element, control);
  return control;
}

function bindTextareaEvents(element: HTMLElement, control: HTMLTextAreaElement) {
  if (boundControls.has(control)) return;
  control.addEventListener("input", () => {
    const value = control.value;
    queueMicrotask(() => {
      element.dispatchEvent(new CustomEvent("valuechange", {
        bubbles: true,
        detail: { value },
      }));
    });
  });
  boundControls.add(control);
}

export function observeTextareaHost(element: HTMLElement) {
  const state = stateFor(element);
  if (!state.observer && typeof MutationObserver !== "undefined") {
    state.observer = new MutationObserver(() => syncTextareaPart(element));
    state.observer.observe(element, { attributes: true });
  }
}

export function disconnectTextareaHost(element: HTMLElement) {
  const state = states.get(element);
  state?.observer?.disconnect();
  if (state) state.observer = null;
}

export function setTextareaHostValue(element: HTMLElement, value: string | null | undefined) {
  const control = ensureTextareaControl(element);
  const state = stateFor(element);
  control.value = value == null ? "" : String(value);
  state.defaultValueApplied = true;
  state.valueAttribute = element.getAttribute("value");
}

export function setTextareaHostDefaultValue(element: HTMLElement, value: string | null | undefined) {
  const nextValue = value == null ? "" : String(value);
  if (value == null) element.removeAttribute("default-value");
  else element.setAttribute("default-value", nextValue);
  const state = stateFor(element);
  const control = ensureTextareaControl(element);
  control.defaultValue = nextValue;
  if (!state.defaultValueApplied && !element.hasAttribute("value")) control.value = nextValue;
}

export function syncTextareaPart(element: HTMLElement) {
  if (textareaPartName(element) !== "Root") return;
  const state = stateFor(element);
  if (state.syncing) return;

  state.syncing = true;
  try {
    const control = ensureTextareaControl(element);
    captureControlId(element, state);
    syncTextareaValue(element, control, state);
    syncTextareaAttributes(element, control, state);
    removeHostSemantics(element);
  } finally {
    state.syncing = false;
  }
}

function captureControlId(element: HTMLElement, state: TextareaSyncState) {
  const id = element.getAttribute("id");
  if (id) state.controlId = id;
  if (element.hasAttribute("id")) element.removeAttribute("id");
}

function syncTextareaValue(
  element: HTMLElement,
  control: HTMLTextAreaElement,
  state: TextareaSyncState,
) {
  const valueAttribute = element.getAttribute("value");
  if (valueAttribute != null) {
    if (!state.defaultValueApplied || state.valueAttribute !== valueAttribute) {
      control.value = valueAttribute;
    }
    state.valueAttribute = valueAttribute;
    state.defaultValueApplied = true;
    return;
  }

  if (!state.defaultValueApplied) {
    const defaultValue = element.getAttribute("default-value") ?? element.getAttribute("defaultvalue") ?? "";
    control.defaultValue = defaultValue;
    control.value = defaultValue;
    state.defaultValueApplied = true;
  }
  state.valueAttribute = null;
}

function syncTextareaAttributes(
  element: HTMLElement,
  control: HTMLTextAreaElement,
  state: TextareaSyncState,
) {
  control.id = state.controlId ?? "";
  control.disabled = element.hasAttribute("disabled");
  control.required = element.hasAttribute("required");

  for (const attribute of textareaForwardedAttributes) {
    const value = element.getAttribute(attribute);
    if (value == null) control.removeAttribute(attribute);
    else control.setAttribute(attribute, value);
  }

  const hostRole = element.getAttribute("role");
  const hostTabIndex = element.getAttribute("tabindex");
  if (hostRole != null) state.role = hostRole;
  if (hostTabIndex != null) state.tabIndex = hostTabIndex;
  if (state.role == null) control.removeAttribute("role");
  else control.setAttribute("role", state.role);
  if (state.tabIndex == null) control.removeAttribute("tabindex");
  else control.setAttribute("tabindex", state.tabIndex);

  const className = `${state.controlClass} ${element.className}`.trim();
  control.className = Array.from(new Set(className.split(/\s+/).filter(Boolean))).join(" ");

  const nextData = new Set<string>();
  for (const attribute of Array.from(element.attributes)) {
    if (!attribute.name.startsWith("data-") || attribute.name.startsWith("data-ariaui-web")) continue;
    if (["data-disabled", "data-package", "data-part", "data-state", "data-value"].includes(attribute.name)) continue;
    nextData.add(attribute.name);
    control.setAttribute(attribute.name, attribute.value);
  }
  for (const name of state.forwardedData) {
    if (!nextData.has(name)) control.removeAttribute(name);
  }
  state.forwardedData = nextData;
}

function removeHostSemantics(element: HTMLElement) {
  for (const attribute of [
    "role",
    "tabindex",
    "aria-disabled",
    "aria-expanded",
    "aria-pressed",
    "aria-selected",
    "data-disabled",
    "data-state",
    "data-value",
  ]) {
    element.removeAttribute(attribute);
  }
}
