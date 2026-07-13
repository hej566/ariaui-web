import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

type CarouselOrientation = "horizontal" | "vertical";

type CarouselState = {
  cloneCount: number;
  initialized: boolean;
  renderIndex: number;
  selectedIndex: number;
  slideCount: number;
  transitionDurationBeforeRebase: string | null;
  transitionRestoreFrame: number | null;
  transitionRestoreSecondFrame: number | null;
  transitionSuppressed: boolean;
  transitioning: boolean;
};

const carouselStateByRoot = new WeakMap<HTMLElement, CarouselState>();
const syncingCarouselRoots = new WeakSet<HTMLElement>();
const carouselStateReflectionAttributes = [
  "aria-checked",
  "aria-disabled",
  "aria-expanded",
  "aria-pressed",
  "aria-selected",
  "data-disabled",
  "data-orientation",
  "data-state",
  "data-value",
] as const;

export class CarouselWebElement extends AriaWebElement {
  #carouselEventsBound = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "default-index",
      "defaultindex",
      "index",
      "loop",
      "slides-per-view",
      "slidesperview",
    ]));
  }

  get loop() {
    return this.hasAttribute("loop");
  }

  set loop(value: boolean) {
    setCarouselBooleanAttribute(this, "loop", value);
  }

  get slidesPerView() {
    return readCarouselNumberAttribute(this, ["slides-per-view", "slidesperview"], 1);
  }

  set slidesPerView(value: number | string | null | undefined) {
    setCarouselNumberAttribute(this, "slides-per-view", value);
  }

  get defaultIndex() {
    return readCarouselNumberAttribute(this, ["default-index", "defaultindex"], 0);
  }

  set defaultIndex(value: number | string | null | undefined) {
    setCarouselNumberAttribute(this, "default-index", value);
  }

  get index() {
    return readCarouselNumberAttribute(this, ["index"], 0);
  }

  set index(value: number | string | null | undefined) {
    setCarouselNumberAttribute(this, "index", value);
  }

  override bindAriaWebEvents() {
    super.bindAriaWebEvents();

    if (this.#carouselEventsBound) {
      return;
    }

    this.addEventListener("transitionend", this.handleCarouselTransitionComplete);
    this.addEventListener("transitioncancel", this.handleCarouselTransitionComplete);
    this.#carouselEventsBound = true;
  }

  override afterAriaWebContractApplied() {
    removeCarouselStateReflection(this);
    syncCarouselAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }

    const direction = carouselButtonDirection(this);
    if (direction === 0) {
      handleCarouselDefaultClick(this, event);
      return;
    }

    if (this.hasAttribute("disabled")) {
      handleCarouselDefaultClick(this, event);
      return;
    }

    if (!navigateCarouselFromButton(this, direction)) {
      handleCarouselDefaultClick(this, event);
    }
  };

  handleCarouselTransitionComplete = (event: Event) => {
    if ((this.constructor as typeof CarouselWebElement).partName !== "Container") {
      return;
    }

    const transitionEvent = event as Event & { propertyName?: string };
    if (transitionEvent.propertyName && transitionEvent.propertyName !== "transform") {
      return;
    }

    const root = closestCarouselRoot(this);
    if (!root) {
      return;
    }

    completeCarouselTransition(root);
  };
}

function setCarouselBooleanAttribute(element: HTMLElement, name: string, value: boolean) {
  if (value) {
    element.setAttribute(name, "");
  } else {
    element.removeAttribute(name);
  }
}

function setCarouselNumberAttribute(element: HTMLElement, name: string, value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, String(value));
  }
}

