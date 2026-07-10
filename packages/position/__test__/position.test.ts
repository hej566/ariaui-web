import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  autoUpdate,
  computeCoordsFromPlacement,
  computePosition,
  computePrePositionStyle,
  createHideEffect,
  createUpdateEffect,
  detectOverflow,
  fitsWithinRect,
  getClippingRect,
  getDPR,
  getDocument,
  getOverflowAncestors,
  getRect,
  getWindow,
  isElement,
  isNode,
  isShadowRoot,
  roundByDPR,
} from "../src";

function rect(x: number, y: number, width: number, height: number) {
  return new DOMRect(x, y, width, height);
}

describe("@ariaui-web/position", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "getBoundingClientRect").mockReturnValue(rect(0, 0, 1000, 1000));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it("exposes DOM helpers matching the source utility surface", () => {
    const host = document.createElement("div");
    const child = document.createElement("button");
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    shadowRoot.appendChild(child);

    expect(getWindow()).toBe(window);
    expect(getWindow(document)).toBe(window);
    expect(getDPR(null)).toBe(window.devicePixelRatio || 1);
    vi.spyOn(window, "devicePixelRatio", "get").mockReturnValue(2);
    expect(roundByDPR(child, 10.25)).toBe(10.5);
    expect(isNode(child)).toBe(true);
    expect(isNode(null)).toBe(false);
    expect(isElement(child)).toBe(true);
    expect(isElement(document)).toBe(false);
    expect(isShadowRoot(shadowRoot)).toBe(true);
    expect(getDocument(child)).toBe(document);
    expect(getRect(null)).toEqual(rect(0, 0, 0, 0));
    expect(getClippingRect(child, "viewport")).toEqual(rect(0, 0, 1000, 1000));
    expect(fitsWithinRect(10, 20, rect(0, 0, 50, 50), rect(0, 0, 100, 100))).toBe(true);
    expect(fitsWithinRect(80, 20, rect(0, 0, 50, 50), rect(0, 0, 100, 100))).toBe(false);
    expect(computeCoordsFromPlacement(rect(100, 100, 50, 20), rect(0, 0, 30, 10), "bottom-end", { offset: { mainAxis: 5, crossAxis: 2 } })).toEqual({ x: 122, y: 125 });
  });

  it("finds overflow ancestors through shadow roots and detached elements", () => {
    const scrollParent = document.createElement("div");
    const host = document.createElement("div");
    const child = document.createElement("button");
    scrollParent.style.overflow = "auto";
    document.body.appendChild(scrollParent);
    scrollParent.appendChild(host);
    host.attachShadow({ mode: "open" }).appendChild(child);

    expect(getOverflowAncestors(child)).toContain(scrollParent);
    expect(getOverflowAncestors(document.createElement("div"))).toEqual([]);
  });

  it("computes aligned placements, strategy metadata, offsets, and rects", () => {
    const reference = { getBoundingClientRect: () => rect(100, 100, 50, 20) };
    const floating = { getBoundingClientRect: () => rect(0, 0, 30, 10) };

    const result = computePosition(reference, floating as HTMLElement, {
      placement: "bottom-end",
      offset: { mainAxis: 5, crossAxis: 2 },
    });

    expect(result).toMatchObject({
      x: 122,
      y: 125,
      placement: "bottom-end",
      strategy: "absolute",
    });
    expect(result.rects.reference).toEqual(rect(100, 100, 50, 20));
    expect(result.rects.floating).toEqual(rect(0, 0, 30, 10));
  });

  it("flips overflowing panels and preserves direct offset gaps after flipping", () => {
    const reference = { getBoundingClientRect: () => rect(100, 900, 100, 40) };
    const floating = { getBoundingClientRect: () => rect(0, 0, 320, 160) };

    const result = computePosition(reference, floating as HTMLElement, {
      placement: "bottom-start",
      boundary: rect(0, 0, 1000, 1000),
    });

    expect(result.placement).toBe("top-start");
    expect(result.x).toBe(100);
    expect(result.y).toBe(740);

    const flippedOffset = computePosition(
      { getBoundingClientRect: () => rect(100, 0, 50, 20) },
      { getBoundingClientRect: () => rect(0, 0, 30, 40) } as HTMLElement,
      {
        placement: "top",
        offset: { y: -10 },
      },
    );

    expect(flippedOffset.placement).toBe("bottom");
    expect(flippedOffset.y).toBe(30);
  });

  it("handles absolute offset parents and fixed strategy", () => {
    const parent = document.createElement("div");
    const floating = document.createElement("div");
    document.body.append(parent, floating);
    vi.spyOn(parent, "getBoundingClientRect").mockReturnValue(rect(50, 50, 500, 500));
    vi.spyOn(floating, "getBoundingClientRect").mockReturnValue(rect(0, 0, 30, 40));
    vi.spyOn(window, "getComputedStyle").mockImplementation((element) => {
      if (element === parent) {
        return { borderLeftWidth: "5px", borderTopWidth: "5px" } as CSSStyleDeclaration;
      }
      return CSSStyleDeclaration.prototype;
    });
    Object.defineProperty(floating, "offsetParent", { configurable: true, get: () => parent });

    expect(computePosition({ getBoundingClientRect: () => rect(200, 200, 50, 20) }, floating, { placement: "bottom" })).toMatchObject({ x: 155, y: 165 });
    expect(computePosition({ getBoundingClientRect: () => rect(200, 200, 50, 20) }, floating, { placement: "bottom", strategy: "fixed" })).toMatchObject({ x: 210, y: 220 });
  });

  it("detects overflow relative to explicit boundaries with padding", () => {
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rect(10, 20, 100, 100));

    expect(detectOverflow(element, { boundary: rect(50, 50, 200, 200), padding: 10 })).toEqual({
      top: 40,
      bottom: -120,
      left: 50,
      right: -130,
    });
  });

  it("auto-updates on layout observers and cleans up listeners", () => {
    const reference = document.createElement("button");
    const floating = document.createElement("div");
    document.body.append(reference, floating);
    const update = vi.fn();
    const hide = vi.fn();
    const resizeObserve = vi.fn();
    const resizeDisconnect = vi.fn();
    const mutationObserve = vi.fn();
    const mutationDisconnect = vi.fn();
    const intersectionObserve = vi.fn();
    const intersectionDisconnect = vi.fn();

    const originalResizeObserver = window.ResizeObserver;
    const originalMutationObserver = window.MutationObserver;
    const originalIntersectionObserver = window.IntersectionObserver;

    window.ResizeObserver = vi.fn(() => ({ observe: resizeObserve, disconnect: resizeDisconnect })) as unknown as typeof ResizeObserver;
    window.MutationObserver = vi.fn(() => ({ observe: mutationObserve, disconnect: mutationDisconnect, takeRecords: () => [] })) as unknown as typeof MutationObserver;
    window.IntersectionObserver = vi.fn(() => ({ observe: intersectionObserve, disconnect: intersectionDisconnect, unobserve: vi.fn(), root: null, rootMargin: "", thresholds: [] })) as unknown as typeof IntersectionObserver;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    try {
      const cleanup = autoUpdate(reference, floating, update, hide);

      expect(resizeObserve).toHaveBeenCalledWith(reference);
      expect(resizeObserve).toHaveBeenCalledWith(floating);
      expect(intersectionObserve).toHaveBeenCalledWith(reference);
      expect(mutationObserve).toHaveBeenCalled();

      window.dispatchEvent(new Event("resize"));
      expect(update).toHaveBeenCalledTimes(1);
      expect(hide).not.toHaveBeenCalled();

      cleanup?.();
      expect(resizeDisconnect).toHaveBeenCalled();
      expect(mutationDisconnect).toHaveBeenCalled();
      expect(intersectionDisconnect).toHaveBeenCalled();
    } finally {
      window.ResizeObserver = originalResizeObserver;
      window.MutationObserver = originalMutationObserver;
      window.IntersectionObserver = originalIntersectionObserver;
    }
  });

  it("writes floating update effects while preserving display-none measurement state", () => {
    const reference = document.createElement("button");
    const floating = document.createElement("div");
    document.body.append(reference, floating);
    vi.spyOn(reference, "getBoundingClientRect").mockReturnValue(rect(100, 100, 80, 20));
    vi.spyOn(floating, "getBoundingClientRect").mockReturnValue(rect(0, 0, 40, 20));
    floating.style.display = "none";
    floating.style.visibility = "visible";

    createUpdateEffect({
      reference,
      floating,
      placement: "bottom-start",
      offset: { y: 4 },
    })();

    expect(floating.style.left).toBe("100px");
    expect(floating.style.top).toBe("124px");
    expect(floating.style.position).toBe("absolute");
    expect(floating.dataset.side).toBe("bottom");
    expect(floating.style.display).toBe("none");
    expect(floating.style.visibility).toBe("visible");

    createHideEffect({ floating })();
    expect(floating.style.display).toBe("none");
    expect(() => createUpdateEffect({ reference: null, floating, placement: "bottom" })()).not.toThrow();
    expect(() => createHideEffect({ floating: null })()).not.toThrow();
  });

  it("computes pre-position styles without framework hooks", () => {
    expect(computePrePositionStyle(false, "always")).toEqual({
      position: "absolute",
      top: 0,
      left: 0,
      visibility: "hidden",
    });
    expect(computePrePositionStyle(true, "never")).toEqual({
      position: "absolute",
      visibility: "visible",
    });
  });
});
