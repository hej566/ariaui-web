import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

const loadingAttributes = ["aria-hidden", "data-inline-skeleton", "data-state", "inert", "tabindex"] as const;
const compositionExcludedAttributes = new Set([
  "aria-hidden",
  "class",
  "data-ariaui-web",
  "data-inline-skeleton",
  "data-package",
  "data-part",
  "data-state",
  "inert",
  "loading",
  "native-composition",
  "part",
  "style",
  "tabindex",
]);

type SkeletonState = {
  authoredDisplay: string;
  host: HTMLElement | null;
  hostAttributes: Map<string, string | null>;
  observer: MutationObserver | null;
  syncing: boolean;
};

const states = new WeakMap<SkeletonWebElement, SkeletonState>();

function stateFor(element: SkeletonWebElement) {
  let state = states.get(element);
  if (!state) {
    state = {
      authoredDisplay: element.style.display,
      host: null,
      hostAttributes: new Map(),
      observer: null,
      syncing: false,
    };
    states.set(element, state);
  }
  return state;
}

function rememberAttribute(state: SkeletonState, host: HTMLElement, name: string) {
  if (!state.hostAttributes.has(name)) state.hostAttributes.set(name, host.getAttribute(name));
}

function setManagedAttribute(state: SkeletonState, host: HTMLElement, name: string, value: string | null) {
  rememberAttribute(state, host, name);
  if (value == null) host.removeAttribute(name);
  else host.setAttribute(name, value);
}

function restoreHost(state: SkeletonState) {
  if (!state.host) return;
  for (const [name, value] of state.hostAttributes) {
    if (value == null) state.host.removeAttribute(name);
    else state.host.setAttribute(name, value);
  }
  state.host = null;
  state.hostAttributes.clear();
}

function copyComposition(element: SkeletonWebElement, host: HTMLElement, state: SkeletonState) {
  rememberAttribute(state, host, "class");
  for (const token of element.classList) host.classList.add(token);

  rememberAttribute(state, host, "style");
  for (const property of Array.from(element.style)) {
    if (property !== "display") {
      host.style.setProperty(property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property));
    }
  }

  for (const attribute of Array.from(element.attributes)) {
    if (compositionExcludedAttributes.has(attribute.name)) continue;
    setManagedAttribute(state, host, attribute.name, attribute.value);
  }
}

function applyLoadingState(element: SkeletonWebElement, host: HTMLElement, state: SkeletonState) {
  setManagedAttribute(state, host, "aria-hidden", "true");
  setManagedAttribute(state, host, "inert", "");
  setManagedAttribute(state, host, "tabindex", "-1");
  setManagedAttribute(state, host, "data-state", "loading");
  setManagedAttribute(state, host, "data-inline-skeleton", host === element && !element.firstElementChild ? "" : null);
}

function syncSkeleton(element: SkeletonWebElement) {
  const state = stateFor(element);
  if (state.syncing) return;
  state.syncing = true;
  try {
    restoreHost(state);
    element.style.display = element.loading && !element.nativeComposition ? state.authoredDisplay : "contents";
    if (!element.loading) {
      for (const attribute of loadingAttributes) element.removeAttribute(attribute);
      return;
    }

    const child = element.nativeComposition && element.firstElementChild instanceof HTMLElement
      ? element.firstElementChild
      : null;
    const host = child ?? element;
    state.host = host;
    if (child) copyComposition(element, child, state);
    applyLoadingState(element, host, state);
  } finally {
    state.syncing = false;
  }
}

function cssLength(value: string | number) {
  return typeof value === "number" ? `${value}px` : value;
}

export class SkeletonWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "class", "loading", "native-composition", "style"]));
  }

  get loading() { return this.getAttribute("loading") !== "false"; }
  set loading(value: boolean) {
    if (value) this.removeAttribute("loading");
    else this.setAttribute("loading", "false");
  }
  get nativeComposition() { return this.hasAttribute("native-composition"); }
  set nativeComposition(value: boolean) { this.toggleAttribute("native-composition", value); }
  get width() { return this.style.width; }
  set width(value: string | number) { this.style.width = cssLength(value); if (this.isConnected) syncSkeleton(this); }
  get minWidth() { return this.style.minWidth; }
  set minWidth(value: string | number) { this.style.minWidth = cssLength(value); if (this.isConnected) syncSkeleton(this); }
  get maxWidth() { return this.style.maxWidth; }
  set maxWidth(value: string | number) { this.style.maxWidth = cssLength(value); if (this.isConnected) syncSkeleton(this); }
  get height() { return this.style.height; }
  set height(value: string | number) { this.style.height = cssLength(value); if (this.isConnected) syncSkeleton(this); }
  get minHeight() { return this.style.minHeight; }
  set minHeight(value: string | number) { this.style.minHeight = cssLength(value); if (this.isConnected) syncSkeleton(this); }
  get maxHeight() { return this.style.maxHeight; }
  set maxHeight(value: string | number) { this.style.maxHeight = cssLength(value); if (this.isConnected) syncSkeleton(this); }

  override connectedCallback() {
    super.connectedCallback();
    const state = stateFor(this);
    if (!state.observer && typeof MutationObserver !== "undefined") {
      state.observer = new MutationObserver(() => syncSkeleton(this));
      state.observer.observe(this, { childList: true });
    }
    syncSkeleton(this);
  }

  disconnectedCallback() {
    const state = states.get(this);
    state?.observer?.disconnect();
    if (state) restoreHost(state);
    states.delete(this);
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncSkeleton(this);
  }
}

export function createSkeletonWebComponent(part: WebComponentPartSpec): typeof SkeletonWebElement {
  return class extends SkeletonWebElement {
    static override packageSlug = "skeleton";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
