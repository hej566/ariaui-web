import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createAriaWebComponent,
  createComponentPartHelpers,
  createElementTagName,
  defineCustomElement,
  joinClassNames,
  mergeClassNames,
} from "../src";

let testElementId = 0;

function defineTestElement(part: { name: string; defaultRole: string | null }) {
  const tagName = `aria-utils-test-${++testElementId}`;
  const Element = createAriaWebComponent({ ...part, tagName, defaultAttributes: {} }, "utils-test");
  defineCustomElement(tagName, Element);
  const element = document.createElement(tagName) as HTMLElement & {
    checked: boolean;
    disabled: boolean;
    indeterminate: boolean;
    open: boolean;
    pressed: boolean;
    selected: boolean;
    value: string;
  };
  document.body.append(element);
  return element;
}

describe("@ariaui-web/utils", () => {
  it("joins and merges class names", () => {
    expect(joinClassNames("root", false, undefined, "active")).toBe("root active");
    expect(mergeClassNames({ root: "base" }, { root: "override" })).toEqual({ root: "override" });
  });

  it("creates stable custom element tag names", () => {
    expect(createElementTagName("accordion")).toBe("aria-accordion");
    expect(createElementTagName("accordion", "Trigger")).toBe("aria-accordion-trigger");
  });

  it("keeps shared utilities split into focused modules", () => {
    const srcRoot = join(process.cwd(), "packages", "utils", "src");
    const indexSource = readFileSync(join(srcRoot, "index.ts"), "utf8");
    const moduleFiles = [
      "aria-web-element.ts",
      "class-names.ts",
      "component-factory.ts",
      "component-helpers.ts",
      "custom-elements.ts",
      "roles.ts",
      "tag-name.ts",
      "types.ts",
    ];

    expect(indexSource).not.toContain("class AriaWebElement");
    expect(indexSource).not.toContain("function isCheckableRole");
    expect(indexSource.split("\n").filter((line) => line.trim()).length).toBeLessThanOrEqual(16);
    for (const file of moduleFiles) {
      expect(existsSync(join(srcRoot, file))).toBe(true);
    }
  });

  it("creates reusable component part helpers", () => {
    const componentSpec = {
      packageName: "@ariaui-web/utils-test",
      parts: [
        { name: "Root", tagName: "aria-utils-helper", defaultRole: "button", defaultAttributes: {} },
        { name: "Trigger", tagName: "aria-utils-helper-trigger", defaultRole: "button", defaultAttributes: {} },
      ],
    } as const;
    const helpers = createComponentPartHelpers(componentSpec, "Root");

    expect(helpers.getPartSpec("Trigger")).toBe(componentSpec.parts[1]);
    expect(helpers.createElement().tagName.toLowerCase()).toBe("aria-utils-helper");
    expect(helpers.createElement("Trigger").tagName.toLowerCase()).toBe("aria-utils-helper-trigger");
    expect(() => helpers.getPartSpec("__missing__" as "Root")).toThrow("Unknown @ariaui-web/utils-test part");
  });

  it("reflects checkable state to ARIA, data attributes, and named hidden input", () => {
    const element = defineTestElement({ name: "Root", defaultRole: "checkbox" });
    element.setAttribute("name", "accepted");
    element.value = "yes";

    expect(element.getAttribute("role")).toBe("checkbox");
    expect(element.getAttribute("aria-checked")).toBe("false");
    expect(element.getAttribute("data-state")).toBe("unchecked");
    expect(element.getAttribute("tabindex")).toBe("0");

    element.click();

    expect(element.checked).toBe(true);
    expect(element.getAttribute("checked")).toBe("");
    expect(element.getAttribute("aria-checked")).toBe("true");
    expect(element.getAttribute("data-state")).toBe("checked");
    expect(element.querySelector("input[type='hidden']")).toMatchObject({
      name: "accepted",
      value: "yes",
    });

    element.indeterminate = true;

    expect(element.getAttribute("aria-checked")).toBe("mixed");
    expect(element.getAttribute("data-state")).toBe("indeterminate");
  });

  it("reflects open, pressed, selected, disabled, and value properties", () => {
    const element = defineTestElement({ name: "Trigger", defaultRole: "button" });

    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.value = "alpha";
    element.disabled = true;

    expect(element.getAttribute("data-state")).toBe("open");
    expect(element.getAttribute("aria-expanded")).toBe("true");
    expect(element.getAttribute("aria-pressed")).toBe("true");
    expect(element.getAttribute("aria-selected")).toBe("true");
    expect(element.getAttribute("data-value")).toBe("alpha");
    expect(element.getAttribute("aria-disabled")).toBe("true");
    expect(element.getAttribute("data-disabled")).toBe("");
    expect(element.getAttribute("tabindex")).toBe("-1");
  });

  it("adds keyboard activation for non-native button-like custom elements", () => {
    const element = defineTestElement({ name: "Trigger", defaultRole: "button" });
    let clickCount = 0;
    element.addEventListener("click", () => {
      clickCount += 1;
    });

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    const spaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    element.dispatchEvent(spaceKeyDown);
    element.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }));

    expect(spaceKeyDown.defaultPrevented).toBe(true);
    expect(clickCount).toBe(2);
  });
});
