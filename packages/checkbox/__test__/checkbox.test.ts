import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createCheckboxElement, defineCheckboxElements, getPartSpec, type ComponentPartName } from "../src";

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
  const attributePattern = /\b(?:aria|data)-[a-z0-9-]+\b|\bnative-composition\b|\bdefault-open\b|\bdismissible\b|\btabIndex\b|\btabindex\b|\brole\b|\bid\b|\bdir\b|\borientation\b|\bdisabled\b|\brequired\b|\bvalue\b|\bopen\b|\bchecked\b|\bselected\b|\bpressed\b/g;

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

function createCheckboxFixture({
  checked = false,
  defaultChecked = false,
  disabled = false,
  indeterminate = false,
  name,
  value,
  required = false,
  forceMountIndicator = false,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  forceMountIndicator?: boolean;
} = {}) {
  defineCheckboxElements();

  const root = document.createElement("aria-checkbox") as RuntimeElement;
  const indicator = document.createElement("aria-checkbox-indicator") as RuntimeElement;

  root.id = "checkbox-root";
  root.setAttribute("aria-label", "Accept terms");
  if (checked) root.checked = true;
  if (defaultChecked) root.defaultChecked = true;
  if (disabled) root.disabled = true;
  if (indeterminate) root.indeterminate = true;
  if (name) root.setAttribute("name", name);
  if (value) root.value = value;
  if (required) root.setAttribute("required", "");
  if (forceMountIndicator) indicator.setAttribute("force-mount", "");
  indicator.textContent = "check";
  root.append(indicator);
  document.body.append(root);

  return { root, indicator };
}

function createCheckboxGroupFixture({
  value,
  defaultValue,
  disabled = false,
  name,
  required = false,
  includeValueless = false,
}: {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  includeValueless?: boolean;
} = {}) {
  defineCheckboxElements();

  const group = document.createElement("aria-checkbox-group") as RuntimeElement;
  const items = ["a", "b", "c"].map((itemValue) => {
    const item = document.createElement("aria-checkbox-item") as RuntimeElement;
    const indicator = document.createElement("aria-checkbox-indicator") as RuntimeElement;

    item.id = "checkbox-" + itemValue;
    item.value = itemValue;
    item.setAttribute("aria-label", itemValue.toUpperCase());
    indicator.textContent = "check";
    item.append(indicator);
    return item;
  });

  if (value !== undefined) group.value = value;
  if (defaultValue !== undefined) group.setAttribute("default-value", defaultValue);
  if (disabled) group.disabled = true;
  if (name) group.setAttribute("name", name);
  if (required) group.setAttribute("required", "");

  group.append(...items);

  if (includeValueless) {
    const item = document.createElement("aria-checkbox-item") as RuntimeElement;
    item.setAttribute("aria-label", "No value");
    group.append(item);
    items.push(item);
  }

  document.body.append(group);

  return { group, items };
}


