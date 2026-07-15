import { afterEach, describe, expect, it, vi } from "vitest";
import {
  componentSpec,
  defineListboxElements,
  type ComponentPartName,
} from "../src";

type RuntimeListboxElement = HTMLElement & {
  offset: { x: number; y: number };
  value: string;
};

function key(target: Element, value: string) {
  const event = new KeyboardEvent("keydown", {
    key: value,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

function renderListbox(markup: string) {
  defineListboxElements();
  document.body.innerHTML = markup;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("@ariaui-web/listbox source parity", () => {
  it("exposes the ten source Listbox parts with native roles", () => {
    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Content",
      "Group",
      "GroupLabel",
      "Label",
      "Option",
      "Sub",
      "SubContent",
      "SubTrigger",
      "Viewport",
    ] satisfies ComponentPartName[]);

    expect(componentSpec.parts.map(({ name, tagName, defaultRole }) => ({
      name,
      tagName,
      defaultRole,
    }))).toEqual([
      { name: "Root", tagName: "aria-listbox", defaultRole: null },
      { name: "Content", tagName: "aria-listbox-content", defaultRole: "listbox" },
      { name: "Group", tagName: "aria-listbox-group", defaultRole: "group" },
      { name: "GroupLabel", tagName: "aria-listbox-group-label", defaultRole: null },
      { name: "Label", tagName: "aria-listbox-label", defaultRole: null },
      { name: "Option", tagName: "aria-listbox-option", defaultRole: "option" },
      { name: "Sub", tagName: "aria-listbox-sub", defaultRole: null },
      { name: "SubContent", tagName: "aria-listbox-sub-content", defaultRole: "listbox" },
      { name: "SubTrigger", tagName: "aria-listbox-sub-trigger", defaultRole: "option" },
      { name: "Viewport", tagName: "aria-listbox-viewport", defaultRole: null },
    ]);

    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 50,
      learningSources: expect.arrayContaining([
        "../ariaui/packages/listbox/__test__/listbox.test.tsx",
        "../ariaui/web/doc/src/app/docs/components/listbox/page.md",
      ]),
    });
  });

  it("wires labels, groups, defaults, and option state without putting listbox semantics on Root", () => {
    renderListbox(`
      <aria-listbox default-value="banana">
        <aria-listbox-label>Choose a fruit</aria-listbox-label>
        <aria-listbox-content>
          <aria-listbox-group id="fruit-group">
            <aria-listbox-group-label>Fruits</aria-listbox-group-label>
            <aria-listbox-option value="apple">Apple</aria-listbox-option>
            <aria-listbox-option value="banana">Banana</aria-listbox-option>
          </aria-listbox-group>
        </aria-listbox-content>
      </aria-listbox>
    `);

    const root = document.querySelector("aria-listbox") as RuntimeListboxElement;
    const label = document.querySelector("aria-listbox-label") as HTMLElement;
    const content = document.querySelector("aria-listbox-content") as HTMLElement;
    const group = document.querySelector("aria-listbox-group") as HTMLElement;
    const groupLabel = document.querySelector("aria-listbox-group-label") as HTMLElement;
    const apple = document.querySelector("aria-listbox-option[value='apple']") as HTMLElement;
    const banana = document.querySelector("aria-listbox-option[value='banana']") as HTMLElement;

    expect(root.hasAttribute("role")).toBe(false);
    expect(root.value).toBe("banana");
    expect(content.getAttribute("role")).toBe("listbox");
    expect(content.getAttribute("tabindex")).toBe("0");
    expect(content.getAttribute("aria-labelledby")).toBe(label.id);
    expect(content.getAttribute("aria-multiselectable")).toBe("false");
    expect(group.getAttribute("aria-labelledby")).toBe(groupLabel.id);
    expect(apple.getAttribute("aria-selected")).toBe("false");
    expect(apple.getAttribute("data-state")).toBe("unchecked");
    expect(banana.getAttribute("aria-selected")).toBe("true");
    expect(banana.getAttribute("data-state")).toBe("checked");
  });

  it("updates single selection and emits one composed valuechange", () => {
    renderListbox(`
      <aria-listbox default-value="banana">
        <aria-listbox-content>
          <aria-listbox-option value="apple">Apple</aria-listbox-option>
          <aria-listbox-option value="banana">Banana</aria-listbox-option>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const root = document.querySelector("aria-listbox") as RuntimeListboxElement;
    const apple = document.querySelector("aria-listbox-option[value='apple']") as HTMLElement;
    const values: unknown[] = [];
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent).detail.value));

    apple.click();
    apple.click();

    expect(root.value).toBe("apple");
    expect(apple.getAttribute("aria-selected")).toBe("true");
    expect(values).toEqual(["apple"]);
  });

  it("toggles multiple selection and emits array values", () => {
    renderListbox(`
      <aria-listbox selection-mode="multiple" default-value="apple">
        <aria-listbox-content>
          <aria-listbox-option value="apple">Apple</aria-listbox-option>
          <aria-listbox-option value="banana">Banana</aria-listbox-option>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const root = document.querySelector("aria-listbox") as RuntimeListboxElement;
    const apple = document.querySelector("aria-listbox-option[value='apple']") as HTMLElement;
    const banana = document.querySelector("aria-listbox-option[value='banana']") as HTMLElement;
    const values: unknown[] = [];
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent).detail.value));

    banana.click();
    apple.click();

    expect(root.value).toBe("banana");
    expect(values).toEqual([["apple", "banana"], ["banana"]]);
  });

  it("navigates with wrapping, Home, End, selection keys, and active descendant", () => {
    renderListbox(`
      <aria-listbox>
        <aria-listbox-content>
          <aria-listbox-option value="apple">Apple</aria-listbox-option>
          <aria-listbox-option value="banana" disabled>Banana</aria-listbox-option>
          <aria-listbox-option value="cherry">Cherry</aria-listbox-option>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const root = document.querySelector("aria-listbox") as RuntimeListboxElement;
    const content = document.querySelector("aria-listbox-content") as HTMLElement;
    const [apple, banana, cherry] = Array.from(document.querySelectorAll<HTMLElement>("aria-listbox-option"));

    content.focus();
    key(content, "ArrowUp");
    expect(document.activeElement).toBe(cherry);
    key(cherry!, "ArrowDown");
    expect(document.activeElement).toBe(apple);
    key(apple!, "End");
    expect(document.activeElement).toBe(cherry);
    key(cherry!, "Home");
    expect(document.activeElement).toBe(apple);
    key(apple!, "ArrowDown");
    expect(document.activeElement).toBe(banana);
    expect(content.getAttribute("aria-activedescendant")).toBe(banana!.id);
    key(banana!, "Enter");
    expect(root.value).toBe("");
    key(banana!, "ArrowDown");
    key(cherry!, " ");
    expect(root.value).toBe("cherry");
  });

  it("supports 500ms case-insensitive typeahead and hover without moving focus", () => {
    vi.useFakeTimers();
    renderListbox(`
      <aria-listbox>
        <aria-listbox-content>
          <aria-listbox-option value="apple">Apple</aria-listbox-option>
          <aria-listbox-option value="apricot">Apricot</aria-listbox-option>
          <aria-listbox-option value="banana">Banana</aria-listbox-option>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const content = document.querySelector("aria-listbox-content") as HTMLElement;
    const [apple, apricot, banana] = Array.from(document.querySelectorAll<HTMLElement>("aria-listbox-option"));

    content.focus();
    key(content, "A");
    key(apple!, "p");
    key(apple!, "r");
    expect(document.activeElement).toBe(apricot);
    vi.advanceTimersByTime(501);
    key(apricot!, "B");
    expect(document.activeElement).toBe(banana);

    content.focus();
    apple!.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(apple!.getAttribute("data-active")).toBe("true");
    expect(document.activeElement).toBe(content);
  });

  it("keeps nested roots isolated and clears a removed active descendant", async () => {
    renderListbox(`
      <aria-listbox id="outer">
        <aria-listbox-content>
          <aria-listbox-option value="outer">Outer</aria-listbox-option>
          <aria-listbox id="inner" default-value="inner">
            <aria-listbox-content>
              <aria-listbox-option value="inner">Inner</aria-listbox-option>
            </aria-listbox-content>
          </aria-listbox>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const outer = document.querySelector("#outer") as RuntimeListboxElement;
    const inner = document.querySelector("#inner") as RuntimeListboxElement;
    const outerContent = outer.querySelector(":scope > aria-listbox-content") as HTMLElement;
    const outerOption = outerContent.querySelector("aria-listbox-option[value='outer']") as HTMLElement;
    const innerOption = inner.querySelector("aria-listbox-option") as HTMLElement;

    innerOption.click();
    expect(outer.value).toBe("");
    expect(inner.value).toBe("inner");

    outerContent.focus();
    key(outerContent, "ArrowDown");
    expect(document.activeElement).toBe(outerOption);
    outerOption.remove();
    await Promise.resolve();
    expect(outerContent.hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("keeps invalid native compositions inert", () => {
    renderListbox(`
      <aria-listbox-viewport max-visible-items="2"></aria-listbox-viewport>
      <aria-listbox-sub-trigger>More</aria-listbox-sub-trigger>
      <aria-listbox-sub-content>Nested</aria-listbox-sub-content>
    `);
    const viewport = document.querySelector("aria-listbox-viewport") as HTMLElement;
    const trigger = document.querySelector("aria-listbox-sub-trigger") as HTMLElement;
    const content = document.querySelector("aria-listbox-sub-content") as HTMLElement;

    expect(viewport.style.maxHeight).toBe("");
    expect(viewport.hasAttribute("role")).toBe(false);
    expect(trigger.hasAttribute("role")).toBe(false);
    expect(trigger.hasAttribute("tabindex")).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("sizes Viewport from the first option row and leaves invalid measurements unconstrained", () => {
    const rect = new DOMRect(0, 0, 220, 28);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return this.matches("aria-listbox-option") ? rect : new DOMRect();
    });

    renderListbox(`
      <aria-listbox>
        <aria-listbox-content>
          <aria-listbox-viewport max-visible-items="3">
            <aria-listbox-option value="apple">Apple</aria-listbox-option>
            <aria-listbox-option value="banana">Banana</aria-listbox-option>
            <aria-listbox-option value="orange">Orange</aria-listbox-option>
            <aria-listbox-option value="mango">Mango</aria-listbox-option>
          </aria-listbox-viewport>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const viewport = document.querySelector("aria-listbox-viewport") as HTMLElement;
    expect(viewport.getAttribute("data-listbox-viewport")).toBe("");
    expect(viewport.hasAttribute("role")).toBe(false);
    expect(viewport.style.maxHeight).toBe("84px");
    expect(viewport.style.overflowY).toBe("auto");

    viewport.setAttribute("max-visible-items", "0");
    expect(viewport.style.maxHeight).toBe("");
    expect(viewport.style.overflowY).toBe("");
  });

  it("recalculates Viewport when the measured option resizes", () => {
    let height = 20;
    let resize: ResizeObserverCallback | undefined;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return this.matches("aria-listbox-option") ? new DOMRect(0, 0, 200, height) : new DOMRect();
    });
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe() {}
      unobserve() {}
      disconnect() {}
    });

    renderListbox(`
      <aria-listbox><aria-listbox-content>
        <aria-listbox-viewport max-visible-items="2">
          <aria-listbox-option value="a">A</aria-listbox-option>
        </aria-listbox-viewport>
      </aria-listbox-content></aria-listbox>
    `);
    const viewport = document.querySelector("aria-listbox-viewport") as HTMLElement;
    expect(viewport.style.maxHeight).toBe("40px");
    height = 24;
    resize?.([], {} as ResizeObserver);
    expect(viewport.style.maxHeight).toBe("48px");
  });

  it("opens and closes a single-select submenu with pointer and keyboard behavior", () => {
    renderListbox(`
      <button id="outside">Outside</button>
      <aria-listbox>
        <aria-listbox-content>
          <aria-listbox-option value="apple">Apple</aria-listbox-option>
          <aria-listbox-sub>
            <aria-listbox-sub-trigger>Vegetables</aria-listbox-sub-trigger>
            <aria-listbox-sub-content>
              <aria-listbox-option value="carrot">Carrot</aria-listbox-option>
              <aria-listbox-option value="potato">Potato</aria-listbox-option>
            </aria-listbox-sub-content>
          </aria-listbox-sub>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const root = document.querySelector("aria-listbox") as RuntimeListboxElement;
    const trigger = document.querySelector("aria-listbox-sub-trigger") as HTMLElement;
    const subContent = document.querySelector("aria-listbox-sub-content") as HTMLElement;
    const carrot = subContent.querySelector("aria-listbox-option[value='carrot']") as HTMLElement;

    expect(subContent.hidden).toBe(true);
    trigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(subContent.hidden).toBe(false);

    key(trigger, "ArrowRight");
    expect(document.activeElement).toBe(carrot);
    key(carrot, "Escape");
    expect(subContent.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);

    trigger.click();
    carrot.click();
    expect(root.value).toBe("carrot");
    expect(subContent.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);

    trigger.click();
    document.querySelector("#outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(subContent.hidden).toBe(true);
  });

  it("keeps a multiple-select submenu open while toggling nested values", () => {
    renderListbox(`
      <aria-listbox selection-mode="multiple" default-value="apple">
        <aria-listbox-content>
          <aria-listbox-option value="apple">Apple</aria-listbox-option>
          <aria-listbox-sub>
            <aria-listbox-sub-trigger>Vegetables</aria-listbox-sub-trigger>
            <aria-listbox-sub-content>
              <aria-listbox-option value="carrot">Carrot</aria-listbox-option>
            </aria-listbox-sub-content>
          </aria-listbox-sub>
        </aria-listbox-content>
      </aria-listbox>
    `);
    const root = document.querySelector("aria-listbox") as RuntimeListboxElement;
    const trigger = document.querySelector("aria-listbox-sub-trigger") as HTMLElement;
    const subContent = document.querySelector("aria-listbox-sub-content") as HTMLElement;
    const carrot = subContent.querySelector("aria-listbox-option") as HTMLElement;
    trigger.click();
    carrot.click();
    expect(root.value).toBe("apple,carrot");
    expect(subContent.hidden).toBe(false);
  });

  it("positions SubContent right-start, flips left, and applies Sub offsets", () => {
    const width = Object.getOwnPropertyDescriptor(document.documentElement, "clientWidth");
    const height = Object.getOwnPropertyDescriptor(document.documentElement, "clientHeight");
    try {
      Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1000 });
      Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 1000 });
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
        if (this.matches("aria-listbox-sub-trigger")) return new DOMRect(900, 100, 120, 32);
        if (this.matches("aria-listbox-sub-content")) return new DOMRect(0, 0, 180, 120);
        return new DOMRect();
      });

      renderListbox(`
        <aria-listbox><aria-listbox-content>
          <aria-listbox-sub offset-y="-5">
            <aria-listbox-sub-trigger>Vegetables</aria-listbox-sub-trigger>
            <aria-listbox-sub-content>
              <aria-listbox-option value="carrot">Carrot</aria-listbox-option>
            </aria-listbox-sub-content>
          </aria-listbox-sub>
        </aria-listbox-content></aria-listbox>
      `);
      const trigger = document.querySelector("aria-listbox-sub-trigger") as HTMLElement;
      const content = document.querySelector("aria-listbox-sub-content") as HTMLElement;
      trigger.click();

      expect(content.dataset.side).toBe("left");
      expect(content.style.left).toBe("720px");
      expect(content.style.top).toBe("95px");
      expect(content.style.visibility).toBe("visible");
    } finally {
      if (width) Object.defineProperty(document.documentElement, "clientWidth", width);
      else Reflect.deleteProperty(document.documentElement, "clientWidth");
      if (height) Object.defineProperty(document.documentElement, "clientHeight", height);
      else Reflect.deleteProperty(document.documentElement, "clientHeight");
    }
  });
});
