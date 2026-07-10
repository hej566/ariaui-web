import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createInputOtpElement, defineInputOtpElements, getPartSpec, type ComponentPartName } from "../src";

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

describe("@ariaui-web/input-otp", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/input-otp");
    expect(componentSpec.slug).toBe("input-otp");
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

      const element = createInputOtpElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/input-otp part");
  });

  it("defines all custom elements idempotently", () => {
    defineInputOtpElements();
    defineInputOtpElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineInputOtpElements();
    const element = createInputOtpElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("input-otp");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineInputOtpElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("input-otp");
      expect(element.getAttribute("data-package")).toBe("input-otp");
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
    defineInputOtpElements();
    const element = appendPart(componentSpec.parts[0]!.tagName);
    const rootPart = componentSpec.parts[0] as RuntimePartSpec;

    element.setAttribute("orientation", "vertical");
    element.value = "alpha";
    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.disabled = true;

    expect(element.getAttribute("data-orientation")).toBe("vertical");
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("data-state")).toBe(false);
    expect(element.hasAttribute("aria-expanded")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-selected")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);

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
    defineInputOtpElements();

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
    defineInputOtpElements();

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
    defineInputOtpElements();

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



  function createInputOtpFixture({ maxLength = 3, defaultValue = "" } = {}) {
    defineInputOtpElements();
    const root = document.createElement("aria-input-otp") as RuntimeElement;
    root.setAttribute("max-length", String(maxLength));
    if (defaultValue) {
      root.setAttribute("default-value", defaultValue);
    }
    const slots = Array.from({ length: maxLength }, (_, index) => {
      const slot = document.createElement("aria-input-otp-slot") as RuntimeElement;
      slot.setAttribute("data-testid", "slot-" + index);
      root.append(slot);
      return slot;
    });
    document.body.append(root);
    const input = root.querySelector("input[data-ariaui-web-input-otp='true']") as HTMLInputElement;

    return { root, input, slots };
  }

  it("matches source Root hidden input ownership and default semantics", () => {
    const { root, input, slots } = createInputOtpFixture({ maxLength: 3 });

    expect(root.tagName.toLowerCase()).toBe("aria-input-otp");
    expect(root.style.position).toBe("relative");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("data-state")).toBe(false);
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.type).toBe("text");
    expect(input.inputMode).toBe("numeric");
    expect(input.pattern).toBe("[0-9]*");
    expect(input.autocomplete).toBe("one-time-code");
    expect(input.maxLength).toBe(3);
    expect(input.style.position).toBe("absolute");
    expect(input.style.inset).toBe("0px");
    expect(slots.map((slot) => slot.textContent)).toEqual(["", "", ""]);
  });

  it("clips typed values, mirrors visible slots, and emits valuechange and complete events", () => {
    const { root, input, slots } = createInputOtpFixture({ maxLength: 3 });
    const values: string[] = [];
    const completed: string[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ value: string }>).detail.value);
    });
    root.addEventListener("complete", (event) => {
      completed.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    input.value = "12345";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "5" }));

    expect(input.value).toBe("123");
    expect(root.value).toBe("123");
    expect(slots.map((slot) => slot.textContent)).toEqual(["1", "2", "3"]);
    expect(values).toEqual(["123"]);
    expect(completed).toEqual(["123"]);
  });

  it("supports default-value initialization and controlled-style value property updates", () => {
    const { root, input, slots } = createInputOtpFixture({ maxLength: 3, defaultValue: "12" });

    expect(input.value).toBe("12");
    expect(slots.map((slot) => slot.textContent)).toEqual(["1", "2", ""]);

    root.value = "789";

    expect(input.value).toBe("789");
    expect(slots.map((slot) => slot.textContent)).toEqual(["7", "8", "9"]);
  });

  it("preserves value property updates across later host attribute syncs", () => {
    defineInputOtpElements();
    const root = document.createElement("aria-input-otp") as RuntimeElement;
    root.setAttribute("max-length", "3");
    root.setAttribute("value", "123");
    const slots = Array.from({ length: 3 }, () => {
      const slot = document.createElement("aria-input-otp-slot") as RuntimeElement;
      root.append(slot);
      return slot;
    });
    document.body.append(root);
    const input = root.querySelector("input[data-ariaui-web-input-otp='true']") as HTMLInputElement;

    expect(input.value).toBe("123");

    root.value = "45";
    root.setAttribute("aria-label", "Updated code");
    root.disabled = true;

    expect(input.value).toBe("45");
    expect(slots.map((slot) => slot.textContent)).toEqual(["4", "5", ""]);

    root.setAttribute("value", "789");

    expect(input.value).toBe("789");
    expect(slots.map((slot) => slot.textContent)).toEqual(["7", "8", "9"]);
  });

  it("focuses from root click, mirrors active slot state, and clears it on blur", () => {
    const { root, input, slots } = createInputOtpFixture({ maxLength: 3, defaultValue: "12" });

    root.click();

    expect(document.activeElement).toBe(input);
    expect(slots[2]!.getAttribute("data-active")).toBe("true");
    expect(slots[2]!.querySelector("[data-ariaui-web-input-otp-caret='true']")).toBeInstanceOf(HTMLElement);

    input.blur();

    expect(slots.some((slot) => slot.hasAttribute("data-active"))).toBe(false);
  });

  it("re-syncs active slot state when the hidden input is already focused", () => {
    const { root, input, slots } = createInputOtpFixture({ maxLength: 3 });

    input.focus();
    input.dispatchEvent(new FocusEvent("blur"));
    expect(document.activeElement).toBe(input);
    expect(slots.some((slot) => slot.hasAttribute("data-active"))).toBe(false);

    root.click();

    expect(document.activeElement).toBe(input);
    expect(slots[0]!.getAttribute("data-active")).toBe("true");
    expect(slots[0]!.querySelector("[data-ariaui-web-input-otp-caret='true']")).toBeInstanceOf(HTMLElement);
  });

  it("handles Backspace for previous filled slot and selected ranges", () => {
    const { input, slots } = createInputOtpFixture({ maxLength: 4, defaultValue: "1234" });
    input.focus();
    input.setSelectionRange(1, 3);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }));

    expect(input.value).toBe("14");
    expect(slots.map((slot) => slot.textContent)).toEqual(["1", "4", "", ""]);

    input.setSelectionRange(2, 2);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }));

    expect(input.value).toBe("1");
    expect(slots[1]!.getAttribute("data-active")).toBe("true");
    expect(slots[1]!.textContent).toBe("");
  });

  it("maps disabled and auto-focus to the hidden input", () => {
    defineInputOtpElements();
    const disabledRoot = document.createElement("aria-input-otp") as RuntimeElement;
    disabledRoot.setAttribute("max-length", "3");
    disabledRoot.disabled = true;
    const disabledSlot = document.createElement("aria-input-otp-slot");
    disabledRoot.append(disabledSlot);
    document.body.append(disabledRoot);
    const disabledInput = disabledRoot.querySelector("input[data-ariaui-web-input-otp='true']") as HTMLInputElement;
    const values: string[] = [];

    disabledRoot.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ value: string }>).detail.value);
    });
    disabledInput.value = "1";
    disabledInput.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "1" }));

    expect(disabledInput.disabled).toBe(true);
    expect(disabledInput.value).toBe("");
    expect(values).toEqual([]);
    expect(disabledRoot.hasAttribute("aria-disabled")).toBe(false);
    expect(disabledRoot.hasAttribute("data-disabled")).toBe(false);

    const autoFocusRoot = document.createElement("aria-input-otp") as RuntimeElement;
    autoFocusRoot.setAttribute("max-length", "1");
    autoFocusRoot.setAttribute("auto-focus", "");
    autoFocusRoot.append(document.createElement("aria-input-otp-slot"));
    document.body.append(autoFocusRoot);
    const autoFocusInput = autoFocusRoot.querySelector("input[data-ariaui-web-input-otp='true']") as HTMLInputElement;

    expect(document.activeElement).toBe(autoFocusInput);
  });

  it("supports explicit slot indexes, DOM-order auto indexes, and native-composition child hosts", () => {
    defineInputOtpElements();
    const root = document.createElement("aria-input-otp") as RuntimeElement;
    root.setAttribute("max-length", "3");
    root.setAttribute("default-value", "abc");
    const autoFirst = document.createElement("aria-input-otp-slot") as RuntimeElement;
    const explicit = document.createElement("aria-input-otp-slot") as RuntimeElement;
    const composed = document.createElement("aria-input-otp-slot") as RuntimeElement;
    const child = document.createElement("section");
    explicit.setAttribute("index", "2");
    composed.setAttribute("native-composition", "");
    composed.append(child);
    root.append(autoFirst, composed, explicit);
    document.body.append(root);

    expect(autoFirst.textContent).toBe("a");
    expect(explicit.textContent).toBe("c");
    expect(child.textContent).toBe("b");
    expect(child.getAttribute("data-slot-value")).toBe("b");
  });



});
