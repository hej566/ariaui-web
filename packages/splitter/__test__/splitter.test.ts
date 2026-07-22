import { afterEach, describe, expect, it, vi } from "vitest";
import {
  componentSpec,
  createSplitterElement,
  defineSplitterElements,
  getPartSpec,
} from "../src";

type SplitterRoot = HTMLElement & {
  connectedCallback(): void;
  defaultLayout: number[];
  disabled: boolean;
  layout: number[];
  orientation: "horizontal" | "vertical";
};

function render(
  layout = "50,50",
  orientation: "horizontal" | "vertical" = "vertical",
  attributes = "",
) {
  defineSplitterElements();
  document.body.innerHTML = `
    <aria-splitter default-layout="${layout}" orientation="${orientation}" ${attributes}>
      <aria-splitter-panel id="first">First</aria-splitter-panel>
      <aria-splitter-separator aria-label="Resize panels"></aria-splitter-separator>
      <aria-splitter-panel id="second">Second</aria-splitter-panel>
    </aria-splitter>`;
  return {
    root: document.querySelector<SplitterRoot>("aria-splitter")!,
    panels: Array.from(
      document.querySelectorAll<HTMLElement>("aria-splitter-panel"),
    ) as [HTMLElement, HTMLElement],
    separator: document.querySelector<HTMLElement>("aria-splitter-separator")!,
  };
}

function key(element: HTMLElement, value: string) {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: value,
  });
  element.dispatchEvent(event);
  return event;
}

function pointer(type: string, init: MouseEventInit & { pointerId: number }) {
  const event = new MouseEvent(type, init) as MouseEvent & { pointerId: number };
  Object.defineProperty(event, "pointerId", { value: init.pointerId });
  return event;
}