describe("@ariaui-web/checkbox", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/checkbox");
    expect(componentSpec.slug).toBe("checkbox");
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

      if (documentedAttributes.includes("aria-expanded") && part.defaultRole && expandableRoles.has(part.defaultRole)) {
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

      const element = createCheckboxElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/checkbox part");
  });

  it("defines all custom elements idempotently", () => {
    defineCheckboxElements();
    defineCheckboxElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineCheckboxElements();
    const element = createCheckboxElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("checkbox");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineCheckboxElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("checkbox");
      expect(element.getAttribute("data-package")).toBe("checkbox");
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
    defineCheckboxElements();
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
    expect(element.getAttribute("data-state")).toBe("unchecked");
    expect(element.hasAttribute("aria-expanded")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-selected")).toBe(false);
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
    defineCheckboxElements();

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
      if (focusableRoles.has(role)) {
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
    defineCheckboxElements();

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
    defineCheckboxElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }

      if (role === "button") {
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



  it("matches checkbox source part inventory and default semantics", () => {
    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Group",
      "Indicator",
      "Item",
    ]);
    expect(getPartSpec("Root").defaultRole).toBe("checkbox");
    expect(getPartSpec("Group").defaultRole).toBe("group");
    expect(getPartSpec("Indicator").defaultRole).toBe("presentation");
    expect(getPartSpec("Item").defaultRole).toBe("checkbox");
  });

  it("dispatches source-equivalent checkedchange events and keeps indicator state in sync", () => {
    const { root, indicator } = createCheckboxFixture({ name: "terms", required: true });
    const checkedChanges: boolean[] = [];

    root.addEventListener("checkedchange", (event) => {
      checkedChanges.push((event as CustomEvent<{ checked: boolean }>).detail.checked);
    });

    expect(root.getAttribute("aria-checked")).toBe("false");
    expect(root.getAttribute("data-state")).toBe("unchecked");
    expect(indicator.hidden).toBe(true);
    expect(indicator.getAttribute("data-state")).toBe("unchecked");
    expect(root.querySelector<HTMLInputElement>("input[data-ariaui-web-hidden-input='true']")?.value).toBe("false");

    root.click();

    expect(checkedChanges).toEqual([true]);
    expect(root.checked).toBe(true);
    expect(root.getAttribute("aria-checked")).toBe("true");
    expect(root.getAttribute("data-state")).toBe("checked");
    expect(indicator.hidden).toBe(false);
    expect(indicator.getAttribute("data-state")).toBe("checked");
    expect(root.querySelector<HTMLInputElement>("input[data-ariaui-web-hidden-input='true']")?.value).toBe("true");

    root.indeterminate = true;
    expect(root.getAttribute("aria-checked")).toBe("mixed");
    expect(root.getAttribute("data-state")).toBe("indeterminate");
    expect(indicator.hidden).toBe(false);
    expect(indicator.getAttribute("data-state")).toBe("indeterminate");

    root.click();

    expect(checkedChanges).toEqual([true]);
    expect(root.indeterminate).toBe(false);
    expect(root.checked).toBe(true);
    expect(root.getAttribute("aria-checked")).toBe("true");
  });

  it("supports force-mounted indicators while keeping unchecked state metadata", () => {
    const { indicator } = createCheckboxFixture({ forceMountIndicator: true });

    expect(indicator.hidden).toBe(false);
    expect(indicator.getAttribute("data-state")).toBe("unchecked");
  });

  it("owns source-equivalent checkbox group value state and valuechange events", () => {
    const { group, items } = createCheckboxGroupFixture({ defaultValue: "b" });
    const valueChanges: string[][] = [];

    group.addEventListener("valuechange", (event) => {
      valueChanges.push((event as CustomEvent<{ values: string[] }>).detail.values);
    });

    expect(group.getAttribute("role")).toBe("group");
    expect(group.value).toBe("b");
    expect(items[0]?.getAttribute("aria-checked")).toBe("false");
    expect(items[1]?.getAttribute("aria-checked")).toBe("true");

    items[0]?.click();

    expect(group.value).toBe("b,a");
    expect(valueChanges).toEqual([["b", "a"]]);
    expect(items[0]?.getAttribute("aria-checked")).toBe("true");

    items[1]?.click();

    expect(group.value).toBe("a");
    expect(valueChanges).toEqual([["b", "a"], ["a"]]);
    expect(items[1]?.getAttribute("aria-checked")).toBe("false");
  });

  it("propagates group disabled, name, and required state to child items", () => {
    const { group, items } = createCheckboxGroupFixture({ disabled: true, name: "interests", required: true, value: "a,b" });

    for (const item of items) {
      expect(item.getAttribute("aria-disabled")).toBe("true");
      expect(item.getAttribute("data-disabled")).toBe("");
      expect(item.getAttribute("tabindex")).toBe("-1");
      const input = item.querySelector<HTMLInputElement>("input[data-ariaui-web-hidden-input='true']");
      expect(input?.name).toBe("interests");
      expect(input?.required).toBe(true);
      expect(input?.value).toBe(item.value);
    }

    const changes: string[][] = [];
    group.addEventListener("valuechange", (event) => {
      changes.push((event as CustomEvent<{ values: string[] }>).detail.values);
    });
    items[2]?.click();

    expect(group.value).toBe("a,b");
    expect(changes).toEqual([]);
  });

  it("lets item disabled and item name override group-level behavior", () => {
    const { group, items } = createCheckboxGroupFixture({ name: "group-name" });
    const changes: string[][] = [];

    items[0]!.disabled = true;
    items[1]!.setAttribute("name", "item-name");
    group.addEventListener("valuechange", (event) => {
      changes.push((event as CustomEvent<{ values: string[] }>).detail.values);
    });

    items[0]?.click();
    items[1]?.click();

    expect(changes).toEqual([["b"]]);
    expect(group.value).toBe("b");
    expect(items[1]?.querySelector<HTMLInputElement>("input[data-ariaui-web-hidden-input='true']")?.name).toBe("item-name");
  });

  it("keeps valueless items inside groups as standalone checkboxes", () => {
    const { group, items } = createCheckboxGroupFixture({ value: "a", includeValueless: true });
    const valuelessItem = items[3]!;

    valuelessItem.click();

    expect(group.value).toBe("a");
    expect(valuelessItem.checked).toBe(true);
    expect(valuelessItem.getAttribute("aria-checked")).toBe("true");
  });

  it("activates checkbox custom elements from associated labels like the source button host", () => {
    const { root } = createCheckboxFixture();
    const label = document.createElement("label");
    label.htmlFor = root.id;
    label.textContent = "Accept terms";
    document.body.append(label);

    label.click();

    expect(root.checked).toBe(true);
  });



});
