import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

type SpinbuttonState = {
  controlled: boolean;
  defaultValueApplied: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<HTMLElement, SpinbuttonState>();
const managedInputText = new WeakSet<HTMLElement>();
const authoredDisabled = new WeakMap<HTMLElement, boolean>();

function partName(element: HTMLElement) {
  return (element.constructor as typeof SpinbuttonWebElement).partName;
}

function spinbuttonRoot(element: HTMLElement) {
  return element.matches("aria-spinbutton")
    ? element
    : element.closest<HTMLElement>("aria-spinbutton");
}

function stateFor(root: HTMLElement) {
  let state = states.get(root);
  if (!state) {
    state = {
      controlled: root.hasAttribute("value"),
      defaultValueApplied: false,
      observer: null,
      syncing: false,
    };
    states.set(root, state);
  }
  return state;
}

function numberAttribute(element: Element, name: string, fallback: number) {
  const attribute = element.getAttribute(name);
  if (attribute == null || attribute.trim() === "") return fallback;
  const value = Number(attribute);
  return Number.isFinite(value) ? value : fallback;
}

function configFor(root: HTMLElement) {
  const min = numberAttribute(root, "min", Number.MIN_SAFE_INTEGER);
  const max = Math.max(min, numberAttribute(root, "max", Number.MAX_SAFE_INTEGER));
  const authoredStep = numberAttribute(root, "step", 1);
  return {
    disabled: root.hasAttribute("disabled"),
    max,
    min,
    step: authoredStep > 0 ? authoredStep : 1,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function currentValue(root: HTMLElement) {
  const config = configFor(root);
  return clamp(numberAttribute(root, "value", root.hasAttribute("min") ? config.min : 0), config.min, config.max);
}

function ownedParts(root: HTMLElement, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => spinbuttonRoot(element) === root,
  );
}

function setBoolean(element: Element, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function setAttribute(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function syncControl(
  control: HTMLElement,
  disabled: boolean,
  label: "Decrement" | "Increment",
) {
  if (!authoredDisabled.has(control)) {
    authoredDisabled.set(control, control.hasAttribute("disabled"));
  }
  const computedDisabled = disabled || authoredDisabled.get(control) === true;
  setAttribute(control, "role", "button");
  setAttribute(control, "tabindex", "-1");
  if (!control.hasAttribute("aria-label")) setAttribute(control, "aria-label", label);
  setBoolean(control, "disabled", computedDisabled);
  setBoolean(control, "data-disabled", computedDisabled);
  if (computedDisabled) setAttribute(control, "aria-disabled", "true");
  else control.removeAttribute("aria-disabled");
}

function syncRoot(root: HTMLElement) {
  const state = stateFor(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    const config = configFor(root);
    if (!state.defaultValueApplied) {
      if (!root.hasAttribute("value")) {
        const initial = root.getAttribute("default-value") ??
          root.getAttribute("defaultvalue") ??
          (root.hasAttribute("min") ? String(config.min) : "0");
        root.setAttribute("value", String(clamp(Number(initial), config.min, config.max)));
      }
      state.defaultValueApplied = true;
    }

    const value = currentValue(root);
    if (root.getAttribute("value") !== String(value)) root.setAttribute("value", String(value));
    setBoolean(root, "data-disabled", config.disabled);

    for (const input of ownedParts(root, "aria-spinbutton-input")) {
      setAttribute(input, "role", "spinbutton");
      setAttribute(input, "aria-valuenow", String(value));
      setAttribute(input, "aria-valuemin", String(config.min));
      setAttribute(input, "aria-valuemax", String(config.max));
      setAttribute(input, "tabindex", config.disabled ? "-1" : "0");
      setBoolean(input, "data-disabled", config.disabled);
      if (config.disabled) setAttribute(input, "aria-disabled", "true");
      else input.removeAttribute("aria-disabled");
      if (root.hasAttribute("value-text-prefix") || root.hasAttribute("value-text-suffix")) {
        setAttribute(
          input,
          "aria-valuetext",
          `${root.getAttribute("value-text-prefix") ?? ""}${value}${root.getAttribute("value-text-suffix") ?? ""}`,
        );
      }
      if (input.childNodes.length === 0) managedInputText.add(input);
      if (managedInputText.has(input) && input.textContent !== String(value)) {
        input.textContent = String(value);
      }
    }

    for (const control of ownedParts(root, "aria-spinbutton-decrement")) {
      syncControl(control, config.disabled || value <= config.min, "Decrement");
    }
    for (const control of ownedParts(root, "aria-spinbutton-increment")) {
      syncControl(control, config.disabled || value >= config.max, "Increment");
    }
  } finally {
    state.syncing = false;
  }
}

function requestValue(root: HTMLElement, requestedValue: number) {
  const state = stateFor(root);
  const config = configFor(root);
  if (config.disabled) return;
  const value = clamp(requestedValue, config.min, config.max);
  if (value === currentValue(root)) return;
  root.dispatchEvent(
    new CustomEvent("valuechange", {
      bubbles: true,
      detail: { value },
    }),
  );
  if (!state.controlled) {
    root.setAttribute("value", String(value));
    syncRoot(root);
  }
}

function handleRootClick(root: HTMLElement, event: Event) {
  if (event.defaultPrevented || !(event.target instanceof Element)) return;
  const control = event.target.closest<HTMLElement>(
    "aria-spinbutton-increment, aria-spinbutton-decrement",
  );
  if (!control || spinbuttonRoot(control) !== root || control.hasAttribute("disabled")) return;
  const config = configFor(root);
  const direction = control.matches("aria-spinbutton-increment") ? 1 : -1;
  requestValue(root, currentValue(root) + direction * config.step);
}

function handleRootKeyDown(root: HTMLElement, event: KeyboardEvent) {
  if (configFor(root).disabled) return;
  const config = configFor(root);
  const value = currentValue(root);
  let nextValue: number | null = null;
  switch (event.key) {
    case "ArrowUp":
      nextValue = value + config.step;
      break;
    case "ArrowDown":
      nextValue = value - config.step;
      break;
    case "PageUp":
      nextValue = value + config.step * 10;
      break;
    case "PageDown":
      nextValue = value - config.step * 10;
      break;
    case "Home":
      nextValue = config.min;
      break;
    case "End":
      nextValue = config.max;
      break;
  }
  if (nextValue == null) return;
  event.preventDefault();
  requestValue(root, nextValue);
}

function syncAround(element: HTMLElement) {
  const root = spinbuttonRoot(element);
  if (root) syncRoot(root);
}

export class SpinbuttonWebElement extends AriaWebElement {
  static override packageSlug = "spinbutton";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "max",
      "min",
      "step",
      "value-text-prefix",
      "value-text-suffix",
    ]));
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? this.getAttribute("defaultvalue") ?? "";
  }

  set defaultValue(value: string) {
    if (value == null) this.removeAttribute("default-value");
    else this.setAttribute("default-value", String(value));
  }

  override connectedCallback() {
    super.connectedCallback();
    if (partName(this) === "Root") {
      const state = stateFor(this);
      if (!state.observer && typeof MutationObserver !== "undefined") {
        state.observer = new MutationObserver(() => syncRoot(this));
        state.observer.observe(this, { childList: true, subtree: true });
      }
    }
    syncAround(this);
  }

  disconnectedCallback() {
    if (partName(this) === "Root") {
      states.get(this)?.observer?.disconnect();
      const state = states.get(this);
      if (state) state.observer = null;
    }
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    if (partName(this) === "Root") handleRootClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    if (partName(this) === "Root") handleRootKeyDown(this, event);
  };
}

export function createSpinbuttonWebComponent(part: WebComponentPartSpec): typeof SpinbuttonWebElement {
  return class extends SpinbuttonWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
