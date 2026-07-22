import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

type SplitterOrientation = "horizontal" | "vertical";

type ActiveDrag = {
  containerSize: number;
  index: number;
  lastPosition: number;
  pointerId: number;
  separator: SplitterWebElement;
};

type RootState = {
  activeDrag: ActiveDrag | null;
  defaultLayoutValue: string | null | undefined;
  initialized: boolean;
  layout: number[];
  observer: MutationObserver | null;
  panels: SplitterWebElement[];
  syncing: boolean;
};

const rootStates = new WeakMap<SplitterWebElement, RootState>();
const collapsedSizes = new WeakMap<SplitterWebElement, number>();
const eventBound = new WeakSet<SplitterWebElement>();
const activeRoots = new Set<SplitterWebElement>();
const dragListeners = new WeakMap<Window, {
  cancel: (event: PointerEvent) => void;
  move: (event: PointerEvent) => void;
  up: (event: PointerEvent) => void;
}>();
const documentDragStyles = new WeakMap<Document, {
  count: number;
  cursor: string;
  userSelect: string;
}>();

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function parseLayout(value: string | null) {
  if (!value?.trim()) return [];
  let source: unknown = value.split(",");
  if (value.trim().startsWith("[")) {
    try {
      source = JSON.parse(value) as unknown;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(source)) return [];
  return source
    .map((item) => Number(item))
    .filter(Number.isFinite)
    .map(round);
}

function stateFor(root: SplitterWebElement) {
  let state = rootStates.get(root);
  if (!state) {
    state = {
      activeDrag: null,
      defaultLayoutValue: undefined,
      initialized: false,
      layout: [],
      observer: null,
      panels: [],
      syncing: false,
    };
    rootStates.set(root, state);
  }
  return state;
}

function partName(element: SplitterWebElement) {
  return (element.constructor as typeof SplitterWebElement).partName;
}

function ownerRoot(element: Element) {
  const root = element.closest("aria-splitter");
  return root instanceof SplitterWebElement ? root : null;
}

function ownedElements(root: SplitterWebElement, selector: string) {
  return Array.from(root.querySelectorAll<SplitterWebElement>(selector))
    .filter((element) => ownerRoot(element) === root);
}

function orientationFor(root: SplitterWebElement): SplitterOrientation {
  return root.getAttribute("orientation") === "horizontal"
    ? "horizontal"
    : "vertical";
}

function isRootDisabled(root: SplitterWebElement) {
  return root.hasAttribute("disabled") || root.hasAttribute("is-disabled");
}

function separatorIndex(root: SplitterWebElement, separator: SplitterWebElement) {
  if (separator.hasAttribute("index")) {
    const index = Number(separator.getAttribute("index"));
    return Number.isInteger(index) ? index : -1;
  }
  return ownedElements(root, "aria-splitter-separator").indexOf(separator);
}

function syncPanel(
  panel: SplitterWebElement,
  size: number,
  orientation: SplitterOrientation,
  dragging: boolean,
) {
  const percentage = `${size}%`;
  panel.style.flexBasis = percentage;
  panel.style.flexGrow = "0";
  panel.style.flexShrink = "0";
  panel.style.overflow = "hidden";
  panel.style.transition = dragging
    ? "none"
    : "flex-basis 200ms ease-out, width 200ms ease-out, height 200ms ease-out";
  if (orientation === "vertical") {
    panel.style.width = percentage;
    panel.style.removeProperty("height");
  } else {
    panel.style.height = percentage;
    panel.style.removeProperty("width");
  }
}

function syncSeparator(
  root: SplitterWebElement,
  separator: SplitterWebElement,
  state: RootState,
  orientation: SplitterOrientation,
) {
  const index = separatorIndex(root, separator);
  const disabled = isRootDisabled(root);
  separator.setAttribute("aria-valuemin", "0");
  separator.setAttribute("aria-valuemax", "100");
  separator.setAttribute("aria-valuenow", String(Math.round(state.layout[index] ?? 0)));
  separator.setAttribute("aria-orientation", orientation);
  separator.setAttribute("aria-disabled", String(disabled));
  separator.setAttribute("tabindex", disabled ? "-1" : "0");
  separator.setAttribute("data-orientation", orientation);
  separator.toggleAttribute("data-disabled", disabled);
  separator.toggleAttribute("data-dragging", state.activeDrag?.separator === separator);
  if (!separator.style.touchAction) separator.style.touchAction = "none";
}

function initializeLayout(root: SplitterWebElement, state: RootState) {
  const defaultLayoutValue = root.getAttribute("default-layout");
  if (state.initialized && state.defaultLayoutValue === defaultLayoutValue) return;
  state.layout = parseLayout(defaultLayoutValue);
  state.defaultLayoutValue = defaultLayoutValue;
  state.initialized = true;
}

function syncRoot(root: SplitterWebElement) {
  const state = stateFor(root);
  if (state.syncing || !root.isConnected) return;
  state.syncing = true;
  try {
    initializeLayout(root, state);
    const orientation = orientationFor(root);
    root.setAttribute("data-orientation", orientation);

    const panels = ownedElements(root, "aria-splitter-panel");
    if (state.panels.length > 0 && (
      state.panels.length !== panels.length
      || state.panels.some((panel, index) => panel !== panels[index])
    )) {
      const priorSizes = new Map(
        state.panels.map((panel, index) => [panel, state.layout[index] ?? 0]),
      );
      state.layout = panels.map((panel, index) => (
        priorSizes.get(panel) ?? state.layout[index] ?? 0
      ));
    }
    state.panels = panels;
    panels.forEach((panel, index) => {
      const fallback = panel.hasAttribute("default-size")
        ? Number(panel.getAttribute("default-size"))
        : Number.NaN;
      const size = state.layout[index]
        ?? (Number.isFinite(fallback) ? round(fallback) : 0);
      syncPanel(panel, size, orientation, state.activeDrag !== null);
    });
    root.toggleAttribute(
      "data-invalid",
      panels.some((_, index) => !Number.isFinite(state.layout[index])),
    );

    for (const separator of ownedElements(root, "aria-splitter-separator")) {
      syncSeparator(root, separator, state, orientation);
    }
  } finally {
    state.syncing = false;
  }
}

function dispatchLayoutChange(root: SplitterWebElement, state: RootState) {
  root.dispatchEvent(new CustomEvent("layoutchange", {
    bubbles: true,
    detail: { layout: [...state.layout] },
  }));
}

function resize(root: SplitterWebElement, index: number, delta: number) {
  const state = stateFor(root);
  if (isRootDisabled(root) || index < 0 || index + 1 >= state.layout.length) {
    return false;
  }
  const primary = state.layout[index] ?? 0;
  const secondary = state.layout[index + 1] ?? 0;
  const pairSize = primary + secondary;
  const nextPrimary = round(Math.min(pairSize, Math.max(0, primary + delta)));
  const appliedDelta = round(nextPrimary - primary);
  if (appliedDelta === 0) return false;

  state.layout[index] = nextPrimary;
  state.layout[index + 1] = round(secondary - appliedDelta);
  syncRoot(root);
  dispatchLayoutChange(root, state);
  return true;
}

function handleSeparatorKeyDown(element: SplitterWebElement, event: KeyboardEvent) {
  const root = ownerRoot(element);
  if (!root || isRootDisabled(root)) return;
  const state = stateFor(root);
  const index = separatorIndex(root, element);
  if (index < 0 || index + 1 >= state.layout.length) return;

  const orientation = orientationFor(root);
  let delta: number | null = null;
  if (orientation === "vertical" && event.key === "ArrowLeft") delta = -5;
  if (orientation === "vertical" && event.key === "ArrowRight") delta = 5;
  if (orientation === "horizontal" && event.key === "ArrowUp") delta = -5;
  if (orientation === "horizontal" && event.key === "ArrowDown") delta = 5;
  if (event.key === "Home") delta = -(state.layout[index] ?? 0);
  if (event.key === "End") delta = state.layout[index + 1] ?? 0;

  if (event.key === "Enter") {
    const current = state.layout[index] ?? 0;
    if (current === 0) {
      delta = collapsedSizes.get(element) ?? 0;
    } else {
      collapsedSizes.set(element, current);
      delta = -current;
    }
  }

  if (delta == null) return;
  event.preventDefault();
  resize(root, index, delta);
}

function pointerPosition(event: PointerEvent, orientation: SplitterOrientation) {
  return orientation === "vertical" ? event.clientX : event.clientY;
}

function acquireDocumentDragStyles(root: SplitterWebElement, orientation: SplitterOrientation) {
  const document = root.ownerDocument;
  const body = document.body;
  let styles = documentDragStyles.get(document);
  if (!styles) {
    styles = {
      count: 0,
      cursor: body.style.cursor,
      userSelect: body.style.userSelect,
    };
    documentDragStyles.set(document, styles);
  }
  styles.count += 1;
  body.style.cursor = orientation === "vertical" ? "col-resize" : "row-resize";
  body.style.userSelect = "none";
}

function releaseDocumentDragStyles(root: SplitterWebElement) {
  const document = root.ownerDocument;
  const styles = documentDragStyles.get(document);
  if (!styles) return;
  styles.count -= 1;
  if (styles.count > 0) return;
  document.body.style.cursor = styles.cursor;
  document.body.style.userSelect = styles.userSelect;
  documentDragStyles.delete(document);
}

function listenersFor(view: Window) {
  let listeners = dragListeners.get(view);
  if (!listeners) {
    listeners = {
      cancel: (event) => handlePointerEnd(event, view),
      move: (event) => handlePointerMove(event, view),
      up: (event) => handlePointerEnd(event, view),
    };
    dragListeners.set(view, listeners);
  }
  return listeners;
}

function stopDragging(root: SplitterWebElement) {
  const state = stateFor(root);
  if (!state.activeDrag) return;
  state.activeDrag = null;
  activeRoots.delete(root);
  const view = root.ownerDocument.defaultView;
  if (view && !Array.from(activeRoots).some(
    (activeRoot) => activeRoot.ownerDocument.defaultView === view,
  )) {
    const listeners = listenersFor(view);
    view.removeEventListener("pointermove", listeners.move);
    view.removeEventListener("pointerup", listeners.up);
    view.removeEventListener("pointercancel", listeners.cancel);
  }
  releaseDocumentDragStyles(root);
  syncRoot(root);
}

function handlePointerMove(event: PointerEvent, view: Window) {
  for (const root of activeRoots) {
    if (root.ownerDocument.defaultView !== view) continue;
    const state = rootStates.get(root);
    const drag = state?.activeDrag;
    if (!drag || (event.pointerId != null && event.pointerId !== drag.pointerId)) continue;
    const orientation = orientationFor(root);
    const position = pointerPosition(event, orientation);
    const delta = ((position - drag.lastPosition) / drag.containerSize) * 100;
    drag.lastPosition = position;
    resize(root, drag.index, delta);
  }
}

function handlePointerEnd(event: PointerEvent, view: Window) {
  for (const root of Array.from(activeRoots)) {
    if (root.ownerDocument.defaultView !== view) continue;
    const drag = rootStates.get(root)?.activeDrag;
    if (!drag || (event.pointerId != null && event.pointerId !== drag.pointerId)) continue;
    stopDragging(root);
  }
}

function handleSeparatorPointerDown(element: SplitterWebElement, event: PointerEvent) {
  const root = ownerRoot(element);
  if (!root || isRootDisabled(root)) return;
  const state = stateFor(root);
  if (state.activeDrag) return;
  const index = separatorIndex(root, element);
  if (index < 0 || index + 1 >= state.layout.length) return;

  const orientation = orientationFor(root);
  const rect = root.getBoundingClientRect();
  const containerSize = (orientation === "vertical" ? rect.width : rect.height) || 1;
  event.preventDefault();
  try {
    element.setPointerCapture?.(event.pointerId);
  } catch {
    // Pointer capture is not available in every browser-like environment.
  }
  state.activeDrag = {
    containerSize,
    index,
    lastPosition: pointerPosition(event, orientation),
    pointerId: event.pointerId,
    separator: element,
  };
  activeRoots.add(root);
  acquireDocumentDragStyles(root, orientation);
  const view = root.ownerDocument.defaultView;
  if (view) {
    const listeners = listenersFor(view);
    view.addEventListener("pointermove", listeners.move);
    view.addEventListener("pointerup", listeners.up);
    view.addEventListener("pointercancel", listeners.cancel);
  }
  syncRoot(root);
}

export class SplitterWebElement extends AriaWebElement {
  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-layout",
      "default-size",
      "index",
      "is-disabled",
    ]));
  }

  get defaultLayout() {
    return parseLayout(this.getAttribute("default-layout"));
  }

  set defaultLayout(value: number[]) {
    this.setAttribute("default-layout", value.map(round).join(","));
  }

  get layout() {
    return [...stateFor(this).layout];
  }

  set layout(value: number[]) {
    const state = stateFor(this);
    state.layout = value.map(round);
    state.defaultLayoutValue = this.getAttribute("default-layout");
    state.initialized = true;
    syncRoot(this);
  }

  get orientation(): SplitterOrientation {
    return this.getAttribute("orientation") === "horizontal"
      ? "horizontal"
      : "vertical";
  }

  set orientation(value: SplitterOrientation) {
    this.setAttribute("orientation", value);
  }

  get isDisabled() {
    return this.hasAttribute("disabled") || this.hasAttribute("is-disabled");
  }

  set isDisabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  override bindAriaWebEvents() {
    super.bindAriaWebEvents();
    if (eventBound.has(this) || partName(this) !== "Separator") return;
    eventBound.add(this);
    this.addEventListener("keydown", (event) => {
      handleSeparatorKeyDown(this, event);
    });
    this.addEventListener("pointerdown", (event) => {
      handleSeparatorPointerDown(this, event);
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    if (partName(this) === "Root") {
      if (parseLayout(this.getAttribute("default-layout")).length === 0) {
        throw new Error("defaultLayout is required");
      }
      const state = stateFor(this);
      if (!state.observer && typeof MutationObserver !== "undefined") {
        state.observer = new MutationObserver(() => syncRoot(this));
        state.observer.observe(this, { childList: true, subtree: true });
      }
      syncRoot(this);
    } else {
      const root = ownerRoot(this);
      if (!root) throw new Error("Splitter components must be used within Root");
      syncRoot(root);
    }
  }

  disconnectedCallback() {
    if (partName(this) !== "Root") return;
    const state = rootStates.get(this);
    state?.observer?.disconnect();
    if (state) state.observer = null;
    stopDragging(this);
  }

  override afterAriaWebContractApplied() {
    if (!this.isConnected) return;
    const root = partName(this) === "Root" ? this : ownerRoot(this);
    if (root) syncRoot(root);
  }
}

export function createSplitterWebComponent(
  part: WebComponentPartSpec,
): typeof SplitterWebElement {
  return class extends SplitterWebElement {
    static override packageSlug = "splitter";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
