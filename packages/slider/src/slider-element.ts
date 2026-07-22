import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

type SliderState = {
  controlled: boolean;
  defaultValueApplied: boolean;
  observer: MutationObserver | null;
  syncing: boolean;
};

const sliderStates = new WeakMap<HTMLElement, SliderState>();
const dragCleanups = new WeakMap<HTMLElement, () => void>();

function partName(element: HTMLElement) {
  return (element.constructor as typeof SliderWebElement).partName;
}

function sliderRoot(element: HTMLElement) {
  return element.matches("aria-slider")
    ? element
    : element.closest<HTMLElement>("aria-slider");
}

function sliderState(root: HTMLElement) {
  let state = sliderStates.get(root);
  if (!state) {
    state = {
      controlled: root.hasAttribute("value"),
      defaultValueApplied: false,
      observer: null,
      syncing: false,
    };
    sliderStates.set(root, state);
  }
  return state;
}

function numberAttribute(element: Element, name: string, fallback: number) {
  const attribute = element.getAttribute(name);
  if (attribute == null || attribute.trim() === "") return fallback;
  const value = Number(attribute);
  return Number.isFinite(value) ? value : fallback;
}

function sliderConfig(root: HTMLElement) {
  const min = numberAttribute(root, "min", 0);
  const authoredMax = numberAttribute(root, "max", 100);
  const max = authoredMax > min ? authoredMax : min + 100;
  const authoredStep = numberAttribute(root, "step", 1);
  return {
    disabled: root.hasAttribute("disabled"),
    max,
    min,
    minStepsBetweenThumbs: Math.max(
      -1,
      numberAttribute(root, "min-steps-between-thumbs", 0),
    ),
    orientation:
      root.getAttribute("orientation") === "vertical"
        ? ("vertical" as const)
        : ("horizontal" as const),
    step: authoredStep > 0 ? authoredStep : 1,
  };
}

function decimalPlaces(value: number) {
  const source = String(value).toLowerCase();
  if (source.includes("e-")) return Number(source.split("e-")[1]) || 0;
  return source.includes(".") ? source.split(".")[1]!.length : 0;
}

function normalizeValue(value: number, min: number, max: number, step: number) {
  const stepped = Math.round((value - min) / step) * step + min;
  const precision = Math.max(decimalPlaces(min), decimalPlaces(step));
  return Number(Math.min(max, Math.max(min, stepped)).toFixed(precision));
}

