import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createDropdownMenuElement, defineDropdownMenuElements, getPartSpec, type ComponentPartName } from "../src";

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
const expandableRoles = new Set(["button", "combobox"]);
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

describe("@ariaui-web/dropdown-menu", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/dropdown-menu");
    expect(componentSpec.slug).toBe("dropdown-menu");
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

      const element = createDropdownMenuElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/dropdown-menu part");
  });

  it("defines all custom elements idempotently", () => {
    defineDropdownMenuElements();
    defineDropdownMenuElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineDropdownMenuElements();
    const element = createDropdownMenuElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("dropdown-menu");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineDropdownMenuElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("dropdown-menu");
      expect(element.getAttribute("data-package")).toBe("dropdown-menu");
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
    defineDropdownMenuElements();
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
    defineDropdownMenuElements();

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
    defineDropdownMenuElements();

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
    defineDropdownMenuElements();

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





  it("matches the source package dropdown menu part inventory and static semantics", () => {
    defineDropdownMenuElements();

    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Trigger",
      "Content",
      "Item",
      "CheckboxItem",
      "RadioGroup",
      "RadioItem",
      "Sub",
      "SubTrigger",
      "SubContent",
      "Group",
      "Label",
      "Separator",
    ]);

    const root = appendPart("aria-dropdown-menu");
    const trigger = appendPart("aria-dropdown-menu-trigger");
    const content = appendPart("aria-dropdown-menu-content");
    const item = appendPart("aria-dropdown-menu-item");
    const checkboxItem = appendPart("aria-dropdown-menu-checkbox-item");
    const radioGroup = appendPart("aria-dropdown-menu-radio-group");
    const radioItem = appendPart("aria-dropdown-menu-radio-item");
    const sub = appendPart("aria-dropdown-menu-sub");
    const subTrigger = appendPart("aria-dropdown-menu-sub-trigger");
    const subContent = appendPart("aria-dropdown-menu-sub-content");
    const group = appendPart("aria-dropdown-menu-group");
    const label = appendPart("aria-dropdown-menu-label");
    const separator = appendPart("aria-dropdown-menu-separator");

    expect(root.hasAttribute("role")).toBe(false);
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(content.getAttribute("role")).toBe("menu");
    expect(content.getAttribute("tabindex")).toBe("-1");
    expect(content.hasAttribute("data-dropdown-menu-content")).toBe(true);
    expect(item.getAttribute("role")).toBe("menuitem");
    expect(item.getAttribute("tabindex")).toBe("-1");
    expect(item.hasAttribute("aria-haspopup")).toBe(false);
    expect(item.hasAttribute("aria-expanded")).toBe(false);
    expect(checkboxItem.getAttribute("role")).toBe("menuitemcheckbox");
    expect(checkboxItem.getAttribute("aria-checked")).toBe("false");
    expect(checkboxItem.getAttribute("data-state")).toBe("unchecked");
    expect(radioGroup.getAttribute("role")).toBe("group");
    expect(radioItem.getAttribute("role")).toBe("menuitemradio");
    expect(radioItem.getAttribute("aria-checked")).toBe("false");
    expect(sub.hasAttribute("role")).toBe(false);
    expect(subTrigger.getAttribute("role")).toBe("menuitem");
    expect(subTrigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(subTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(subContent.getAttribute("role")).toBe("menu");
    expect(subContent.getAttribute("tabindex")).toBe("-1");
    expect(subContent.hasAttribute("data-dropdown-menu-content")).toBe(true);
    expect(group.getAttribute("role")).toBe("group");
    expect(label.hasAttribute("role")).toBe(false);
    expect(separator.getAttribute("role")).toBe("separator");
  });

  it("syncs trigger, content, and active-descendant menu navigation", () => {
    defineDropdownMenuElements();

    const root = document.createElement("aria-dropdown-menu") as RuntimeElement;
    const trigger = document.createElement("aria-dropdown-menu-trigger") as RuntimeElement;
    const content = document.createElement("aria-dropdown-menu-content") as RuntimeElement;
    const apple = document.createElement("aria-dropdown-menu-item") as RuntimeElement;
    const banana = document.createElement("aria-dropdown-menu-item") as RuntimeElement;
    const orange = document.createElement("aria-dropdown-menu-item") as RuntimeElement;

    trigger.textContent = "Open Menu";
    apple.value = "apple";
    apple.textContent = "Apple";
    banana.value = "banana";
    banana.textContent = "Banana";
    orange.value = "orange";
    orange.textContent = "Orange";
    content.append(apple, banana, orange);
    root.append(trigger, content);
    document.body.append(root);

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(content.hidden).toBe(true);

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));

    expect(root.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
    expect(content.hidden).toBe(false);
    expect(document.activeElement).toBe(content);
    expect(content.getAttribute("aria-activedescendant")).toBe(apple.id);
    expect(apple.getAttribute("tabindex")).toBe("0");
    expect(banana.getAttribute("tabindex")).toBe("-1");

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(banana.id);
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(orange.id);
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(apple.id);
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "o", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(orange.id);

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));

    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("supports submenu, checkbox, radio, and disabled item source semantics", () => {
    defineDropdownMenuElements();

    const root = document.createElement("aria-dropdown-menu") as RuntimeElement;
    const trigger = document.createElement("aria-dropdown-menu-trigger") as RuntimeElement;
    const content = document.createElement("aria-dropdown-menu-content") as RuntimeElement;
    const checkbox = document.createElement("aria-dropdown-menu-checkbox-item") as RuntimeElement;
    const radioGroup = document.createElement("aria-dropdown-menu-radio-group") as RuntimeElement;
    const top = document.createElement("aria-dropdown-menu-radio-item") as RuntimeElement;
    const bottom = document.createElement("aria-dropdown-menu-radio-item") as RuntimeElement;
    const disabled = document.createElement("aria-dropdown-menu-item") as RuntimeElement;
    const siblingItem = document.createElement("aria-dropdown-menu-item") as RuntimeElement;
    const sub = document.createElement("aria-dropdown-menu-sub") as RuntimeElement;
    const subTrigger = document.createElement("aria-dropdown-menu-sub-trigger") as RuntimeElement;
    const subContent = document.createElement("aria-dropdown-menu-sub-content") as RuntimeElement;
    const email = document.createElement("aria-dropdown-menu-item") as RuntimeElement;

    trigger.textContent = "Open Menu";
    checkbox.textContent = "Status Bar";
    top.value = "top";
    top.textContent = "Top";
    bottom.value = "bottom";
    bottom.textContent = "Bottom";
    bottom.checked = true;
    disabled.textContent = "Disabled";
    disabled.disabled = true;
    siblingItem.textContent = "Sibling Item";
    subTrigger.textContent = "Invite users";
    email.textContent = "Email";
    subContent.append(email);
    sub.append(subTrigger, subContent);
    radioGroup.append(top, bottom);
    content.append(checkbox, radioGroup, disabled, sub, siblingItem);
    root.append(trigger, content);
    document.body.append(root);

    trigger.click();

    expect(content.hidden).toBe(false);
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
    expect(bottom.getAttribute("aria-checked")).toBe("true");
    expect(disabled.getAttribute("data-disabled")).toBe("");
    expect(subTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(subContent.hidden).toBe(true);

    checkbox.click();
    expect(checkbox.checked).toBe(true);
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(content.hidden).toBe(true);

    trigger.click();
    top.click();
    expect(top.getAttribute("aria-checked")).toBe("true");
    expect(bottom.getAttribute("aria-checked")).toBe("false");

    trigger.click();
    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));

    expect(sub.open).toBe(true);
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(subTrigger.getAttribute("aria-controls")).toBe(subContent.id);
    expect(subContent.hidden).toBe(false);
    expect(subContent.getAttribute("aria-labelledby")).toBe(subTrigger.id);
    expect(subContent.getAttribute("aria-activedescendant")).toBe(email.id);
    expect(document.activeElement).toBe(subContent);
    expect(email.getAttribute("tabindex")).toBe("0");

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);
    expect(document.activeElement).toBe(subTrigger);

    subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(subTrigger.id);
    expect(document.activeElement).toBe(content);
    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);
    content.focus();
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement).toBe(subContent);
    expect(subContent.getAttribute("aria-activedescendant")).toBe(email.id);

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);

    subTrigger.dispatchEvent(new MouseEvent("click", { detail: 1, bubbles: true, cancelable: true }));
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(sub.open).toBe(true);
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement).toBe(subTrigger);

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);

    subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    expect(root.open).toBe(true);
    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(content.getAttribute("aria-activedescendant")).toBe(subTrigger.id);
    expect(subContent.hasAttribute("aria-activedescendant")).toBe(false);
    expect(email.getAttribute("data-active")).toBe("false");
    expect(email.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(content);

    siblingItem.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);
    expect(content.getAttribute("aria-activedescendant")).toBe(siblingItem.id);
    expect(document.activeElement).toBe(content);

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement).toBe(subContent);
    expect(subContent.getAttribute("aria-activedescendant")).toBe(email.id);

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement).toBe(subContent);

    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);

    subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    subTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(subTrigger.id);
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement).toBe(subContent);

    const outsideButton = document.createElement("button");
    outsideButton.textContent = "Outside";
    document.body.append(outsideButton);
    outsideButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);
  });

});
