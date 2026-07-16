import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createProgressElement, defineProgressElements, getPartSpec, type ComponentPartName } from "../src";
import { syncProgressPart } from "../src/progress-sync";

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

type ProgressRuntimeElement = RuntimeElement & {
  defaultValue: string;
  max: number;
  min: number;
  valueText: string;
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

  if (tagName === "aria-progress-indicator") {
    const root = document.createElement("aria-progress");
    root.append(element);
    document.body.append(root);
  } else {
    document.body.append(element);
  }

  return element;
}

function createProgressFixture(attributes: Record<string, string> = {}) {
  defineProgressElements();
  const root = document.createElement("aria-progress") as ProgressRuntimeElement;
  const indicator = document.createElement("aria-progress-indicator") as RuntimeElement;

  for (const [attribute, value] of Object.entries(attributes)) {
    root.setAttribute(attribute, value);
  }

  root.append(indicator);
  document.body.append(root);

  return { indicator, root };
}

describe("@ariaui-web/progress", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/progress");
    expect(componentSpec.slug).toBe("progress");
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

      const element = createProgressElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/progress part");
  });

  it("defines all custom elements idempotently", () => {
    defineProgressElements();
    defineProgressElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineProgressElements();
    const element = createProgressElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("progress");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("reflects source default progress range state", () => {
    const { root } = createProgressFixture({ "aria-label": "Loading" });

    expect(root.getAttribute("role")).toBe("progressbar");
    expect(root.getAttribute("aria-label")).toBe("Loading");
    expect(root.getAttribute("aria-valuemin")).toBe("0");
    expect(root.getAttribute("aria-valuemax")).toBe("100");
    expect(root.getAttribute("aria-valuenow")).toBe("0");
    expect(root.getAttribute("data-min")).toBe("0");
    expect(root.getAttribute("data-max")).toBe("100");
    expect(root.getAttribute("data-value")).toBe("0");
    expect(root.hasAttribute("tabindex")).toBe(false);
  });

  it("uses default-value once for uncontrolled state", () => {
    const { root } = createProgressFixture({ "default-value": "35" });

    expect(root.getAttribute("aria-valuenow")).toBe("35");
    expect(root.getAttribute("data-value")).toBe("35");

    root.setAttribute("default-value", "80");

    expect(root.getAttribute("aria-valuenow")).toBe("35");
    expect(root.getAttribute("data-value")).toBe("35");
  });

  it("updates from value and retains the last value when control is removed", () => {
    const { root } = createProgressFixture({ "default-value": "10", value: "20" });

    expect(root.getAttribute("aria-valuenow")).toBe("20");
    expect(root.getAttribute("data-value")).toBe("20");

    root.value = "70";

    expect(root.getAttribute("aria-valuenow")).toBe("70");
    expect(root.getAttribute("data-value")).toBe("70");

    root.removeAttribute("value");
    root.setAttribute("default-value", "90");

    expect(root.getAttribute("aria-valuenow")).toBe("70");
    expect(root.getAttribute("data-value")).toBe("70");
  });

  it("preserves an uncontrolled default value when the same Root reconnects", () => {
    const { indicator, root } = createProgressFixture({ "default-value": "25" });

    root.remove();
    root.setAttribute("default-value", "80");
    document.body.append(root);

    expect(root.getAttribute("aria-valuenow")).toBe("25");
    expect(root.getAttribute("data-value")).toBe("25");
    expect(indicator.getAttribute("data-value")).toBe("25");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("25%");
  });

  it("preserves the last controlled value when the same Root reconnects", () => {
    const { indicator, root } = createProgressFixture({ "default-value": "10", value: "20" });

    root.value = "70";
    root.removeAttribute("value");
    root.remove();
    root.setAttribute("default-value", "90");
    document.body.append(root);

    expect(root.getAttribute("aria-valuenow")).toBe("70");
    expect(root.getAttribute("data-value")).toBe("70");
    expect(indicator.getAttribute("data-value")).toBe("70");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("70%");
  });

  it("reflects a finite custom progress range and property updates", () => {
    const { root } = createProgressFixture({ min: "-10.5", max: "90.25", value: "40.75" });

    expect(root.min).toBe(-10.5);
    expect(root.max).toBe(90.25);
    expect(root.getAttribute("aria-valuemin")).toBe("-10.5");
    expect(root.getAttribute("aria-valuemax")).toBe("90.25");
    expect(root.getAttribute("aria-valuenow")).toBe("40.75");
    expect(root.getAttribute("data-min")).toBe("-10.5");
    expect(root.getAttribute("data-max")).toBe("90.25");
    expect(root.getAttribute("data-value")).toBe("40.75");

    root.min = 5.5;
    root.max = 125.25;
    root.value = "75.125";

    expect(root.getAttribute("min")).toBe("5.5");
    expect(root.getAttribute("max")).toBe("125.25");
    expect(root.getAttribute("value")).toBe("75.125");
    expect(root.getAttribute("aria-valuemin")).toBe("5.5");
    expect(root.getAttribute("aria-valuemax")).toBe("125.25");
    expect(root.getAttribute("aria-valuenow")).toBe("75.125");
    expect(root.getAttribute("data-min")).toBe("5.5");
    expect(root.getAttribute("data-max")).toBe("125.25");
    expect(root.getAttribute("data-value")).toBe("75.125");
  });

  it("uses progress fallbacks for blank and invalid range values", () => {
    const { root } = createProgressFixture({ min: "", max: " ", value: "" });

    expect(root.min).toBe(0);
    expect(root.max).toBe(100);
    expect(root.getAttribute("aria-valuemin")).toBe("0");
    expect(root.getAttribute("aria-valuemax")).toBe("100");
    expect(root.getAttribute("aria-valuenow")).toBe("0");
    expect(root.getAttribute("data-min")).toBe("0");
    expect(root.getAttribute("data-max")).toBe("100");
    expect(root.getAttribute("data-value")).toBe("0");

    root.setAttribute("min", "invalid");
    root.setAttribute("max", "Infinity");
    root.value = "NaN";

    expect(root.min).toBe(0);
    expect(root.max).toBe(100);
    expect(root.getAttribute("aria-valuemin")).toBe("0");
    expect(root.getAttribute("aria-valuemax")).toBe("100");
    expect(root.getAttribute("aria-valuenow")).toBe("0");
    expect(root.getAttribute("data-min")).toBe("0");
    expect(root.getAttribute("data-max")).toBe("100");
    expect(root.getAttribute("data-value")).toBe("0");
  });

  it("inherits Root data and computes the source custom-range percentage", () => {
    const { indicator } = createProgressFixture({ min: "200", max: "800", value: "500" });

    expect(indicator.getAttribute("data-min")).toBe("200");
    expect(indicator.getAttribute("data-max")).toBe("800");
    expect(indicator.getAttribute("data-value")).toBe("500");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("50%");
    expect(indicator.style.width).toBe("var(--progress-value)");
    expect(indicator.hasAttribute("role")).toBe(false);
  });

  it.each([
    { max: "100", min: "0", percentage: "0%", value: "0" },
    { max: "100", min: "0", percentage: "75%", value: "75" },
    { max: "100", min: "0", percentage: "100%", value: "100" },
    { max: "100", min: "0", percentage: "-25%", value: "-25" },
    { max: "100", min: "0", percentage: "125%", value: "125" },
    { max: "50", min: "50", percentage: "NaN%", value: "50" },
    { max: "50", min: "50", percentage: "Infinity%", value: "60" },
  ])("computes $percentage for value $value in range $min to $max", ({ max, min, percentage, value }) => {
    const { indicator } = createProgressFixture({ max, min, value });

    expect(indicator.style.getPropertyValue("--progress-value")).toBe(percentage);
    expect(indicator.style.width).toBe("var(--progress-value)");
  });

  it("resynchronizes Indicator after controlled-style value changes", () => {
    const { indicator, root } = createProgressFixture({ value: "20" });

    root.value = "70";

    expect(root.getAttribute("aria-valuenow")).toBe("70");
    expect(indicator.getAttribute("data-value")).toBe("70");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("70%");
  });

  it("preserves authored Indicator styles while owning progress width", () => {
    defineProgressElements();
    const root = document.createElement("aria-progress") as ProgressRuntimeElement;
    const indicator = document.createElement("aria-progress-indicator") as RuntimeElement;
    indicator.className = "indicator-class";
    indicator.style.height = ".5rem";
    indicator.style.width = "1rem";
    root.value = "40";
    root.append(indicator);
    document.body.append(root);

    expect(indicator.className).toBe("indicator-class");
    expect(indicator.style.height).toBe("0.5rem");
    expect(indicator.style.width).toBe("var(--progress-value)");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("40%");
  });

  it("isolates nested Progress Roots to their nearest Indicator context", () => {
    defineProgressElements();
    const outerRoot = document.createElement("aria-progress") as ProgressRuntimeElement;
    const outerIndicator = document.createElement("aria-progress-indicator") as RuntimeElement;
    const innerRoot = document.createElement("aria-progress") as ProgressRuntimeElement;
    const innerIndicator = document.createElement("aria-progress-indicator") as RuntimeElement;
    outerRoot.value = "20";
    innerRoot.value = "80";
    innerRoot.append(innerIndicator);
    outerRoot.append(outerIndicator, innerRoot);
    document.body.append(outerRoot);

    expect(outerIndicator.getAttribute("data-value")).toBe("20");
    expect(outerIndicator.style.getPropertyValue("--progress-value")).toBe("20%");
    expect(innerIndicator.getAttribute("data-value")).toBe("80");
    expect(innerIndicator.style.getPropertyValue("--progress-value")).toBe("80%");

    outerRoot.value = "70";

    expect(outerIndicator.getAttribute("data-value")).toBe("70");
    expect(outerIndicator.style.getPropertyValue("--progress-value")).toBe("70%");
    expect(innerIndicator.getAttribute("data-value")).toBe("80");
    expect(innerIndicator.style.getPropertyValue("--progress-value")).toBe("80%");

    innerRoot.value = "40";

    expect(innerIndicator.getAttribute("data-value")).toBe("40");
    expect(innerIndicator.style.getPropertyValue("--progress-value")).toBe("40%");
    expect(outerIndicator.getAttribute("data-value")).toBe("70");
    expect(outerIndicator.style.getPropertyValue("--progress-value")).toBe("70%");
  });

  it("keeps a reparented Indicator synchronized with its new connected Root", async () => {
    defineProgressElements();
    const firstRoot = document.createElement("aria-progress") as ProgressRuntimeElement;
    const secondRoot = document.createElement("aria-progress") as ProgressRuntimeElement;
    const indicator = document.createElement("aria-progress-indicator") as RuntimeElement;
    firstRoot.value = "20";
    secondRoot.value = "80";
    firstRoot.append(indicator);
    document.body.append(firstRoot, secondRoot);

    expect(indicator.getAttribute("data-value")).toBe("20");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("20%");

    secondRoot.append(indicator);

    expect(indicator.getAttribute("data-min")).toBe("0");
    expect(indicator.getAttribute("data-max")).toBe("100");
    expect(indicator.getAttribute("data-value")).toBe("80");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("80%");
    expect(indicator.style.width).toBe("var(--progress-value)");

    await Promise.resolve();

    expect(indicator.getAttribute("data-min")).toBe("0");
    expect(indicator.getAttribute("data-max")).toBe("100");
    expect(indicator.getAttribute("data-value")).toBe("80");
    expect(indicator.style.getPropertyValue("--progress-value")).toBe("80%");
    expect(indicator.style.width).toBe("var(--progress-value)");
  });

  it("throws the source-equivalent error for an orphan Indicator sync", () => {
    defineProgressElements();
    const indicator = document.createElement("aria-progress-indicator");

    expect(() => syncProgressPart(indicator)).toThrowError("Progress parts must be used within Progress.Root");
  });

  it("maps value-text to optional aria-valuetext", () => {
    const { root } = createProgressFixture({ value: "50", "value-text": "50% complete" });

    expect(root.getAttribute("aria-valuetext")).toBe("50% complete");

    root.valueText = "Step 3 of 5";

    expect(root.getAttribute("aria-valuetext")).toBe("Step 3 of 5");

    root.valueText = null as unknown as string;

    expect(root.hasAttribute("aria-valuetext")).toBe(false);
  });

  it("connects every custom element to its spec part metadata", () => {
    defineProgressElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("progress");
      expect(element.getAttribute("data-package")).toBe("progress");
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
      if (part.name === "Indicator") {
        const root = document.createElement("aria-progress");
        root.append(roleOverride);
        document.body.append(root);
      } else {
        document.body.append(roleOverride);
      }
      expect(roleOverride.getAttribute("role")).toBe("presentation");
    }
  });

  it("reflects shared state attributes required by the generated spec", () => {
    defineProgressElements();
    const element = appendPart(componentSpec.parts[0]!.tagName);
    const rootPart = componentSpec.parts[0] as RuntimePartSpec;

    element.setAttribute("orientation", "vertical");
    element.value = "alpha";
    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.disabled = true;

    expect(element.getAttribute("data-orientation")).toBe("vertical");
    expect(element.getAttribute("data-value")).toBe("0");
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
    expect(element.getAttribute("data-value")).toBe("0");
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    defineProgressElements();

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
    defineProgressElements();

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
    defineProgressElements();

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




});