describe("@ariaui-web/splitter", () => {
  afterEach(() => {
    document.body.replaceChildren();
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    vi.restoreAllMocks();
  });

  it("keeps the native package identity and three-part contract", () => {
    expect(componentSpec.packageName).toBe("@ariaui-web/splitter");
    expect(componentSpec.parts).toEqual([
      expect.objectContaining({ name: "Root", tagName: "aria-splitter", defaultRole: "group" }),
      expect.objectContaining({ name: "Panel", tagName: "aria-splitter-panel", defaultRole: null }),
      expect.objectContaining({ name: "Separator", tagName: "aria-splitter-separator", defaultRole: "separator" }),
    ]);
  });

  it("defines and creates every part idempotently", () => {
    defineSplitterElements();
    defineSplitterElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
      expect(getPartSpec(part.name)).toBe(part);
      expect(createSplitterElement(part.name).tagName.toLowerCase()).toBe(part.tagName);
    }
  });

  it("applies vertical percentage layouts and rounds values", () => {
    const { root, panels } = render("25.125,74.875");

    expect(root.getAttribute("role")).toBe("group");
    expect(root.dataset.orientation).toBe("vertical");
    expect(root.layout).toEqual([25.13, 74.88]);
    expect(panels[0].style.width).toBe("25.13%");
    expect(panels[1].style.width).toBe("74.88%");
    expect(panels[0].style.flexBasis).toBe("25.13%");
    expect(panels[0].style.flexGrow).toBe("0");
    expect(panels[0].style.flexShrink).toBe("0");
    expect(panels[0].style.overflow).toBe("hidden");
    expect(panels[0].style.transition).toContain("200ms");
  });

  it("applies horizontal layouts using height", () => {
    const { panels, separator } = render("30,70", "horizontal");

    expect(panels[0].style.height).toBe("30%");
    expect(panels[0].style.width).toBe("");
    expect(separator.dataset.orientation).toBe("horizontal");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("reflects separator ARIA values and focus state", () => {
    const { separator } = render("30,70");

    expect(separator.getAttribute("role")).toBe("separator");
    expect(separator.getAttribute("aria-valuenow")).toBe("30");
    expect(separator.getAttribute("aria-valuemin")).toBe("0");
    expect(separator.getAttribute("aria-valuemax")).toBe("100");
    expect(separator.getAttribute("aria-disabled")).toBe("false");
    expect(separator.getAttribute("tabindex")).toBe("0");
  });

  it("resizes vertical panels with Left and Right while ignoring Up and Down", () => {
    const { panels, separator } = render();

    expect(key(separator, "ArrowRight").defaultPrevented).toBe(true);
    expect(panels[0].style.width).toBe("55%");
    expect(panels[1].style.width).toBe("45%");
    key(separator, "ArrowLeft");
    key(separator, "ArrowUp");
    key(separator, "ArrowDown");
    expect(panels[0].style.width).toBe("50%");
  });

  it("resizes horizontal panels with Up and Down while ignoring Left and Right", () => {
    const { panels, separator } = render("50,50", "horizontal");

    key(separator, "ArrowDown");
    expect(panels[0].style.height).toBe("55%");
    key(separator, "ArrowUp");
    key(separator, "ArrowLeft");
    key(separator, "ArrowRight");
    expect(panels[0].style.height).toBe("50%");
  });

  it("supports Home, End, and Enter collapse/restore", () => {
    const { panels, separator } = render("40,60");

    key(separator, "Enter");
    expect(panels[0].style.width).toBe("0%");
    expect(panels[1].style.width).toBe("100%");
    key(separator, "Enter");
    expect(panels[0].style.width).toBe("40%");
    key(separator, "Home");
    expect(panels[0].style.width).toBe("0%");
    key(separator, "End");
    expect(panels[0].style.width).toBe("100%");
    expect(panels[1].style.width).toBe("0%");
  });

  it("clamps sizes and only changes adjacent panels", () => {
    defineSplitterElements();
    document.body.innerHTML = `
      <aria-splitter default-layout="20,30,50">
        <aria-splitter-panel>One</aria-splitter-panel>
        <aria-splitter-separator index="0"></aria-splitter-separator>
        <aria-splitter-panel>Two</aria-splitter-panel>
        <aria-splitter-separator index="1"></aria-splitter-separator>
        <aria-splitter-panel>Three</aria-splitter-panel>
      </aria-splitter>`;
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("aria-splitter-panel"),
    ) as [HTMLElement, HTMLElement, HTMLElement];
    const separators = Array.from(
      document.querySelectorAll<HTMLElement>("aria-splitter-separator"),
    ) as [HTMLElement, HTMLElement];

    key(separators[0], "ArrowRight");
    key(separators[0], "ArrowRight");
    expect(panels.map((panel) => panel.style.width)).toEqual(["30%", "20%", "50%"]);
    key(separators[0], "End");
    key(separators[0], "ArrowRight");
    expect(panels.map((panel) => panel.style.width)).toEqual(["50%", "0%", "50%"]);
  });

  it("disables keyboard and pointer interactions for every separator", () => {
    const { root, panels, separator } = render("50,50", "vertical", "disabled");

    expect(root.disabled).toBe(true);
    expect(separator.getAttribute("aria-disabled")).toBe("true");
    expect(separator.getAttribute("tabindex")).toBe("-1");
    expect(separator.hasAttribute("data-disabled")).toBe(true);
    key(separator, "ArrowRight");
    separator.dispatchEvent(pointer("pointerdown", { bubbles: true, clientX: 50, pointerId: 1 }));
    expect(panels[0].style.width).toBe("50%");
    expect(separator.hasAttribute("data-dragging")).toBe(false);
  });

  it("dispatches layoutchange with each changed percentage array", () => {
    const { root, separator } = render();
    const listener = vi.fn();
    root.addEventListener("layoutchange", listener);

    key(separator, "ArrowRight");

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]![0] as CustomEvent).detail).toEqual({ layout: [55, 45] });
  });

  it("keeps nested splitter layouts independent", () => {
    defineSplitterElements();
    document.body.innerHTML = `
      <aria-splitter id="outer" default-layout="30,70" orientation="vertical">
        <aria-splitter-panel id="outer-left">Left</aria-splitter-panel>
        <aria-splitter-separator aria-label="Outer"></aria-splitter-separator>
        <aria-splitter-panel id="outer-right">
          <aria-splitter id="inner" default-layout="40,60" orientation="horizontal">
            <aria-splitter-panel id="inner-top">Top</aria-splitter-panel>
            <aria-splitter-separator aria-label="Inner"></aria-splitter-separator>
            <aria-splitter-panel id="inner-bottom">Bottom</aria-splitter-panel>
          </aria-splitter>
        </aria-splitter-panel>
      </aria-splitter>`;

    const outerLeft = document.querySelector<HTMLElement>("#outer-left")!;
    const innerTop = document.querySelector<HTMLElement>("#inner-top")!;
    const outerSeparator = document.querySelector<HTMLElement>('[aria-label="Outer"]')!;
    const innerSeparator = document.querySelector<HTMLElement>('[aria-label="Inner"]')!;
    expect(outerLeft.style.width).toBe("30%");
    expect(innerTop.style.height).toBe("40%");
    key(innerSeparator, "ArrowDown");
    expect(innerTop.style.height).toBe("45%");
    expect(outerLeft.style.width).toBe("30%");
    key(outerSeparator, "ArrowRight");
    expect(outerLeft.style.width).toBe("35%");
  });

  it("resizes with pointer dragging and restores document styles", () => {
    const { root, panels, separator } = render();
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 100));
    document.body.style.cursor = "wait";
    document.body.style.userSelect = "text";

    separator.dispatchEvent(pointer("pointerdown", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      pointerId: 1,
    }));
    expect(separator.hasAttribute("data-dragging")).toBe(true);
    expect(document.body.style.cursor).toBe("col-resize");
    expect(document.body.style.userSelect).toBe("none");

    window.dispatchEvent(pointer("pointermove", { clientX: 120, pointerId: 1 }));
    expect(panels[0].style.width).toBe("60%");
    expect(panels[1].style.width).toBe("40%");
    expect(panels[0].style.transition).toBe("none");

    window.dispatchEvent(pointer("pointerup", { pointerId: 1 }));
    expect(separator.hasAttribute("data-dragging")).toBe(false);
    expect(document.body.style.cursor).toBe("wait");
    expect(document.body.style.userSelect).toBe("text");
    expect(panels[0].style.transition).toContain("200ms");
  });

  it("supports defaultLayout and orientation properties before connection", () => {
    defineSplitterElements();
    const root = createSplitterElement() as SplitterRoot;
    root.defaultLayout = [35, 65];
    root.orientation = "horizontal";
    root.innerHTML = `
      <aria-splitter-panel>Top</aria-splitter-panel>
      <aria-splitter-separator></aria-splitter-separator>
      <aria-splitter-panel>Bottom</aria-splitter-panel>`;
    document.body.append(root);

    expect(root.getAttribute("default-layout")).toBe("35,65");
    expect(root.layout).toEqual([35, 65]);
    expect(root.querySelector<HTMLElement>("aria-splitter-panel")?.style.height).toBe("35%");
  });

  it("rejects a root without a default layout", () => {
    defineSplitterElements();
    const root = createSplitterElement() as SplitterRoot;
    expect(() => root.connectedCallback()).toThrow("defaultLayout is required");
  });

  it("rejects panels and separators outside a root", () => {
    defineSplitterElements();
    const panel = document.createElement("aria-splitter-panel") as SplitterRoot;
    const separator = document.createElement("aria-splitter-separator") as SplitterRoot;
    expect(() => panel.connectedCallback()).toThrow(
      "Splitter components must be used within Root",
    );
    expect(() => separator.connectedCallback()).toThrow(
      "Splitter components must be used within Root",
    );
  });

  it("preserves panel sizes when panels are removed", async () => {
    defineSplitterElements();
    document.body.innerHTML = `
      <aria-splitter default-layout="20,30,50">
        <aria-splitter-panel id="remove">First</aria-splitter-panel>
        <aria-splitter-separator></aria-splitter-separator>
        <aria-splitter-panel>Second</aria-splitter-panel>
        <aria-splitter-separator></aria-splitter-separator>
        <aria-splitter-panel>Third</aria-splitter-panel>
      </aria-splitter>`;
    const root = document.querySelector<SplitterRoot>("aria-splitter")!;
    document.querySelector("#remove")!.remove();
    await Promise.resolve();

    expect(root.layout).toEqual([30, 50]);
  });

  it("finishes pointer dragging for splitters inside a shadow root", () => {
    defineSplitterElements();
    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <aria-splitter default-layout="50,50">
        <aria-splitter-panel>First</aria-splitter-panel>
        <aria-splitter-separator></aria-splitter-separator>
        <aria-splitter-panel>Second</aria-splitter-panel>
      </aria-splitter>`;
    document.body.append(host);
    const root = shadowRoot.querySelector<SplitterRoot>("aria-splitter")!;
    const separator = root.querySelector<HTMLElement>("aria-splitter-separator")!;
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 100));

    separator.dispatchEvent(pointer("pointerdown", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      pointerId: 2,
    }));
    window.dispatchEvent(pointer("pointermove", { clientX: 120, pointerId: 2 }));
    expect(root.layout).toEqual([60, 40]);
    window.dispatchEvent(pointer("pointerup", { pointerId: 2 }));
    expect(separator.hasAttribute("data-dragging")).toBe(false);
    expect(document.body.style.cursor).toBe("");
    expect(document.body.style.userSelect).toBe("");
  });

  it("supports concurrent pointer drags on independent roots", () => {
    defineSplitterElements();
    document.body.innerHTML = `
      <aria-splitter id="one" default-layout="50,50">
        <aria-splitter-panel>First</aria-splitter-panel>
        <aria-splitter-separator></aria-splitter-separator>
        <aria-splitter-panel>Second</aria-splitter-panel>
      </aria-splitter>
      <aria-splitter id="two" default-layout="50,50">
        <aria-splitter-panel>First</aria-splitter-panel>
        <aria-splitter-separator></aria-splitter-separator>
        <aria-splitter-panel>Second</aria-splitter-panel>
      </aria-splitter>`;
    const roots = Array.from(
      document.querySelectorAll<SplitterRoot>("aria-splitter"),
    ) as [SplitterRoot, SplitterRoot];
    const separators = Array.from(
      document.querySelectorAll<HTMLElement>("aria-splitter-separator"),
    ) as [HTMLElement, HTMLElement];
    for (const root of roots) {
      vi.spyOn(root, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 100));
    }

    separators[0].dispatchEvent(pointer("pointerdown", { clientX: 100, pointerId: 1 }));
    separators[1].dispatchEvent(pointer("pointerdown", { clientX: 100, pointerId: 2 }));
    window.dispatchEvent(pointer("pointermove", { clientX: 120, pointerId: 1 }));
    window.dispatchEvent(pointer("pointermove", { clientX: 80, pointerId: 2 }));
    expect(roots[0].layout).toEqual([60, 40]);
    expect(roots[1].layout).toEqual([40, 60]);

    window.dispatchEvent(pointer("pointerup", { pointerId: 1 }));
    expect(document.body.style.userSelect).toBe("none");
    window.dispatchEvent(pointer("pointerup", { pointerId: 2 }));
    expect(document.body.style.userSelect).toBe("");
  });

  it("uses the owner document window for adopted splitter drags", () => {
    const { root, separator } = render();
    const frame = document.createElement("iframe");
    document.body.append(frame);
    const frameDocument = frame.contentDocument!;
    const frameWindow = frame.contentWindow!;
    frameDocument.body.append(frameDocument.adoptNode(root));
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 100));

    separator.dispatchEvent(pointer("pointerdown", { clientX: 100, pointerId: 3 }));
    frameWindow.dispatchEvent(pointer("pointermove", { clientX: 120, pointerId: 3 }));
    expect(root.layout).toEqual([60, 40]);
    frameWindow.dispatchEvent(pointer("pointerup", { pointerId: 3 }));
    expect(frameDocument.body.style.cursor).toBe("");
    expect(frameDocument.body.style.userSelect).toBe("");
  });
});
