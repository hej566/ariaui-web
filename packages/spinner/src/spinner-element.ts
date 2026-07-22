import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

const svgNamespace = "http://www.w3.org/2000/svg";
const compositionExcludedAttributes = new Set([
  "class",
  "data-ariaui-web",
  "data-package",
  "data-part",
  "native-composition",
  "part",
  "style",
]);

type SpinnerState = {
  authoredDisplay: string;
  authoredHidden: string | null;
  authoredLabel: string | null;
  authoredRole: string | null;
  composedHost: Element | null;
  composedHostAttributes: Map<string, string | null>;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<SpinnerWebElement, SpinnerState>();

function stateFor(element: SpinnerWebElement) {
  let state = states.get(element);
  if (!state) {
    state = {
      authoredDisplay: element.style.display,
      authoredHidden: element.getAttribute("aria-hidden"),
      authoredLabel: element.getAttribute("aria-label"),
      authoredRole: element.getAttribute("role"),
      composedHost: null,
      composedHostAttributes: new Map(),
      observer: null,
      syncing: false,
    };
    states.set(element, state);
  }
  return state;
}

function setAttribute(element: Element, name: string, value: string | null) {
  if (value == null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

function setRootAttribute(
  element: SpinnerWebElement,
  state: SpinnerState,
  name: string,
  value: string | null,
) {
  const syncing = state.syncing;
  state.syncing = true;
  setAttribute(element, name, value);
  state.syncing = syncing;
}

function rememberComposedAttribute(
  state: SpinnerState,
  host: Element,
  name: string,
) {
  if (!state.composedHostAttributes.has(name)) {
    state.composedHostAttributes.set(name, host.getAttribute(name));
  }
}

function setComposedAttribute(
  state: SpinnerState,
  host: Element,
  name: string,
  value: string | null,
) {
  rememberComposedAttribute(state, host, name);
  setAttribute(host, name, value);
}

function restoreComposedHost(state: SpinnerState) {
  if (!state.composedHost) return;
  for (const [name, value] of state.composedHostAttributes) {
    setAttribute(state.composedHost, name, value);
  }
  state.composedHost = null;
  state.composedHostAttributes.clear();
}

function isDecorative(state: SpinnerState) {
  const value = state.authoredHidden;
  return value === "" || value === "true";
}

function applyAccessibility(element: SpinnerWebElement, state: SpinnerState) {
  setRootAttribute(element, state, "aria-hidden", state.authoredHidden);
  if (isDecorative(state)) {
    setRootAttribute(element, state, "role", state.authoredRole);
    setRootAttribute(element, state, "aria-label", state.authoredLabel);
    return;
  }

  setRootAttribute(element, state, "role", state.authoredRole ?? "status");
  setRootAttribute(element, state, "aria-label", state.authoredLabel ?? "Loading");
}

function createSpinnerGlyph(document: Document) {
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("data-spinner-glyph", "");
  svg.setAttribute("fill", "none");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("height", "1em");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "1em");

  const circle = document.createElementNS(svgNamespace, "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "9");
  circle.setAttribute("stroke", "currentColor");
  circle.setAttribute("stroke-opacity", "0.25");
  circle.setAttribute("stroke-width", "2");

  const path = document.createElementNS(svgNamespace, "path");
  path.setAttribute("d", "M21 12a9 9 0 0 0-9-9");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-width", "2");

  const animation = document.createElementNS(svgNamespace, "animateTransform");
  animation.setAttribute("attributeName", "transform");
  animation.setAttribute("dur", "0.8s");
  animation.setAttribute("from", "0 12 12");
  animation.setAttribute("repeatCount", "indefinite");
  animation.setAttribute("to", "360 12 12");
  animation.setAttribute("type", "rotate");

  path.append(animation);
  svg.append(circle, path);
  return svg;
}

function syncFallbackGlyph(element: SpinnerWebElement) {
  const glyph = element.querySelector(":scope > svg[data-spinner-glyph]");
  const hasAuthoredContent = Array.from(element.childNodes).some((node) => {
    if (node === glyph) return false;
    return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim());
  });

  if (element.nativeComposition || hasAuthoredContent) {
    glyph?.remove();
  } else if (!glyph) {
    element.append(createSpinnerGlyph(element.ownerDocument));
  }
}

function composeOntoChild(
  element: SpinnerWebElement,
  host: Element,
  state: SpinnerState,
) {
  state.composedHost = host;
  rememberComposedAttribute(state, host, "class");
  for (const token of element.classList) host.classList.add(token);

  if (host instanceof HTMLElement || host instanceof SVGElement) {
    rememberComposedAttribute(state, host, "style");
    for (const property of Array.from(element.style)) {
      if (property !== "display") {
        host.style.setProperty(
          property,
          element.style.getPropertyValue(property),
          element.style.getPropertyPriority(property),
        );
      }
    }
  }

  for (const attribute of Array.from(element.attributes)) {
    if (compositionExcludedAttributes.has(attribute.name)) continue;
    setComposedAttribute(state, host, attribute.name, attribute.value);
  }

  setRootAttribute(element, state, "role", null);
  setRootAttribute(element, state, "aria-label", null);
  setRootAttribute(element, state, "aria-hidden", null);
}

function syncSpinner(element: SpinnerWebElement) {
  const state = stateFor(element);
  if (state.syncing) return;
  state.syncing = true;
  try {
    restoreComposedHost(state);
    syncFallbackGlyph(element);
    applyAccessibility(element, state);

    const host = element.nativeComposition ? element.firstElementChild : null;
    element.style.display = host ? "contents" : state.authoredDisplay;
    if (host) composeOntoChild(element, host, state);
  } finally {
    state.syncing = false;
  }
}

export class SpinnerWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(
      new Set([
        ...super.observedAttributes,
        "aria-hidden",
        "aria-label",
        "class",
        "native-composition",
        "role",
        "style",
        "title",
      ]),
    );
  }

  get nativeComposition() {
    return this.hasAttribute("native-composition");
  }

  set nativeComposition(value: boolean) {
    this.toggleAttribute("native-composition", value);
  }

  override connectedCallback() {
    stateFor(this);
    super.connectedCallback();
    const state = stateFor(this);
    if (!state.observer && typeof MutationObserver !== "undefined") {
      state.observer = new MutationObserver(() => syncSpinner(this));
      state.observer.observe(this, { childList: true });
    }
    syncSpinner(this);
  }

  override attributeChangedCallback(
    name?: string,
    oldValue?: string | null,
    newValue?: string | null,
  ) {
    const state = stateFor(this);
    if (!state.syncing) {
      if (name === "role") state.authoredRole = newValue ?? null;
      if (name === "aria-hidden") state.authoredHidden = newValue ?? null;
      if (name === "aria-label") state.authoredLabel = newValue ?? null;
      if (name === "style" && !this.nativeComposition) {
        state.authoredDisplay = this.style.display;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  disconnectedCallback() {
    const state = states.get(this);
    if (!state) return;
    state.observer?.disconnect();
    state.observer = null;
    restoreComposedHost(state);
    this.style.display = state.authoredDisplay;
    state.syncing = true;
    try {
      applyAccessibility(this, state);
    } finally {
      state.syncing = false;
    }
  }

  override bindAriaWebEvents() {
    // Spinner is display-only and adds no activation behavior.
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncSpinner(this);
  }
}

export function createSpinnerWebComponent(
  part: WebComponentPartSpec,
): typeof SpinnerWebElement {
  return class extends SpinnerWebElement {
    static override packageSlug = "spinner";
    static override partName = part.name;
    static override defaultRole = null;
    static override defaultAttributes = {};
  };
}
