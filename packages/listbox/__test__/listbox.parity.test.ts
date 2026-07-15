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
});
