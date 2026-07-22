import { afterEach, describe, expect, it, vi } from "vitest";
import { createSliderElement, defineSliderElements } from "../src";

type SliderRoot = HTMLElement & {
  defaultValue: string;
  disabled: boolean;
  value: string;
};

function setupSlider(options: {
  defaultValue?: string;
  disabled?: boolean;
  max?: number;
  min?: number;
  minStepsBetweenThumbs?: number;
  orientation?: "horizontal" | "vertical";
  step?: number;
  thumbCount?: number;
  value?: string;
} = {}) {
  defineSliderElements();
  const root = document.createElement("aria-slider") as SliderRoot;
  root.setAttribute("aria-label", "Level");
  root.setAttribute("min", String(options.min ?? 0));
  root.setAttribute("max", String(options.max ?? 100));
  root.setAttribute("step", String(options.step ?? 1));
  if (options.defaultValue !== undefined) root.setAttribute("default-value", options.defaultValue);
  if (options.value !== undefined) root.setAttribute("value", options.value);
  if (options.disabled) root.setAttribute("disabled", "");
  if (options.orientation) root.setAttribute("orientation", options.orientation);
  if (options.minStepsBetweenThumbs !== undefined) {
    root.setAttribute("min-steps-between-thumbs", String(options.minStepsBetweenThumbs));
  }

  const track = document.createElement("aria-slider-track");
  const range = document.createElement("aria-slider-range");
  track.append(range);
  const thumbs = Array.from({ length: options.thumbCount ?? 1 }, (_, index) => {
    const thumb = document.createElement("aria-slider-thumb");
    thumb.setAttribute("index", String(index));
    thumb.setAttribute("aria-label", index === 0 ? "Lower bound" : "Upper bound");
    track.append(thumb);
    return thumb;
  });
  root.append(track);
  document.body.append(root);
  return { range, root, thumbs, track };
}

function keyDown(element: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

function mockRect(element: HTMLElement, rect: Partial<DOMRect>) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    bottom: 100,
    height: 100,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect);
}