function parseValues(root: HTMLElement, min: number, max: number, step: number) {
  const values = (root.getAttribute("value") ?? "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(Number.isFinite)
    .map((value) => normalizeValue(value, min, max, step))
    .sort((a, b) => a - b);
  return values.length > 0 ? values : [min];
}

function directSliderParts<T extends HTMLElement>(
  root: HTMLElement,
  selector: string,
) {
  return Array.from(root.querySelectorAll<T>(selector)).filter(
    (element) => sliderRoot(element) === root,
  );
}

function sliderThumbs(root: HTMLElement) {
  return directSliderParts<HTMLElement>(root, "aria-slider-thumb").sort(
    (a, b) =>
      numberAttribute(a, "index", 0) - numberAttribute(b, "index", 0),
  );
}

function setBooleanAttribute(element: Element, name: string, value: boolean) {
  if (element.hasAttribute(name) !== value) element.toggleAttribute(name, value);
}

function setAttribute(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function percent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

function syncHiddenInputs(
  root: HTMLElement,
  values: number[],
  disabled: boolean,
) {
  const name = root.getAttribute("name");
  const existing = Array.from(
    root.querySelectorAll<HTMLInputElement>(
      ":scope > input[data-ariaui-web-hidden-input='true']",
    ),
  );
  if (!name) {
    existing.forEach((input) => input.remove());
    return;
  }

  values.forEach((value, index) => {
    const input = existing[index] ?? root.ownerDocument.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    input.disabled = disabled;
    input.dataset.ariauiWebHiddenInput = "true";
    if (!input.isConnected) root.append(input);
  });
  existing.slice(values.length).forEach((input) => input.remove());
}

function syncSliderRoot(root: HTMLElement) {
  const state = sliderState(root);
  if (state.syncing) return;
  state.syncing = true;
  try {
    const config = sliderConfig(root);
    if (!state.defaultValueApplied) {
      if (!root.hasAttribute("value")) {
        const defaultValue =
          root.getAttribute("default-value") ??
          root.getAttribute("defaultvalue") ??
          String(config.min);
        root.setAttribute("value", defaultValue);
      }
      state.defaultValueApplied = true;
    }

    const values = parseValues(
      root,
      config.min,
      config.max,
      config.step,
    );
    const serialized = values.join(",");
    if (root.getAttribute("value") !== serialized) {
      root.setAttribute("value", serialized);
    }

    setAttribute(root, "data-orientation", config.orientation);
    setBooleanAttribute(root, "data-disabled", config.disabled);
    root.style.position ||= "relative";
    root.style.display ||= "flex";
    root.style.flexDirection =
      config.orientation === "vertical" ? "column" : "row";
    root.style.userSelect ||= "none";
    root.style.touchAction ||= "none";

    const thumbs = sliderThumbs(root);
    thumbs.forEach((thumb, order) => {
      const index = Math.max(0, Math.floor(numberAttribute(thumb, "index", order)));
      const value = values[index] ?? config.min;
      const valuePercent = percent(value, config.min, config.max);
      setAttribute(thumb, "role", "slider");
      setAttribute(thumb, "tabindex", config.disabled ? "-1" : "0");
      setAttribute(thumb, "aria-valuemin", String(config.min));
      setAttribute(thumb, "aria-valuemax", String(config.max));
      setAttribute(thumb, "aria-valuenow", String(value));
      setAttribute(thumb, "aria-orientation", config.orientation);
      if (
        root.hasAttribute("value-text-prefix") ||
        root.hasAttribute("value-text-suffix")
      ) {
        setAttribute(
          thumb,
          "aria-valuetext",
          `${root.getAttribute("value-text-prefix") ?? ""}${value}${root.getAttribute("value-text-suffix") ?? ""}`,
        );
      }
      if (config.disabled) setAttribute(thumb, "aria-disabled", "true");
      else thumb.removeAttribute("aria-disabled");
      setBooleanAttribute(thumb, "data-disabled", config.disabled);
      setAttribute(thumb, "data-orientation", config.orientation);
      thumb.style.position = "absolute";
      if (config.orientation === "vertical") {
        thumb.style.removeProperty("left");
        thumb.style.top = `${100 - valuePercent}%`;
        thumb.style.transform = "translateY(-50%)";
      } else {
        thumb.style.removeProperty("top");
        thumb.style.left = `${valuePercent}%`;
        thumb.style.transform = "translateX(-50%)";
      }
    });

    for (const track of directSliderParts<HTMLElement>(
      root,
      "aria-slider-track",
    )) {
      track.style.position ||= "relative";
      setBooleanAttribute(track, "data-disabled", config.disabled);
      setAttribute(track, "data-orientation", config.orientation);
    }

    const startValue = values.length > 1 ? values[0]! : config.min;
    const endValue = values.at(-1) ?? config.min;
    const startPercent = percent(startValue, config.min, config.max);
    const sizePercent = percent(endValue, config.min, config.max) - startPercent;
    for (const range of directSliderParts<HTMLElement>(
      root,
      "aria-slider-range",
    )) {
      range.style.position = "absolute";
      setBooleanAttribute(range, "data-disabled", config.disabled);
      setAttribute(range, "data-orientation", config.orientation);
      if (config.orientation === "vertical") {
        range.style.removeProperty("left");
        range.style.width = "100%";
        range.style.bottom = `${startPercent}%`;
        range.style.height = `${sizePercent}%`;
      } else {
        range.style.removeProperty("bottom");
        range.style.height = "100%";
        range.style.left = `${startPercent}%`;
        range.style.width = `${sizePercent}%`;
      }
    }
    syncHiddenInputs(root, values, config.disabled);
  } finally {
    state.syncing = false;
  }
}

function updateSliderValue(root: HTMLElement, index: number, nextValue: number) {
  const state = sliderState(root);
  const config = sliderConfig(root);
  if (config.disabled) return;
  const values = parseValues(root, config.min, config.max, config.step);
  while (values.length <= index) values.push(values.at(-1) ?? config.min);
  let value = normalizeValue(nextValue, config.min, config.max, config.step);
  if (config.minStepsBetweenThumbs >= 0) {
    const distance = config.step * config.minStepsBetweenThumbs;
    if (values[index - 1] !== undefined)
      value = Math.max(value, values[index - 1]! + distance);
    if (values[index + 1] !== undefined)
      value = Math.min(value, values[index + 1]! - distance);
  }
  value = normalizeValue(value, config.min, config.max, config.step);
  const nextValues = [...values];
  nextValues[index] = value;
  nextValues.sort((a, b) => a - b);
  const detailValue: number | number[] =
    nextValues.length === 1 ? nextValues[0]! : nextValues;

  root.dispatchEvent(
    new CustomEvent("valuechange", {
      bubbles: true,
      detail: { value: detailValue, values: nextValues },
    }),
  );
  if (!state.controlled) {
    root.setAttribute("value", nextValues.join(","));
    syncSliderRoot(root);
  }
}

function valueFromPointer(
  root: HTMLElement,
  track: HTMLElement,
  clientX: number,
  clientY: number,
) {
  const config = sliderConfig(root);
  const rect = track.getBoundingClientRect();
  const style = getComputedStyle(track);
  const vertical = config.orientation === "vertical";
  const startInset =
    Number.parseFloat(
      vertical ? style.paddingTop : style.paddingLeft,
    ) +
    Number.parseFloat(
      vertical ? style.borderTopWidth : style.borderLeftWidth,
    );
  const endInset =
    Number.parseFloat(
      vertical ? style.paddingBottom : style.paddingRight,
    ) +
    Number.parseFloat(
      vertical ? style.borderBottomWidth : style.borderRightWidth,
    );
  const safeStartInset = Number.isFinite(startInset) ? startInset : 0;
  const safeEndInset = Number.isFinite(endInset) ? endInset : 0;
  const size =
    (vertical ? rect.height : rect.width) - safeStartInset - safeEndInset;
  if (size <= 0) return null;
  const coordinate = vertical ? clientY - rect.top : clientX - rect.left;
  const ratio = Math.max(
    0,
    Math.min(1, (coordinate - safeStartInset) / size),
  );
  return vertical
    ? config.max - ratio * (config.max - config.min)
    : config.min + ratio * (config.max - config.min);
}

function handleTrackClick(track: HTMLElement, event: Event) {
  if (!(event instanceof MouseEvent) || event.defaultPrevented) return;
  const root = sliderRoot(track);
  if (!root || sliderConfig(root).disabled) return;
  const nextValue = valueFromPointer(
    root,
    track,
    event.clientX,
    event.clientY,
  );
  if (nextValue == null) return;
  const config = sliderConfig(root);
  const values = parseValues(root, config.min, config.max, config.step);
  const index = values.reduce(
    (closest, value, candidate) =>
      Math.abs(value - nextValue) <
      Math.abs(values[closest]! - nextValue)
        ? candidate
        : closest,
    0,
  );
  updateSliderValue(root, index, nextValue);
}

function handleThumbKeyDown(thumb: HTMLElement, event: KeyboardEvent) {
  const root = sliderRoot(thumb);
  if (!root || sliderConfig(root).disabled) return;
  const config = sliderConfig(root);
  const index = Math.max(0, Math.floor(numberAttribute(thumb, "index", 0)));
  const values = parseValues(root, config.min, config.max, config.step);
  const current = values[index] ?? config.min;
  let nextValue: number | null = null;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowUp":
      nextValue = current + config.step;
      break;
    case "ArrowLeft":
    case "ArrowDown":
      nextValue = current - config.step;
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
  event.stopPropagation();
  updateSliderValue(root, index, nextValue);
}

function stopThumbDrag(thumb: HTMLElement) {
  dragCleanups.get(thumb)?.();
}

function startThumbDrag(thumb: HTMLElement, event: MouseEvent) {
  const root = sliderRoot(thumb);
  const track = thumb.closest<HTMLElement>("aria-slider-track");
  if (!root || !track || sliderConfig(root).disabled) return;
  event.preventDefault();
  event.stopPropagation();
  stopThumbDrag(thumb);
  const index = Math.max(0, Math.floor(numberAttribute(thumb, "index", 0)));
  const ownerDocument = thumb.ownerDocument;
  thumb.setAttribute("data-active", "");
  const move = (moveEvent: MouseEvent) => {
    const value = valueFromPointer(
      root,
      track,
      moveEvent.clientX,
      moveEvent.clientY,
    );
    if (value != null) updateSliderValue(root, index, value);
  };
  const cleanup = () => {
    ownerDocument.removeEventListener("mousemove", move);
    ownerDocument.removeEventListener("mouseup", cleanup);
    thumb.removeAttribute("data-active");
    dragCleanups.delete(thumb);
  };
  ownerDocument.addEventListener("mousemove", move);
  ownerDocument.addEventListener("mouseup", cleanup);
  dragCleanups.set(thumb, cleanup);
}

function syncSliderAround(element: HTMLElement) {
  const root = sliderRoot(element);
  if (root) syncSliderRoot(root);
}

export class SliderWebElement extends AriaWebElement {
  static override packageSlug = "slider";

  static override get observedAttributes() {
    return Array.from(
      new Set([
        ...super.observedAttributes,
        "index",
        "max",
        "min",
        "min-steps-between-thumbs",
        "step",
        "value-text-prefix",
        "value-text-suffix",
      ]),
    );
  }

  get defaultValue() {
    return (
      this.getAttribute("default-value") ??
      this.getAttribute("defaultvalue") ??
      ""
    );
  }

  set defaultValue(value: string) {
    if (value == null) this.removeAttribute("default-value");
    else this.setAttribute("default-value", String(value));
  }

  override connectedCallback() {
    super.connectedCallback();
    if (partName(this) === "Root") {
      const state = sliderState(this);
      if (!state.observer && typeof MutationObserver !== "undefined") {
        state.observer = new MutationObserver(() => syncSliderRoot(this));
        state.observer.observe(this, { childList: true, subtree: true });
      }
    }
    if (partName(this) === "Thumb") {
      this.addEventListener("mousedown", this.#handleMouseDown);
      this.addEventListener("focus", this.#handleFocus);
      this.addEventListener("blur", this.#handleBlur);
    }
    syncSliderAround(this);
  }

  disconnectedCallback() {
    if (partName(this) === "Root") {
      sliderStates.get(this)?.observer?.disconnect();
      const state = sliderStates.get(this);
      if (state) state.observer = null;
    }
    if (partName(this) === "Thumb") {
      stopThumbDrag(this);
      this.removeEventListener("mousedown", this.#handleMouseDown);
      this.removeEventListener("focus", this.#handleFocus);
      this.removeEventListener("blur", this.#handleBlur);
    }
  }

  override afterAriaWebContractApplied() {
    if (this.isConnected) syncSliderAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    if (partName(this) === "Track") handleTrackClick(this, event);
  };

  override handleAriaWebKeyDown = (event: KeyboardEvent) => {
    if (partName(this) === "Thumb") handleThumbKeyDown(this, event);
  };

  #handleMouseDown = (event: MouseEvent) => {
    startThumbDrag(this, event);
  };

  #handleFocus = () => {
    if (!sliderRoot(this)?.hasAttribute("disabled"))
      this.setAttribute("data-active", "");
  };

  #handleBlur = () => {
    if (!dragCleanups.has(this)) this.removeAttribute("data-active");
  };
}

export function createSliderWebComponent(part: WebComponentPartSpec): typeof SliderWebElement {
  return class extends SliderWebElement {
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