function readCarouselNumberAttribute(element: HTMLElement, names: readonly string[], fallback: number) {
  for (const name of names) {
    const value = element.getAttribute(name);
    if (value === null || value.trim() === "") {
      continue;
    }

    const numberValue = Number(value);
    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return fallback;
}

function readCarouselOrientation(root: HTMLElement): CarouselOrientation {
  return root.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
}

function readSlidesPerView(root: HTMLElement) {
  const value = Math.floor(readCarouselNumberAttribute(root, ["slides-per-view", "slidesperview"], 1));
  return Math.max(1, value);
}

function readCarouselIndex(root: HTMLElement, names: readonly string[], fallback: number) {
  return Math.max(0, Math.floor(readCarouselNumberAttribute(root, names, fallback)));
}

function carouselButtonDirection(element: HTMLElement) {
  const partName = (element.constructor as typeof CarouselWebElement).partName;
  if (partName === "PreviousButton") {
    return -1;
  }

  if (partName === "NextButton") {
    return 1;
  }

  return 0;
}

function handleCarouselDefaultClick(element: HTMLElement, event: Event) {
  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (element.getAttribute("role") === "button" && element.hasAttribute("pressed")) {
    setCarouselBooleanAttribute(element, "pressed", false);
  }
}

function closestCarouselRoot(element: HTMLElement) {
  if (element.matches("aria-carousel")) {
    return element;
  }

  return element.closest<HTMLElement>("aria-carousel");
}

function getCarouselState(root: HTMLElement) {
  let state = carouselStateByRoot.get(root);
  if (!state) {
    state = {
      cloneCount: 0,
      initialized: false,
      renderIndex: 0,
      selectedIndex: 0,
      slideCount: 0,
      transitionDurationBeforeRebase: null,
      transitionRestoreFrame: null,
      transitionRestoreSecondFrame: null,
      transitionSuppressed: false,
      transitioning: false,
    };
    carouselStateByRoot.set(root, state);
  }

  return state;
}

function syncCarouselAround(element: HTMLElement) {
  const root = closestCarouselRoot(element);
  if (!root || syncingCarouselRoots.has(root)) {
    return;
  }

  syncCarouselRoot(root);
}

function syncCarouselRoot(root: HTMLElement) {
  if (syncingCarouselRoots.has(root)) {
    return;
  }

  syncingCarouselRoots.add(root);
  try {
    const state = getCarouselState(root);
    const orientation = readCarouselOrientation(root);
    const axis = orientation === "vertical" ? "y" : "x";
    const container = root.querySelector<HTMLElement>("aria-carousel-container");
    const viewport = root.querySelector<HTMLElement>("aria-carousel-viewport");
    const loop = root.hasAttribute("loop");
    const slidesPerView = readSlidesPerView(root);

    root.setAttribute("data-axis", axis);
    root.setAttribute("data-orientation", orientation);

    if (viewport) {
      viewport.removeAttribute("role");
      viewport.setAttribute("aria-live", "polite");
      viewport.setAttribute("aria-atomic", "false");
    }

    if (!container) {
      syncCarouselButtons(root, 0, 0, loop);
      state.initialized = true;
      state.slideCount = 0;
      state.cloneCount = 0;
      return;
    }

    removeCarouselClones(container);
    const canonicalSlides = carouselCanonicalSlides(container);
    const slideCount = canonicalSlides.length;
    const cloneCount = loop && slideCount > 1 ? Math.min(slidesPerView, slideCount) : 0;
    const wasEmpty = state.slideCount === 0 && slideCount > 0;
    let selectedIndex = state.selectedIndex;

    if (root.hasAttribute("index")) {
      selectedIndex = readCarouselIndex(root, ["index"], 0);
    } else if (!state.initialized || wasEmpty) {
      selectedIndex = readCarouselIndex(root, ["default-index", "defaultindex"], 0);
    }

    selectedIndex = clampCarouselIndex(selectedIndex, slideCount);
    state.selectedIndex = selectedIndex;
    state.slideCount = slideCount;
    state.cloneCount = cloneCount;

    if (cloneCount > 0) {
      insertCarouselLoopClones(container, canonicalSlides, cloneCount);
    }

    if (!state.initialized || !state.transitioning) {
      state.renderIndex = cloneCount > 0 ? cloneCount + selectedIndex : selectedIndex;
    }

    state.initialized = true;

    const renderedSlides = carouselRenderedSlides(container);
    syncCarouselSlides(renderedSlides, selectedIndex, slideCount);
    syncCarouselContainer(container, orientation, state.renderIndex, renderedSlides, state.transitionSuppressed);
    syncCarouselButtons(root, selectedIndex, Math.max(0, slideCount - slidesPerView), cloneCount > 0);
  } finally {
    syncingCarouselRoots.delete(root);
  }
}

function removeCarouselStateReflection(element: HTMLElement) {
  const partName = (element.constructor as typeof CarouselWebElement).partName;
  if (partName === "PreviousButton" || partName === "NextButton") {
    return;
  }

  for (const attribute of carouselStateReflectionAttributes) {
    element.removeAttribute(attribute);
  }

  element.querySelector("input[data-ariaui-web-hidden-input='true']")?.remove();
}

function carouselCanonicalSlides(container: HTMLElement) {
  return Array.from(container.children).filter((child): child is HTMLElement => (
    child instanceof HTMLElement
    && child.matches("aria-carousel-slide")
    && child.getAttribute("data-clone") !== "true"
  ));
}

function carouselRenderedSlides(container: HTMLElement) {
  return Array.from(container.children).filter((child): child is HTMLElement => (
    child instanceof HTMLElement
    && child.matches("aria-carousel-slide")
  ));
}

function removeCarouselClones(container: HTMLElement) {
  for (const slide of carouselRenderedSlides(container)) {
    if (slide.getAttribute("data-clone") === "true") {
      slide.remove();
    }
  }
}

function insertCarouselLoopClones(container: HTMLElement, canonicalSlides: readonly HTMLElement[], cloneCount: number) {
  const leading = document.createDocumentFragment();
  const trailing = document.createDocumentFragment();
  const slideCount = canonicalSlides.length;

  for (let index = slideCount - cloneCount; index < slideCount; index += 1) {
    const slide = canonicalSlides[index];
    if (slide) {
      leading.append(createCarouselClone(slide, index));
    }
  }

  for (let index = 0; index < cloneCount; index += 1) {
    const slide = canonicalSlides[index];
    if (slide) {
      trailing.append(createCarouselClone(slide, index));
    }
  }

  container.insertBefore(leading, container.firstChild);
  container.append(trailing);
}

function createCarouselClone(slide: HTMLElement, canonicalIndex: number) {
  const clone = slide.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.removeAttribute("data-active");
  clone.setAttribute("data-clone", "true");
  clone.setAttribute("data-carousel-canonical-index", String(canonicalIndex));
  clone.setAttribute("aria-hidden", "true");
  return clone;
}

function syncCarouselSlides(renderedSlides: readonly HTMLElement[], selectedIndex: number, slideCount: number) {
  let canonicalIndex = 0;

  for (const slide of renderedSlides) {
    const cloneIndex = slide.getAttribute("data-carousel-canonical-index");
    const isClone = slide.getAttribute("data-clone") === "true";
    const index = isClone ? Number(cloneIndex) : canonicalIndex;
    const safeIndex = Number.isFinite(index) ? index : 0;

    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", String(safeIndex + 1) + " of " + String(slideCount));

    if (isClone) {
      slide.setAttribute("aria-hidden", "true");
      slide.removeAttribute("data-active");
    } else {
      slide.removeAttribute("aria-hidden");
      if (safeIndex === selectedIndex) {
        slide.setAttribute("data-active", "true");
      } else {
        slide.removeAttribute("data-active");
      }
      canonicalIndex += 1;
    }
  }
}

function syncCarouselContainer(
  container: HTMLElement,
  orientation: CarouselOrientation,
  renderIndex: number,
  renderedSlides: readonly HTMLElement[],
  transitionSuppressed: boolean,
) {
  const axis = orientation === "vertical" ? "y" : "x";
  container.setAttribute("data-axis", axis);
  container.setAttribute("data-orientation", orientation);
  container.style.display = "flex";
  container.style.flexDirection = orientation === "vertical" ? "column" : "row";
  container.style.transitionProperty = transitionSuppressed ? "none" : "transform";
  if (transitionSuppressed) {
    container.style.transitionDuration = "0ms";
  }
  container.style.willChange = "transform";
  container.style.transform = carouselTransformFor(container, renderedSlides, renderIndex, orientation);
}

function carouselTransformFor(
  container: HTMLElement,
  renderedSlides: readonly HTMLElement[],
  renderIndex: number,
  orientation: CarouselOrientation,
) {
  const slide = renderedSlides[renderIndex];
  if (!slide) {
    return "translate3d(0px, 0px, 0px)";
  }

  const containerRect = container.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const offset = orientation === "vertical"
    ? slideRect.top - containerRect.top
    : slideRect.left - containerRect.left;

  if (orientation === "vertical") {
    return "translate3d(0px, -" + String(Math.round(offset)) + "px, 0px)";
  }

  return "translate3d(-" + String(Math.round(offset)) + "px, 0px, 0px)";
}

function syncCarouselButtons(root: HTMLElement, selectedIndex: number, finiteMaxStart: number, loop: boolean) {
  const previousButtons = root.querySelectorAll<HTMLElement>("aria-carousel-previous-button");
  const nextButtons = root.querySelectorAll<HTMLElement>("aria-carousel-next-button");
  const previousDisabled = !loop && selectedIndex <= 0;
  const nextDisabled = !loop && selectedIndex >= finiteMaxStart;

  previousButtons.forEach((button) => setCarouselButtonDisabled(button, previousDisabled));
  nextButtons.forEach((button) => setCarouselButtonDisabled(button, nextDisabled));
}

function setCarouselButtonDisabled(button: HTMLElement, disabled: boolean) {
  if (disabled) {
    button.setAttribute("disabled", "");
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("data-disabled", "");
    button.setAttribute("tabindex", "-1");
  } else {
    button.removeAttribute("disabled");
    button.removeAttribute("aria-disabled");
    button.removeAttribute("data-disabled");
    if (button.getAttribute("tabindex") === "-1") {
      button.setAttribute("tabindex", "0");
    }
  }
}

function navigateCarouselFromButton(button: HTMLElement, direction: number) {
  const root = closestCarouselRoot(button);
  if (!root) {
    return false;
  }

  navigateCarousel(root, direction);
  return true;
}

function navigateCarousel(root: HTMLElement, direction: number) {
  const state = getCarouselState(root);
  const slideCount = state.slideCount;
  const cloneCount = state.cloneCount;
  const loop = cloneCount > 0;
  const slidesPerView = readSlidesPerView(root);
  const finiteMaxStart = Math.max(0, slideCount - slidesPerView);

  if (state.transitioning || slideCount === 0) {
    return;
  }

  if (root.hasAttribute("index")) {
    const controlledIndex = clampCarouselIndex(readCarouselIndex(root, ["index"], state.selectedIndex) + direction, slideCount);
    dispatchCarouselIndexChange(root, controlledIndex);
    return;
  }

  const previousIndex = state.selectedIndex;
  let selectedIndex = previousIndex;
  let renderIndex = state.renderIndex;

  if (loop) {
    if (direction > 0) {
      selectedIndex = previousIndex >= slideCount - 1 ? 0 : previousIndex + 1;
      renderIndex = previousIndex >= slideCount - 1 ? cloneCount + slideCount : cloneCount + selectedIndex;
    } else {
      selectedIndex = previousIndex <= 0 ? slideCount - 1 : previousIndex - 1;
      renderIndex = previousIndex <= 0 ? cloneCount - 1 : cloneCount + selectedIndex;
    }
  } else {
    selectedIndex = direction > 0
      ? Math.min(previousIndex + 1, finiteMaxStart)
      : Math.max(previousIndex - 1, 0);
    renderIndex = selectedIndex;
  }

  if (selectedIndex === previousIndex && renderIndex === state.renderIndex) {
    return;
  }

  state.selectedIndex = selectedIndex;
  state.renderIndex = renderIndex;
  state.transitioning = true;
  dispatchCarouselIndexChange(root, selectedIndex);
  syncCarouselRoot(root);
}

function completeCarouselTransition(root: HTMLElement) {
  const state = getCarouselState(root);
  const cloneCount = state.cloneCount;
  const slideCount = state.slideCount;
  const needsRebase = cloneCount > 0 && (state.renderIndex < cloneCount || state.renderIndex >= cloneCount + slideCount);

  state.transitioning = false;

  if (needsRebase) {
    const container = root.querySelector<HTMLElement>("aria-carousel-container");
    state.transitionDurationBeforeRebase = container?.style.transitionDuration ?? "";
    state.transitionSuppressed = true;
    state.renderIndex = cloneCount + state.selectedIndex;
    syncCarouselRoot(root);
    restoreCarouselTransitionSoon(root);
    return;
  }

  syncCarouselRoot(root);
}

function restoreCarouselTransitionSoon(root: HTMLElement) {
  const state = getCarouselState(root);
  const defaultView = root.ownerDocument.defaultView;

  cancelCarouselTransitionRestore(root);

  if (!defaultView || typeof defaultView.requestAnimationFrame !== "function") {
    restoreCarouselTransition(root);
    return;
  }

  state.transitionRestoreFrame = defaultView.requestAnimationFrame(() => {
    state.transitionRestoreFrame = null;
    state.transitionRestoreSecondFrame = defaultView.requestAnimationFrame(() => {
      state.transitionRestoreSecondFrame = null;
      restoreCarouselTransition(root);
    });
  });
}

function cancelCarouselTransitionRestore(root: HTMLElement) {
  const state = getCarouselState(root);
  const defaultView = root.ownerDocument.defaultView;

  if (!defaultView || typeof defaultView.cancelAnimationFrame !== "function") {
    state.transitionRestoreFrame = null;
    state.transitionRestoreSecondFrame = null;
    return;
  }

  if (state.transitionRestoreFrame !== null) {
    defaultView.cancelAnimationFrame(state.transitionRestoreFrame);
    state.transitionRestoreFrame = null;
  }

  if (state.transitionRestoreSecondFrame !== null) {
    defaultView.cancelAnimationFrame(state.transitionRestoreSecondFrame);
    state.transitionRestoreSecondFrame = null;
  }
}

function restoreCarouselTransition(root: HTMLElement) {
  const state = getCarouselState(root);
  const container = root.querySelector<HTMLElement>("aria-carousel-container");
  const transitionDuration = state.transitionDurationBeforeRebase;

  state.transitionSuppressed = false;
  state.transitionDurationBeforeRebase = null;

  if (!container) {
    return;
  }

  container.style.transitionProperty = "transform";
  if (transitionDuration === null || transitionDuration === "") {
    container.style.removeProperty("transition-duration");
  } else {
    container.style.transitionDuration = transitionDuration;
  }
}

function dispatchCarouselIndexChange(root: HTMLElement, index: number) {
  root.dispatchEvent(new CustomEvent("indexchange", {
    bubbles: true,
    detail: { index },
  }));
}

function clampCarouselIndex(index: number, slideCount: number) {
  if (slideCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(0, index), slideCount - 1);
}

export function createCarouselWebComponent(part: WebComponentPartSpec): typeof CarouselWebElement {
  return class extends CarouselWebElement {
    static override packageSlug = "carousel";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
