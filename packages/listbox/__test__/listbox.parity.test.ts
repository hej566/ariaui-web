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
});
