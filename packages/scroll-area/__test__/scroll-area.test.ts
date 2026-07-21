import { afterEach, describe, expect, it, vi } from "vitest";
import {
  anchorSelectedItem,
  createScrollAreaElement,
  defineScrollAreaElements,
  getScrollButtonOffset,
} from "../src";

type ScrollAreaElement = HTMLElement & {
  anchorSelected: boolean;
  behavior: ScrollBehavior;
  maxVisibleItems: number;
  orientation: string;
  type: string;
};

function setup(markup = "") {
  defineScrollAreaElements();
  document.body.innerHTML = `<aria-scroll-area>${markup}</aria-scroll-area>`;
  return document.querySelector<ScrollAreaElement>("aria-scroll-area")!;
}

function rect(height: number, top = 0): DOMRect {
  return {
    width: 100,
    height,
    top,
    right: 100,
    bottom: top + height,
    left: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("@ariaui-web/scroll-area", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it("defines the source-equivalent public parts and helpers", () => {
    defineScrollAreaElements();
    defineScrollAreaElements();
    expect(createScrollAreaElement("Root").tagName).toBe("ARIA-SCROLL-AREA");
    expect(createScrollAreaElement("Viewport").tagName).toBe("ARIA-SCROLL-AREA-VIEWPORT");
    expect(createScrollAreaElement("ScrollUpButton").getAttribute("role")).toBeNull();
    expect(anchorSelectedItem).toBeTypeOf("function");
    expect(getScrollButtonOffset).toBeTypeOf("function");
  });

  it("uses the Viewport as the native scrolling surface", () => {
    const root = setup(`<aria-scroll-area-viewport aria-label="Releases"><div>Content</div></aria-scroll-area-viewport>`);
    const viewport = root.querySelector<ScrollAreaElement>("aria-scroll-area-viewport")!;
    expect(viewport.dataset.ariauiScrollAreaViewport).toBe("true");
    expect(viewport.tabIndex).toBe(-1);
    expect(viewport.style.width).toBe("100%");
    expect(viewport.style.height).toBe("100%");
    expect(viewport.style.overflowX).toBe("auto");
    expect(viewport.style.overflowY).toBe("auto");
    expect(viewport.getAttribute("aria-label")).toBe("Releases");
    expect(viewport.textContent).toBe("Content");
  });

  it("preserves consumer native scrollbar styles", () => {
    const root = setup(`<aria-scroll-area-viewport style="overflow-x: hidden; overflow-y: scroll; scrollbar-width: thin"></aria-scroll-area-viewport>`);
    const viewport = root.querySelector<HTMLElement>("aria-scroll-area-viewport")!;
    expect(viewport.style.overflowX).toBe("hidden");
    expect(viewport.style.overflowY).toBe("scroll");
    expect(viewport.style.scrollbarWidth).toBe("thin");
  });

  it("slots viewport behavior onto a native-composition child", () => {
    const root = setup(`
      <aria-scroll-area-viewport native-composition class="viewport-prop" style="scrollbar-width: thin" aria-label="Options">
        <div class="viewport-child"><span>Content</span></div>
      </aria-scroll-area-viewport>
    `);
    const source = root.querySelector<HTMLElement>("aria-scroll-area-viewport")!;
    const host = source.firstElementChild as HTMLElement;
    expect(host.dataset.ariauiScrollAreaViewport).toBe("true");
    expect(host.classList.contains("viewport-prop")).toBe(true);
    expect(host.classList.contains("viewport-child")).toBe(true);
    expect(host.style.width).toBe("100%");
    expect(host.style.overflowY).toBe("auto");
    expect(host.style.scrollbarWidth).toBe("thin");
    expect(host.getAttribute("aria-label")).toBe("Options");
    expect(source.style.display).toBe("contents");
  });

  it("scrolls by two measured rows with configured behavior", async () => {
    const root = setup(`
      <aria-scroll-area-scroll-up-button>Up</aria-scroll-area-scroll-up-button>
      <aria-scroll-area-viewport><div>Apple</div><div>Banana</div></aria-scroll-area-viewport>
      <aria-scroll-area-scroll-down-button behavior="auto">Down</aria-scroll-area-scroll-down-button>
    `);
    const viewport = root.querySelector<HTMLElement>("aria-scroll-area-viewport")!;
    viewport.firstElementChild!.getBoundingClientRect = () => rect(32);
    const scrollBy = vi.fn();
    viewport.scrollBy = scrollBy;
    const up = root.querySelector<HTMLElement>("aria-scroll-area-scroll-up-button")!;
    const down = root.querySelector<HTMLElement>("aria-scroll-area-scroll-down-button")!;
    up.click();
    down.click();
    await flush();
    expect(up.dataset.direction).toBe("up");
    expect(down.dataset.direction).toBe("down");
    expect(scrollBy).toHaveBeenNthCalledWith(1, { top: -64, behavior: "smooth" });
    expect(scrollBy).toHaveBeenNthCalledWith(2, { top: 64, behavior: "auto" });
  });

  it("does not scroll when a button click is prevented", async () => {
    const root = setup(`
      <aria-scroll-area-scroll-up-button>Up</aria-scroll-area-scroll-up-button>
      <aria-scroll-area-viewport><div>Apple</div></aria-scroll-area-viewport>
    `);
    const viewport = root.querySelector<HTMLElement>("aria-scroll-area-viewport")!;
    viewport.scrollBy = vi.fn();
    const button = root.querySelector<HTMLElement>("aria-scroll-area-scroll-up-button")!;
    button.addEventListener("click", (event) => event.preventDefault());
    button.click();
    await flush();
    expect(viewport.scrollBy).not.toHaveBeenCalled();

    button.replaceWith(button.cloneNode(true));
    const disabledButton = root.querySelector<HTMLElement>("aria-scroll-area-scroll-up-button")!;
    disabledButton.setAttribute("disabled", "");
    disabledButton.click();
    await flush();
    expect(viewport.scrollBy).not.toHaveBeenCalled();
  });

  it("uses a 32 pixel fallback when no row can be measured", () => {
    expect(getScrollButtonOffset(null)).toBe(32);
    const viewport = document.createElement("div");
    const row = document.createElement("div");
    row.getBoundingClientRect = () => rect(0);
    viewport.append(row);
    expect(getScrollButtonOffset(viewport)).toBe(32);
  });

  it("limits viewport height from max-visible-items", async () => {
    const root = setup(`<aria-scroll-area-viewport max-visible-items="3"><div>Apple</div><div>Banana</div></aria-scroll-area-viewport>`);
    const viewport = root.querySelector<ScrollAreaElement>("aria-scroll-area-viewport")!;
    viewport.firstElementChild!.getBoundingClientRect = () => rect(32);
    viewport.maxVisibleItems = 3;
    await flush();
    expect(viewport.style.maxHeight).toBe("96px");
    viewport.maxVisibleItems = 0;
    expect(viewport.style.maxHeight).toBe("");
  });

  it("recomputes max-visible-items when the first row resizes", async () => {
    let resizeCallback: ResizeObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    class TestResizeObserver {
      constructor(callback: ResizeObserverCallback) { resizeCallback = callback; }
      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
    }
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
    const root = setup(`<aria-scroll-area-viewport><div>Apple</div></aria-scroll-area-viewport>`);
    const viewport = root.querySelector<ScrollAreaElement>("aria-scroll-area-viewport")!;
    let height = 20;
    viewport.firstElementChild!.getBoundingClientRect = () => rect(height);
    viewport.maxVisibleItems = 2;
    await flush();
    expect(observe).toHaveBeenCalledWith(viewport.firstElementChild);
    expect(viewport.style.maxHeight).toBe("40px");
    height = 30;
    resizeCallback?.([], {} as ResizeObserver);
    expect(viewport.style.maxHeight).toBe("60px");
    viewport.remove();
    expect(disconnect).toHaveBeenCalled();
  });

  it("anchors selected descendants near the viewport center", () => {
    const viewport = document.createElement("div");
    const selected = document.createElement("div");
    selected.setAttribute("aria-selected", "true");
    viewport.append(selected);
    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 96 },
      scrollHeight: { configurable: true, value: 320 },
    });
    viewport.getBoundingClientRect = () => rect(96);
    selected.getBoundingClientRect = () => rect(32, 160);
    expect(anchorSelectedItem(viewport)).toBe(true);
    expect(viewport.scrollTop).toBe(128);
    expect(anchorSelectedItem(null)).toBe(false);
    expect(anchorSelectedItem(document.createElement("div"))).toBe(false);
  });

  it("anchors when anchor-selected is enabled and selection changes", async () => {
    const root = setup(`<aria-scroll-area-viewport anchor-selected><div>Apple</div><div aria-selected="true">Banana</div></aria-scroll-area-viewport>`);
    const viewport = root.querySelector<HTMLElement>("aria-scroll-area-viewport")!;
    const [first, selected] = Array.from(viewport.children) as HTMLElement[];
    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 96 },
      scrollHeight: { configurable: true, value: 320 },
    });
    viewport.getBoundingClientRect = () => rect(96);
    selected!.getBoundingClientRect = () => rect(32, 160);
    first!.getBoundingClientRect = () => rect(32, 32 - viewport.scrollTop);
    viewport.setAttribute("anchor-selected", "");
    await flush();
    expect(viewport.scrollTop).toBe(128);
    selected!.setAttribute("aria-selected", "false");
    first!.setAttribute("data-state", "checked");
    await flush();
    expect(viewport.scrollTop).toBe(0);
  });

  it("keeps Scrollbar and Thumb as render-only compatibility parts", () => {
    const root = setup(`
      <aria-scroll-area-scrollbar orientation="horizontal"><aria-scroll-area-thumb></aria-scroll-area-thumb></aria-scroll-area-scrollbar>
      <aria-scroll-area-corner></aria-scroll-area-corner>
    `);
    const scrollbar = root.querySelector<HTMLElement>("aria-scroll-area-scrollbar")!;
    const thumb = root.querySelector<HTMLElement>("aria-scroll-area-thumb")!;
    expect(scrollbar.getAttribute("role")).toBeNull();
    expect(scrollbar.dataset.orientation).toBe("horizontal");
    expect(scrollbar.dataset.state).toBe("visible");
    expect(thumb.getAttribute("role")).toBeNull();
    expect(thumb.dataset.state).toBe("visible");
    expect(thumb.style.transform).toBe("");
    expect(root.querySelector("aria-scroll-area-corner")).not.toBeNull();
  });

  it("suppresses compatibility scrollbars for type never", () => {
    const root = setup(`<aria-scroll-area-scrollbar><aria-scroll-area-thumb></aria-scroll-area-thumb></aria-scroll-area-scrollbar>`);
    const scrollbar = root.querySelector<HTMLElement>("aria-scroll-area-scrollbar")!;
    root.type = "never";
    expect(scrollbar.hidden).toBe(true);
    root.type = "hover";
    expect(scrollbar.hidden).toBe(false);
  });
});
