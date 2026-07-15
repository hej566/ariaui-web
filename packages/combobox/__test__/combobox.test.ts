import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createComboboxElement, defineComboboxElements, getPartSpec, type ComponentPartName } from "../src";

type RuntimeElement = HTMLElement & {
  checked: boolean;
  defaultChecked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  open: boolean;
  pressed: boolean;
  selected: boolean;
  value: string;
};

type RuntimePartSpec = {
  readonly name: string;
  readonly tagName: string;
  readonly defaultRole: string | null;
  readonly defaultAttributes: Readonly<Record<string, string>>;
};

type RuntimeElementList = [RuntimeElement, RuntimeElement, RuntimeElement, RuntimeElement, ...RuntimeElement[]];

const checkableRoles = new Set(["checkbox", "menuitemcheckbox", "menuitemradio", "radio", "switch"]);
const buttonLikeRoles = new Set(["button", "checkbox", "link", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch", "tab"]);
const expandableRoles = new Set(["button", "combobox", "menuitem"]);
const selectableRoles = new Set(["option", "row", "tab", "treeitem"]);
const focusableRoles = new Set(["button", "checkbox", "link", "menuitemcheckbox", "menuitemradio", "option", "switch", "tab"]);

function documentedRequirementAttributes() {
  const attributes = new Set<string>();
  const tagNames: ReadonlySet<string> = new Set(componentSpec.parts.map((part) => part.tagName));
  const attributePattern = /\b(?:aria|data)-[a-z0-9-]+\b|\bnative-composition\b|\bdefault-open\b|\bdismissible\b|\btabIndex\b|\btabindex\b|\btype\b|\brole\b|\bid\b|\bdir\b|\borientation\b|\bdisabled\b|\brequired\b|\bvalue\b|\bopen\b|\bchecked\b|\bselected\b|\bpressed\b/g;

  for (const section of componentSpec.learnedRequirements.sections) {
    for (const requirement of section.requirements) {
      for (const match of requirement.matchAll(attributePattern)) {
        const attribute = match[0] === "tabIndex" ? "tabindex" : match[0];
        if (!tagNames.has(attribute)) {
          attributes.add(attribute);
        }
      }
    }
  }

  return Array.from(attributes).sort();
}

function kebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
}

function appendPart(tagName: string) {
  const element = document.createElement(tagName) as RuntimeElement;
  document.body.append(element);
  return element;
}

function inputComboboxValue(input: RuntimeElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function keyDown(element: HTMLElement, key: string) {
  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

describe("@ariaui-web/combobox", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("matches source Combobox part roles and default attributes", () => {
    expect(componentSpec.parts.find((part) => part.name === "Root")?.defaultRole).toBe(null);
    expect(componentSpec.parts.find((part) => part.name === "Trigger")?.defaultRole).toBe("combobox");
    expect(componentSpec.parts.find((part) => part.name === "Trigger")?.defaultAttributes).toMatchObject({
      "aria-expanded": "false",
      "aria-haspopup": "listbox",
    });
    expect(componentSpec.parts.find((part) => part.name === "Input")?.defaultRole).toBe("textbox");
    expect(componentSpec.parts.find((part) => part.name === "Input")?.defaultAttributes).toMatchObject({
      "aria-autocomplete": "list",
    });
    expect(componentSpec.parts.find((part) => part.name === "Button")?.defaultAttributes).toMatchObject({
      tabindex: "-1",
      type: "button",
    });
    expect(componentSpec.parts.find((part) => part.name === "Label")?.defaultRole).toBe(null);
  });

  it("implements source Combobox trigger/listbox wiring, filtering, fallback, and single selection", () => {
    defineComboboxElements();
    document.body.innerHTML = `
      <aria-combobox default-value="Banana" default-input-value="B">
        <aria-combobox-trigger>
          <aria-combobox-input placeholder="Select a fruit"></aria-combobox-input>
          <aria-combobox-button aria-label="Open">Open</aria-combobox-button>
        </aria-combobox-trigger>
        <aria-combobox-content>
          <aria-combobox-group>
            <aria-combobox-label>Fruits</aria-combobox-label>
            <aria-combobox-option value="Apple">Apple</aria-combobox-option>
            <aria-combobox-option value="Banana">Banana</aria-combobox-option>
            <aria-combobox-option value="Blueberry">Blueberry</aria-combobox-option>
          </aria-combobox-group>
          <div data-combobox-fallback>No items found</div>
        </aria-combobox-content>
      </aria-combobox>
    `;

    const root = document.querySelector("aria-combobox") as RuntimeElement;
    const trigger = document.querySelector("aria-combobox-trigger") as RuntimeElement;
    const input = document.querySelector("aria-combobox-input") as RuntimeElement;
    const button = document.querySelector("aria-combobox-button") as RuntimeElement;
    const content = document.querySelector("aria-combobox-content") as RuntimeElement;
    const group = document.querySelector("aria-combobox-group") as RuntimeElement;
    const label = document.querySelector("aria-combobox-label") as RuntimeElement;
    const apple = document.querySelector("aria-combobox-option[value='Apple']") as RuntimeElement;
    const banana = document.querySelector("aria-combobox-option[value='Banana']") as RuntimeElement;
    const blueberry = document.querySelector("aria-combobox-option[value='Blueberry']") as RuntimeElement;
    const fallback = document.querySelector("[data-combobox-fallback]") as HTMLElement;
    const emitted: unknown[] = [];
    root.addEventListener("valuechange", (event) => {
      emitted.push((event as CustomEvent).detail.value);
    });

    expect(root.hasAttribute("role")).toBe(false);
    expect(root.value).toBe("Banana");
    expect(input.value).toBe("B");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(trigger.getAttribute("role")).toBe("combobox");
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("tabindex")).toBe(false);
    expect(trigger.tabIndex).toBe(-1);
    expect(trigger.getAttribute("data-has-value")).toBe("true");
    expect(button.getAttribute("tabindex")).toBe("-1");
    expect(button.getAttribute("type")).toBe("button");
    expect(content.hidden).toBe(true);
    expect(banana.getAttribute("aria-selected")).toBe("true");

    button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));

    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(trigger.hasAttribute("tabindex")).toBe(false);
    expect(trigger.tabIndex).toBe(-1);
    expect(content.getAttribute("role")).toBe("listbox");
    expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
    expect(group.getAttribute("aria-labelledby")).toBe(label.id);

    inputComboboxValue(input, "Ap");

    expect(root.getAttribute("input-value")).toBe("Ap");
    expect(apple.hidden).toBe(false);
    expect(banana.hidden).toBe(true);
    expect(blueberry.hidden).toBe(true);
    expect(fallback.hidden).toBe(true);

    inputComboboxValue(input, "zz");

    expect(apple.hidden).toBe(true);
    expect(group.hidden).toBe(true);
    expect(fallback.hidden).toBe(false);

    inputComboboxValue(input, "");
    apple.click();

    expect(root.value).toBe("Apple");
    expect(emitted).toEqual(["Apple"]);
    expect(root.open).toBe(false);
    expect(input.value).toBe("");
    expect(apple.getAttribute("aria-selected")).toBe("true");
    expect(banana.getAttribute("aria-selected")).toBe("false");
  });

  it("implements source Combobox keyboard navigation, multiple values, disabled guards, backspace removal, and outside dismissal", () => {
    defineComboboxElements();
    document.body.innerHTML = `
      <button id="outside">Outside</button>
      <aria-combobox selection-mode="multiple" default-value="Apple" default-open>
        <aria-combobox-trigger>
          <aria-combobox-input placeholder="Select fruits"></aria-combobox-input>
          <aria-combobox-button aria-label="Open">Open</aria-combobox-button>
        </aria-combobox-trigger>
        <aria-combobox-content>
          <aria-combobox-option value="Apple">Apple</aria-combobox-option>
          <aria-combobox-option value="Banana">Banana</aria-combobox-option>
          <aria-combobox-option value="Cherry" disabled>Cherry</aria-combobox-option>
          <aria-combobox-option value="Orange">Orange</aria-combobox-option>
        </aria-combobox-content>
      </aria-combobox>
    `;

    const root = document.querySelector("aria-combobox") as RuntimeElement;
    const trigger = document.querySelector("aria-combobox-trigger") as RuntimeElement;
    const input = document.querySelector("aria-combobox-input") as RuntimeElement;
    const content = document.querySelector("aria-combobox-content") as RuntimeElement;
    const apple = document.querySelector("aria-combobox-option[value='Apple']") as RuntimeElement;
    const banana = document.querySelector("aria-combobox-option[value='Banana']") as RuntimeElement;
    const cherry = document.querySelector("aria-combobox-option[value='Cherry']") as RuntimeElement;
    const orange = document.querySelector("aria-combobox-option[value='Orange']") as RuntimeElement;
    const emitted: unknown[] = [];
    root.addEventListener("valuechange", (event) => {
      emitted.push((event as CustomEvent).detail.value);
    });

    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-multiselectable")).toBe("true");
    expect(apple.getAttribute("aria-selected")).toBe("true");
    expect(cherry.getAttribute("aria-disabled")).toBe("true");

    keyDown(input, "ArrowDown");
    expect(input.getAttribute("aria-activedescendant")).toBe(apple.id);
    expect(content.getAttribute("aria-activedescendant")).toBe(apple.id);
    expect(apple.getAttribute("data-active")).toBe("true");

    keyDown(input, "ArrowDown");
    expect(input.getAttribute("aria-activedescendant")).toBe(banana.id);
    expect(banana.getAttribute("data-active")).toBe("true");

    keyDown(input, "Enter");
    expect(root.value).toBe("Apple,Banana");
    expect(emitted).toEqual([["Apple", "Banana"]]);
    expect(root.open).toBe(true);
    expect(input.value).toBe("");

    cherry.click();
    expect(root.value).toBe("Apple,Banana");
    expect(emitted).toEqual([["Apple", "Banana"]]);

    keyDown(input, "End");
    expect(input.getAttribute("aria-activedescendant")).toBe(orange.id);

    keyDown(input, "Backspace");
    expect(root.value).toBe("Apple");
    expect(emitted).toEqual([["Apple", "Banana"], ["Apple"]]);

    document.querySelector("#outside")?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the popup open when clicking the input inside the trigger", () => {
    defineComboboxElements();
    document.body.innerHTML = `
      <aria-combobox>
        <aria-combobox-trigger>
          <aria-combobox-input placeholder="Select fruits"></aria-combobox-input>
          <aria-combobox-button aria-label="Open">Open</aria-combobox-button>
        </aria-combobox-trigger>
        <aria-combobox-content>
          <aria-combobox-option value="Apple">Apple</aria-combobox-option>
        </aria-combobox-content>
      </aria-combobox>
    `;

    const root = document.querySelector("aria-combobox") as RuntimeElement;
    const input = document.querySelector("aria-combobox-input") as RuntimeElement;
    const content = document.querySelector("aria-combobox-content") as RuntimeElement;

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    input.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    input.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/combobox");
    expect(componentSpec.slug).toBe("combobox");
    expect("sourcePackage" in componentSpec).toBe(false);
    expect(componentSpec.parts.length).toBeGreaterThan(0);
    expect(componentSpec.parts[0]?.name).toBe("Root");

    for (const part of componentSpec.parts) {
      expect(part.tagName).toMatch(/^aria-[a-z0-9-]+$/);
      expect("source" in part).toBe(false);
    }
  });

  it("maps documented spec attributes into runtime metadata", () => {
    const documentedAttributes = documentedRequirementAttributes();
    const specWithRequirements = componentSpec as typeof componentSpec & {
      requirementAttributes?: readonly string[];
      parts: readonly RuntimePartSpec[];
    };

    expect(specWithRequirements.requirementAttributes).toEqual(documentedAttributes);

    for (const part of specWithRequirements.parts) {
      expect(part.defaultAttributes).toBeDefined();

      for (const attribute of Object.keys(part.defaultAttributes)) {
        expect(documentedAttributes).toContain(attribute);
      }

      if (documentedAttributes.includes("aria-expanded") && part.defaultRole && expandableRoles.has(part.defaultRole) && part.name !== "Button") {
        expect(part.defaultAttributes["aria-expanded"]).toBe("false");
      }

      if (documentedAttributes.includes("aria-selected") && part.defaultRole && selectableRoles.has(part.defaultRole)) {
        expect(part.defaultAttributes["aria-selected"]).toBe("false");
      }
    }
  });

  it("exposes helpers that resolve and create every spec part", () => {
    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);

      const element = createComboboxElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/combobox part");
  });

  it("defines all custom elements idempotently", () => {
    defineComboboxElements();
    defineComboboxElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineComboboxElements();
    const element = createComboboxElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("combobox");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineComboboxElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("combobox");
      expect(element.getAttribute("data-package")).toBe("combobox");
      expect(element.getAttribute("data-part")).toBe(part.name);
      expect(element.getAttribute("part")).toBe(kebabCase(part.name));
      for (const [attribute, value] of Object.entries(runtimePart.defaultAttributes)) {
        expect(element.getAttribute(attribute)).toBe(value);
      }

      if (part.defaultRole) {
        expect(element.getAttribute("role")).toBe(part.defaultRole);
      } else {
        expect(element.hasAttribute("role")).toBe(false);
      }

      const roleOverride = document.createElement(part.tagName);
      roleOverride.setAttribute("role", "presentation");
      document.body.append(roleOverride);
      expect(roleOverride.getAttribute("role")).toBe("presentation");
    }
  });

  it("reflects shared state attributes required by the generated spec", () => {
    defineComboboxElements();
    const element = appendPart(componentSpec.parts[0]!.tagName);
    const rootPart = componentSpec.parts[0] as RuntimePartSpec;

    element.setAttribute("orientation", "vertical");
    element.value = "alpha";
    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.disabled = true;

    expect(element.getAttribute("data-orientation")).toBe("vertical");
    expect(element.getAttribute("data-value")).toBe("alpha");
    expect(element.getAttribute("data-state")).toBe("open");
    expect(element.getAttribute("aria-expanded")).toBe("true");
    expect(element.getAttribute("aria-pressed")).toBe("true");
    expect(element.getAttribute("aria-selected")).toBe("true");
    expect(element.getAttribute("aria-disabled")).toBe("true");
    expect(element.getAttribute("data-disabled")).toBe("");

    element.removeAttribute("orientation");
    element.removeAttribute("value");
    element.open = false;
    element.pressed = false;
    element.selected = false;
    element.disabled = false;

    if (rootPart.defaultAttributes.orientation) {
      expect(element.getAttribute("data-orientation")).toBe(rootPart.defaultAttributes.orientation);
    } else {
      expect(element.hasAttribute("data-orientation")).toBe(false);
    }
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    defineComboboxElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !checkableRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      const defaultElement = document.createElement(part.tagName) as RuntimeElement;
      defaultElement.defaultChecked = true;
      document.body.append(defaultElement);

      expect(element.getAttribute("role")).toBe(role);
      if (focusableRoles.has(role) && part.name !== "Button") {
        expect(element.getAttribute("tabindex")).toBe("0");
      }
      expect(element.checked).toBe(false);
      expect(element.getAttribute("aria-checked")).toBe("false");
      expect(element.getAttribute("data-state")).toBe("unchecked");
      expect(defaultElement.checked).toBe(true);
      expect(defaultElement.getAttribute("aria-checked")).toBe("true");
      expect(defaultElement.getAttribute("data-state")).toBe("checked");

      element.checked = false;
      element.setAttribute("name", "field");
      element.setAttribute("required", "");
      element.value = "on";
      element.click();

      const hiddenInput = element.querySelector("input[data-ariaui-web-hidden-input='true']");

      expect(element.checked).toBe(true);
      expect(element.getAttribute("aria-checked")).toBe("true");
      expect(element.getAttribute("data-state")).toBe("checked");
      expect(hiddenInput).toBeInstanceOf(HTMLInputElement);
      expect(hiddenInput).toMatchObject({
        name: "field",
        required: true,
        value: "on",
      });

      element.indeterminate = true;
      expect(element.getAttribute("aria-checked")).toBe("mixed");
      expect(element.getAttribute("data-state")).toBe("indeterminate");
      element.click();

      expect(element.indeterminate).toBe(false);
      expect(element.checked).toBe(true);
      expect(element.getAttribute("aria-checked")).toBe("true");

      let clickCount = 0;
      element.disabled = true;
      element.addEventListener("click", () => {
        clickCount += 1;
      });
      element.click();

      expect(element.checked).toBe(true);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("-1");
      }
      expect(clickCount).toBe(0);

      element.removeAttribute("name");
      expect(element.querySelector("input[data-ariaui-web-hidden-input='true']")).toBeNull();
    }
  });

  it("implements expandable and selectable role reflection from the generated spec", () => {
    defineComboboxElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const role = part.defaultRole as string | null;

      if (role && expandableRoles.has(role)) {
        expect(element.getAttribute("aria-expanded")).toBe("false");
        element.open = true;
        expect(element.getAttribute("aria-expanded")).toBe("true");
        element.open = false;
        expect(element.getAttribute("aria-expanded")).toBe("false");
      }

      if (role && selectableRoles.has(role)) {
        expect(element.getAttribute("aria-selected")).toBe("false");
        element.selected = true;
        expect(element.getAttribute("aria-selected")).toBe("true");
        expect(element.getAttribute("data-state")).toBe("checked");
      }
    }
  });

  it("implements keyboard activation and disabled guards for button-like roles", () => {
    defineComboboxElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role) && part.name !== "Button") {
        expect(element.getAttribute("tabindex")).toBe("0");
      }

      if (role === "button" && part.name !== "Button") {
        element.pressed = true;
        element.click();
        expect(element.pressed).toBe(false);
      }

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

      element.disabled = true;
      const disabledKeyDown = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
      element.dispatchEvent(disabledKeyDown);
      element.click();

      expect(disabledKeyDown.defaultPrevented).toBe(true);
      expect(element.getAttribute("aria-disabled")).toBe("true");
      expect(element.getAttribute("data-disabled")).toBe("");
      expect(clickCount).toBe(2);
    }
  });




});