describe("@ariaui-web/slider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("defines source-equivalent Root, Track, Range, and Thumb elements", () => {
    defineSliderElements();
    defineSliderElements();
    expect(createSliderElement("Root").tagName).toBe("ARIA-SLIDER");
    expect(createSliderElement("Track").tagName).toBe("ARIA-SLIDER-TRACK");
    expect(createSliderElement("Range").tagName).toBe("ARIA-SLIDER-RANGE");
    expect(createSliderElement("Thumb").tagName).toBe("ARIA-SLIDER-THUMB");
  });

  it("initializes a single thumb and range from default-value", () => {
    const { range, root, thumbs } = setupSlider({ defaultValue: "50" });
    expect(root.value).toBe("50");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(thumbs[0]?.getAttribute("role")).toBe("slider");
    expect(thumbs[0]?.getAttribute("aria-valuemin")).toBe("0");
    expect(thumbs[0]?.getAttribute("aria-valuemax")).toBe("100");
    expect(thumbs[0]?.getAttribute("aria-valuenow")).toBe("50");
    expect(thumbs[0]?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(thumbs[0]?.style.left).toBe("50%");
    expect(range.style.left).toBe("0%");
    expect(range.style.width).toBe("50%");
  });

  it("uses min when no current or default value is provided", () => {
    const { range, root, thumbs } = setupSlider({ min: 10, max: 110 });
    expect(root.value).toBe("10");
    expect(thumbs[0]?.getAttribute("aria-valuenow")).toBe("10");
    expect(range.style.width).toBe("0%");
  });

  it("updates an uncontrolled slider with arrows, Home, and End", () => {
    const { range, root, thumbs } = setupSlider({ defaultValue: "50", step: 5 });
    const changes: Array<number | number[]> = [];
    root.addEventListener("valuechange", (event) => {
      changes.push((event as CustomEvent<{ value: number | number[] }>).detail.value);
    });
    expect(keyDown(thumbs[0]!, "ArrowRight").defaultPrevented).toBe(true);
    keyDown(thumbs[0]!, "ArrowUp");
    keyDown(thumbs[0]!, "ArrowLeft");
    keyDown(thumbs[0]!, "ArrowDown");
    keyDown(thumbs[0]!, "Home");
    keyDown(thumbs[0]!, "End");
    expect(changes).toEqual([55, 60, 55, 50, 0, 100]);
    expect(root.value).toBe("100");
    expect(range.style.width).toBe("100%");
  });

  it("dispatches controlled changes without mutating the authored value", () => {
    const { root, thumbs } = setupSlider({ value: "40" });
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);
    keyDown(thumbs[0]!, "ArrowRight");
    expect(root.value).toBe("40");
    expect(thumbs[0]?.getAttribute("aria-valuenow")).toBe("40");
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail.value).toBe(41);
    root.value = "41";
    expect(thumbs[0]?.getAttribute("aria-valuenow")).toBe("41");
  });

  it("moves the nearest thumb on track click and snaps to step", () => {
    const { root, thumbs, track } = setupSlider({ defaultValue: "20,80", step: 5, thumbCount: 2 });
    mockRect(track, { width: 100 });
    track.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 32 }));
    expect(root.value).toBe("30,80");
    track.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 73 }));
    expect(root.value).toBe("30,75");
    expect(thumbs.map((thumb) => thumb.getAttribute("aria-valuenow"))).toEqual(["30", "75"]);
  });

  it("updates a thumb while dragging and clears active state on release", () => {
    const { root, thumbs, track } = setupSlider({ defaultValue: "50" });
    mockRect(track, { width: 100 });
    thumbs[0]!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, clientX: 50 }));
    expect(thumbs[0]?.hasAttribute("data-active")).toBe(true);
    document.dispatchEvent(new MouseEvent("mousemove", { clientX: 80 }));
    expect(root.value).toBe("80");
    document.dispatchEvent(new MouseEvent("mouseup"));
    expect(thumbs[0]?.hasAttribute("data-active")).toBe(false);
  });

  it("keeps multi-thumb values ordered and enforces minimum spacing", () => {
    const { range, root, thumbs } = setupSlider({
      defaultValue: "20,30",
      minStepsBetweenThumbs: 5,
      thumbCount: 2,
    });
    keyDown(thumbs[0]!, "End");
    expect(root.value).toBe("25,30");
    keyDown(thumbs[1]!, "Home");
    expect(root.value).toBe("25,30");
    expect(range.style.left).toBe("25%");
    expect(range.style.width).toBe("5%");
  });

  it("lays out vertical values from bottom to top", () => {
    const { range, root, thumbs, track } = setupSlider({
      defaultValue: "25,75",
      orientation: "vertical",
      thumbCount: 2,
    });
    expect(thumbs[0]?.style.top).toBe("75%");
    expect(thumbs[1]?.style.top).toBe("25%");
    expect(range.style.bottom).toBe("25%");
    expect(range.style.height).toBe("50%");
    mockRect(track, { height: 100 });
    track.dispatchEvent(new MouseEvent("click", { bubbles: true, clientY: 10 }));
    expect(root.value).toBe("25,90");
  });

  it("recomputes complete inline geometry when orientation changes", () => {
    const { range, root, thumbs } = setupSlider({ defaultValue: "50" });
    expect(thumbs[0]?.style.transform).toBe("translateX(-50%)");
    expect(range.style.height).toBe("100%");
    root.setAttribute("orientation", "vertical");
    expect(thumbs[0]?.style.left).toBe("");
    expect(thumbs[0]?.style.top).toBe("50%");
    expect(thumbs[0]?.style.transform).toBe("translateY(-50%)");
    expect(range.style.width).toBe("100%");
    expect(range.style.height).toBe("50%");
  });

  it("reflects disabled state and ignores pointer and keyboard interaction", () => {
    const { range, root, thumbs, track } = setupSlider({ defaultValue: "35", disabled: true });
    mockRect(track, { width: 100 });
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);
    keyDown(thumbs[0]!, "ArrowRight");
    track.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 80 }));
    expect(root.value).toBe("35");
    expect(listener).not.toHaveBeenCalled();
    expect(root.hasAttribute("data-disabled")).toBe(true);
    expect(range.hasAttribute("data-disabled")).toBe(true);
    expect(thumbs[0]?.getAttribute("aria-disabled")).toBe("true");
    expect(thumbs[0]?.getAttribute("tabindex")).toBe("-1");
  });

  it("preserves static value text and creates hidden form values", () => {
    const { root, thumbs } = setupSlider({ defaultValue: "20,80", thumbCount: 2 });
    root.setAttribute("name", "price");
    thumbs[0]!.setAttribute("aria-valuetext", "Twenty dollars");
    root.value = "25,75";
    expect(thumbs[0]?.getAttribute("aria-valuetext")).toBe("Twenty dollars");
    const inputs = Array.from(root.querySelectorAll<HTMLInputElement>("input[data-ariaui-web-hidden-input='true']"));
    expect(inputs.map((input) => [input.name, input.value])).toEqual([
      ["price", "25"],
      ["price", "75"],
    ]);
  });

  it("formats dynamic value text with root prefix and suffix attributes", () => {
    const { root, thumbs } = setupSlider({ defaultValue: "40", step: 5 });
    root.setAttribute("value-text-prefix", "Completion: ");
    root.setAttribute("value-text-suffix", "%");
    expect(thumbs[0]?.getAttribute("aria-valuetext")).toBe("Completion: 40%");
    keyDown(thumbs[0]!, "ArrowRight");
    expect(thumbs[0]?.getAttribute("aria-valuetext")).toBe("Completion: 45%");
  });
});
