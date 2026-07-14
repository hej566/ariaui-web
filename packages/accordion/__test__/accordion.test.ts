import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createAccordionElement, defineAccordionElements, getPartSpec, type ComponentPartName } from "../src";

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
  for (const attribute of ["collapsible", "data-disabled", "data-state", "default-value", "force-mount", "type"]) {
    attributes.add(attribute);
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

describe("@ariaui-web/accordion", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/accordion");
    expect(componentSpec.slug).toBe("accordion");
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

      const element = createAccordionElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/accordion part");
  });

  it("defines all custom elements idempotently", () => {
    defineAccordionElements();
    defineAccordionElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineAccordionElements();
    const element = createAccordionElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("accordion");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineAccordionElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("accordion");
      expect(element.getAttribute("data-package")).toBe("accordion");
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
    defineAccordionElements();
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
    defineAccordionElements();

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
    defineAccordionElements();

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
    defineAccordionElements();

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


  function dispatchAccordionKey(element: Element, key: string) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event;
  }

  function dispatchAccordionSpace(element: Element) {
    const keydown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    element.dispatchEvent(keydown);
    element.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));
    return keydown;
  }

  function createAccordionFixture(options: {
    aliases?: boolean;
    collapsible?: boolean;
    defaultValue?: string;
    dir?: "ltr" | "rtl";
    disabled?: boolean;
    disabledValues?: readonly string[];
    forceMountValues?: readonly string[];
    nested?: boolean;
    orientation?: "horizontal" | "vertical";
    type?: "multiple" | "single";
    value?: string;
    values?: readonly string[];
  } = {}) {
    defineAccordionElements();
    const root = document.createElement("aria-accordion") as RuntimeElement;
    const values = options.values ?? ["alpha", "beta", "gamma", "delta"];
    const triggerTag = options.aliases ? "aria-accordion-button" : "aria-accordion-trigger";
    const contentTag = options.aliases ? "aria-accordion-panel" : "aria-accordion-content";
    const items: RuntimeElement[] = [];
    const headers: RuntimeElement[] = [];
    const triggers: RuntimeElement[] = [];
    const contents: RuntimeElement[] = [];
    const container = options.nested ? document.createElement("div") : root;

    if (options.type) {
      root.setAttribute("type", options.type);
    }

    if (options.defaultValue !== undefined) {
      root.setAttribute("default-value", options.defaultValue);
    }

    if (options.value !== undefined) {
      root.value = options.value;
    }

    if (options.collapsible) {
      root.setAttribute("collapsible", "true");
    }

    if (options.orientation) {
      root.setAttribute("orientation", options.orientation);
    }

    if (options.dir) {
      root.setAttribute("dir", options.dir);
    }

    if (options.disabled) {
      root.disabled = true;
    }

    if (options.nested) {
      root.append(container);
    }

    values.forEach((value) => {
      const item = document.createElement("aria-accordion-item") as RuntimeElement;
      const header = document.createElement("aria-accordion-header") as RuntimeElement;
      const trigger = document.createElement(triggerTag) as RuntimeElement;
      const content = document.createElement(contentTag) as RuntimeElement;

      item.value = value;
      trigger.textContent = "Heading-" + value;
      content.textContent = "Content-" + value;

      if (options.disabledValues?.includes(value)) {
        item.disabled = true;
      }

      if (options.forceMountValues?.includes(value)) {
        content.setAttribute("force-mount", "");
      }

      header.append(trigger);
      item.append(header, content);
      container.append(item);
      items.push(item);
      headers.push(header);
      triggers.push(trigger);
      contents.push(content);
    });

    document.body.append(root);
    return {
      root,
      items: items as unknown as RuntimeElementList,
      headers: headers as unknown as RuntimeElementList,
      triggers: triggers as unknown as RuntimeElementList,
      contents: contents as unknown as RuntimeElementList,
    };
  }

  it("toggles aria-controls targets for the docs accordion example", () => {
    defineAccordionElements();
    const trigger = document.createElement("aria-accordion-trigger") as RuntimeElement;
    const content = document.createElement("aria-accordion-content") as RuntimeElement;
    content.id = "accordion-accessible-panel";
    content.hidden = true;
    trigger.setAttribute("aria-controls", "accordion-accessible-panel");
    trigger.textContent = "Is it accessible?";
    content.textContent = "Yes. It adheres to the WAI-ARIA design pattern.";
    document.body.append(trigger, content);

    expect(trigger.open).toBe(false);
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    trigger.click();

    expect(trigger.open).toBe(true);
    expect(content.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("open");

    trigger.click();

    expect(trigger.open).toBe(false);
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("uses the accordion trigger state as the source of truth when toggling content", () => {
    defineAccordionElements();
    const trigger = document.createElement("aria-accordion-trigger") as RuntimeElement;
    const content = document.createElement("aria-accordion-content") as RuntimeElement;
    content.id = "accordion-trigger-owned-panel";
    trigger.setAttribute("aria-controls", "accordion-trigger-owned-panel");
    trigger.open = true;
    content.hidden = false;
    document.body.append(trigger, content);

    expect(trigger.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.hidden).toBe(false);

    trigger.click();

    expect(trigger.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("matches the accordion part, alias, and default semantics from the spec", () => {
    defineAccordionElements();
    const root = document.createElement("aria-accordion");
    const header = document.createElement("aria-accordion-header");
    const trigger = document.createElement("aria-accordion-trigger");
    const button = document.createElement("aria-accordion-button");
    const content = document.createElement("aria-accordion-content");
    const panel = document.createElement("aria-accordion-panel");
    document.body.append(root, header, trigger, button, content, panel);

    expect(root.getAttribute("orientation")).toBe("vertical");
    expect(root.getAttribute("data-orientation")).toBe("vertical");
    expect(root.getAttribute("dir")).toBe("ltr");
    expect(header.getAttribute("role")).toBe("heading");
    expect(header.getAttribute("aria-level")).toBe("3");
    expect(trigger.getAttribute("role")).toBe("button");
    expect(button.getAttribute("role")).toBe("button");
    expect(content.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("role")).toBe("region");
    expect(button.getAttribute("aria-expanded")).toBe(trigger.getAttribute("aria-expanded"));
    expect(button.getAttribute("part")).toBe("button");
    expect(panel.getAttribute("part")).toBe("panel");
    expect(panel.getAttribute("data-part")).toBe("Panel");
  });

  it("renders multiple uncontrolled accordions from default-value", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      disabledValues: ["delta"],
    });

    expect(root).toBeInstanceOf(HTMLElement);
    expect(triggers).toHaveLength(4);
    expect(contents).toHaveLength(4);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[2].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[3].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(false);
    expect(contents[2].hidden).toBe(true);
  });

  it("preserves APG trigger-to-panel ARIA linkage", () => {
    const { headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      disabledValues: ["delta"],
    });

    expect(headers[0].children).toHaveLength(1);
    expect(headers[0].firstElementChild).toBe(triggers[0]);
    expect(triggers[0].getAttribute("aria-controls")).toBe(contents[0].id);
    expect(triggers[1].getAttribute("aria-controls")).toBe(contents[1].id);
    expect(contents[0].getAttribute("aria-labelledby")).toBe(triggers[0].id);
    expect(contents[1].getAttribute("aria-labelledby")).toBe(triggers[1].id);
    expect(contents[0].getAttribute("role")).toBe("region");
  });

  it("implements single, collapsible single, and multiple accordion state models", () => {
    const single = createAccordionFixture({ type: "single", defaultValue: "alpha", values: ["alpha", "beta"] });
    const [singleAlpha, singleBeta] = single.triggers;

    expect(singleAlpha.open).toBe(true);
    expect(singleAlpha.getAttribute("aria-disabled")).toBe("true");
    singleAlpha.click();
    expect(singleAlpha.open).toBe(true);

    singleBeta.click();
    expect(singleAlpha.open).toBe(false);
    expect(singleBeta.open).toBe(true);
    expect(single.contents[0].hidden).toBe(true);
    expect(single.contents[1].hidden).toBe(false);

    document.body.replaceChildren();
    const collapsible = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      collapsible: true,
      values: ["alpha"],
    });
    collapsible.triggers[0].click();
    expect(collapsible.triggers[0].open).toBe(false);
    expect(collapsible.contents[0].hidden).toBe(true);

    document.body.replaceChildren();
    const multiple = createAccordionFixture({ type: "multiple", defaultValue: "alpha,beta", values: ["alpha", "beta", "gamma"] });
    multiple.triggers[2].click();
    expect(multiple.triggers[0].open).toBe(true);
    expect(multiple.triggers[1].open).toBe(true);
    expect(multiple.triggers[2].open).toBe(true);
  });

  it("dispatches native valuechange events for controlled-style single and multiple state", () => {
    const single = createAccordionFixture({ type: "single", value: "alpha", values: ["alpha", "beta"] });
    const singleValues: unknown[] = [];
    single.root.addEventListener("valuechange", (event) => {
      singleValues.push((event as CustomEvent).detail.value);
    });

    single.triggers[1].click();
    expect(singleValues).toEqual(["beta"]);
    expect(single.root.value).toBe("beta");

    document.body.replaceChildren();
    const collapsible = createAccordionFixture({
      type: "single",
      value: "alpha",
      collapsible: true,
      values: ["alpha"],
    });
    const collapsibleValues: unknown[] = [];
    collapsible.root.addEventListener("valuechange", (event) => {
      collapsibleValues.push((event as CustomEvent).detail.value);
    });
    collapsible.triggers[0].click();
    expect(collapsibleValues).toEqual([""]);
    expect(collapsible.root.value).toBe("");

    document.body.replaceChildren();
    const multiple = createAccordionFixture({ type: "multiple", value: "alpha", values: ["alpha", "beta"] });
    const multipleValues: unknown[] = [];
    multiple.root.addEventListener("valuechange", (event) => {
      multipleValues.push((event as CustomEvent).detail.value);
    });
    multiple.triggers[1].click();
    expect(multipleValues).toEqual([["alpha", "beta"]]);
    expect(multiple.root.value).toBe("alpha,beta");
  });

  it("keeps disabled accordion triggers inert", () => {
    const { items, headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      disabledValues: ["delta"],
    });
    const trigger = triggers[3];
    const content = contents[3];

    trigger.click();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    trigger.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));

    expect(items[3].getAttribute("aria-disabled")).toBe("true");
    expect(items[3].getAttribute("data-disabled")).toBe("");
    expect(headers[3].getAttribute("data-disabled")).toBe("");
    expect(trigger.disabled).toBe(true);
    expect(trigger.getAttribute("aria-disabled")).toBe("true");
    expect(trigger.getAttribute("data-disabled")).toBe("");
    expect(trigger.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(content.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("implements APG roving focus keys for vertical and horizontal accordions", () => {
    const vertical = createAccordionFixture({
      type: "multiple",
      disabledValues: ["delta"],
      values: ["alpha", "beta", "gamma", "delta"],
    });
    const [first, second, last] = vertical.triggers;

    first.focus();
    dispatchAccordionKey(first, "Enter");
    expect(first.open).toBe(true);
    dispatchAccordionSpace(first);
    expect(first.open).toBe(false);
    dispatchAccordionKey(first, "ArrowDown");
    expect(document.activeElement).toBe(second);
    dispatchAccordionKey(second, "ArrowDown");
    expect(document.activeElement).toBe(last);
    dispatchAccordionKey(last, "ArrowDown");
    expect(document.activeElement).toBe(first);
    dispatchAccordionKey(first, "ArrowUp");
    expect(document.activeElement).toBe(last);
    dispatchAccordionKey(first, "End");
    expect(document.activeElement).toBe(last);
    dispatchAccordionKey(last, "Home");
    expect(document.activeElement).toBe(first);

    document.body.replaceChildren();
    const horizontal = createAccordionFixture({
      type: "multiple",
      orientation: "horizontal",
      dir: "ltr",
      values: ["alpha", "beta", "gamma"],
    });
    horizontal.triggers[1].focus();
    dispatchAccordionKey(horizontal.triggers[1], "ArrowRight");
    expect(document.activeElement).toBe(horizontal.triggers[2]);
    dispatchAccordionKey(horizontal.triggers[2], "ArrowLeft");
    expect(document.activeElement).toBe(horizontal.triggers[1]);
    dispatchAccordionKey(horizontal.triggers[1], "ArrowLeft");
    expect(document.activeElement).toBe(horizontal.triggers[0]);

    document.body.replaceChildren();
    const rtl = createAccordionFixture({
      type: "multiple",
      orientation: "horizontal",
      dir: "rtl",
      values: ["alpha", "beta", "gamma"],
    });
    rtl.triggers[1].focus();
    dispatchAccordionKey(rtl.triggers[1], "ArrowRight");
    expect(document.activeElement).toBe(rtl.triggers[0]);
    dispatchAccordionKey(rtl.triggers[0], "ArrowLeft");
    expect(document.activeElement).toBe(rtl.triggers[1]);
    dispatchAccordionKey(rtl.triggers[1], "ArrowLeft");
    expect(document.activeElement).toBe(rtl.triggers[2]);
  });

  it("keeps horizontal accordions from reacting to vertical arrow keys", () => {
    const { triggers } = createAccordionFixture({
      type: "multiple",
      orientation: "horizontal",
      values: ["alpha", "beta"],
    });

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "ArrowDown");

    expect(document.activeElement).toBe(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
  });

  it("preserves heading and trigger semantics from the spec", () => {
    const { headers, triggers } = createAccordionFixture({ type: "single", defaultValue: "alpha" });

    expect(headers).toHaveLength(4);
    for (const header of headers) {
      expect(header.getAttribute("role")).toBe("heading");
      expect(header.getAttribute("aria-level")).toBe("3");
      expect(header.children).toHaveLength(1);
    }

    triggers[0].setAttribute("aria-level", "2");
    expect(triggers[0].getAttribute("role")).toBe("button");
    expect(triggers[0].getAttribute("role")).not.toBe("heading");
  });

  it("handles empty accordions and all-disabled item sets", () => {
    defineAccordionElements();
    const root = document.createElement("aria-accordion");
    root.setAttribute("type", "single");
    document.body.append(root);
    expect(root.getAttribute("data-orientation")).toBe("vertical");

    document.body.replaceChildren();
    const { triggers } = createAccordionFixture({
      type: "single",
      disabledValues: ["alpha", "beta"],
      values: ["alpha", "beta"],
    });

    expect(triggers[0].disabled).toBe(true);
    expect(triggers[1].disabled).toBe(true);
    dispatchAccordionKey(triggers[1], "Home");
    expect(document.activeElement).not.toBe(triggers[0]);
  });

  it("uses current DOM order for arrow Home and End navigation after reorder", () => {
    const { root, items, triggers } = createAccordionFixture({
      type: "multiple",
      values: ["a", "b", "c"],
    });

    root.insertBefore(items[1], items[0]);
    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "ArrowDown");
    expect(document.activeElement).toBe(triggers[2]);

    dispatchAccordionKey(triggers[0], "Home");
    expect(document.activeElement).toBe(triggers[1]);

    dispatchAccordionKey(triggers[1], "End");
    expect(document.activeElement).toBe(triggers[2]);
  });

  it("supports nested item registration without requiring direct children", () => {
    const { triggers } = createAccordionFixture({
      type: "multiple",
      nested: true,
      values: ["alpha", "beta"],
    });

    triggers[0].click();
    expect(triggers[0].open).toBe(true);
    expect(triggers[1].open).toBe(false);

    triggers[1].click();
    expect(triggers[0].open).toBe(true);
    expect(triggers[1].open).toBe(true);
  });

  it("throws when multiple items share the same value", () => {
    defineAccordionElements();
    const root = document.createElement("aria-accordion");
    root.setAttribute("type", "single");
    const first = document.createElement("aria-accordion-item") as RuntimeElement;
    const second = document.createElement("aria-accordion-item") as RuntimeElement;
    first.value = "dup-value";
    second.value = "dup-value";
    root.append(first, second);

    expect(() => {
      (root as RuntimeElement & { syncAccordionTreeFromRoot: () => void }).syncAccordionTreeFromRoot();
    }).toThrow(/Duplicate Accordion\.Item value/i);
  });

  it("maps open state by item value rather than render index", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      defaultValue: "beta",
      values: ["alpha", "beta"],
    });

    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("applies default-value even when it arrives after an initial root sync", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "single",
      values: ["alpha", "beta"],
    });

    expect(root.hasAttribute("value")).toBe(false);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(true);

    root.setAttribute("default-value", "alpha");

    expect(root.value).toBe("alpha");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(true);
  });

  it("updates registration when an item value changes after mount", () => {
    const { items, root, triggers } = createAccordionFixture({
      type: "multiple",
      values: ["alpha", "beta"],
    });

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(root.value).toBe("alpha");

    items[0].value = "renamed";
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(root.value).toBe("");

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(root.value).toBe("renamed");

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(root.value).toBe("");
  });

  it("sets root dir and data-orientation attributes for styling and SSR-like markup", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      orientation: "horizontal",
      dir: "rtl",
      values: ["alpha", "beta"],
    });

    expect(root.getAttribute("dir")).toBe("rtl");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(root.outerHTML).toContain('dir="rtl"');
    expect(root.outerHTML).toContain('aria-expanded="true"');
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[1].getAttribute("aria-hidden")).toBe("true");
    expect(triggers[0].getAttribute("aria-controls")).toBe(contents[0].id);
  });

  it("exposes item header trigger and content state metadata", () => {
    const { items, headers, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      disabledValues: ["beta"],
      values: ["alpha", "beta"],
    });

    expect(items[0].getAttribute("data-state")).toBe("open");
    expect(items[1].getAttribute("data-state")).toBe("closed");
    expect(headers[0].getAttribute("data-state")).toBe("open");
    expect(headers[0].getAttribute("data-orientation")).toBe("vertical");
    expect(triggers[0].getAttribute("data-state")).toBe("open");
    expect(contents[0].getAttribute("data-state")).toBe("open");
    expect(contents[0].getAttribute("data-orientation")).toBe("vertical");
    expect(contents[1].getAttribute("data-disabled")).toBe("");
  });

  it("composes consumer event handlers and lets preventDefault block native toggles", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      collapsible: true,
      values: ["alpha"],
    });
    let clickCount = 0;
    let keydownCount = 0;
    let focusCount = 0;
    triggers[0].addEventListener("click", () => {
      clickCount += 1;
    });
    triggers[0].addEventListener("keydown", () => {
      keydownCount += 1;
    });
    triggers[0].addEventListener("focus", () => {
      focusCount += 1;
    });

    triggers[0].click();
    expect(clickCount).toBe(1);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Enter");
    expect(keydownCount).toBe(1);
    expect(focusCount).toBe(1);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");

    document.body.replaceChildren();
    defineAccordionElements();
    const root = document.createElement("aria-accordion");
    root.setAttribute("type", "single");
    root.setAttribute("collapsible", "true");
    const item = document.createElement("aria-accordion-item") as RuntimeElement;
    const trigger = document.createElement("aria-accordion-trigger") as RuntimeElement;
    const content = document.createElement("aria-accordion-content") as RuntimeElement;
    item.value = "alpha";
    trigger.textContent = "Alpha";
    content.textContent = "Alpha Content";
    trigger.addEventListener("click", (event) => event.preventDefault());
    trigger.addEventListener("keydown", (event) => {
      if ((event as KeyboardEvent).key === "Enter") {
        event.preventDefault();
      }
    });
    item.append(trigger, content);
    root.append(item);
    document.body.append(root);

    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    dispatchAccordionKey(trigger, "Enter");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not react to non-accordion keys", () => {
    const { triggers } = createAccordionFixture({ type: "multiple", values: ["alpha", "beta"] });

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Escape");

    expect(document.activeElement).toBe(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps enabled items closed when root disabled state blocks toggles", () => {
    const { items, root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      disabled: true,
      values: ["alpha"],
    });

    triggers[0].click();

    expect(root.getAttribute("aria-disabled")).toBe("true");
    expect(items[0].getAttribute("aria-disabled")).toBe("true");
    expect(triggers[0].disabled).toBe(true);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(true);
  });

  it("keeps closed content mounted only when force-mount is present", () => {
    const { triggers, contents } = createAccordionFixture({
      type: "single",
      collapsible: true,
      forceMountValues: ["alpha"],
      values: ["alpha", "beta"],
    });

    expect(contents[0].hidden).toBe(false);
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
    expect(contents[0].getAttribute("data-state")).toBe("closed");
    expect(contents[1].hidden).toBe(true);

    triggers[0].click();
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[0].getAttribute("data-state")).toBe("open");
  });

  it("keeps Button and Panel aliases behaviorally identical to Trigger and Content", () => {
    const { headers, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      aliases: true,
      values: ["alpha", "beta"],
    });

    expect(triggers[0].tagName.toLowerCase()).toBe("aria-accordion-button");
    expect(contents[0].tagName.toLowerCase()).toBe("aria-accordion-panel");
    expect(headers[0].getAttribute("role")).toBe("heading");
    expect(headers[0].getAttribute("aria-level")).toBe("3");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(true);

    triggers[1].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("should be rendered as native accordion custom elements", () => {
    const { root, items, headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
    });

    expect(document.body.contains(root)).toBe(true);
    expect(root.tagName.toLowerCase()).toBe("aria-accordion");
    expect(items).toHaveLength(4);
    expect(headers).toHaveLength(4);
    expect(triggers).toHaveLength(4);
    expect(contents).toHaveLength(4);
  });

  it("should expose an accessible APG accordion structure", () => {
    const { root, headers, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      disabledValues: ["delta"],
    });
    const ids = new Set<string>();

    expect(root.getAttribute("data-orientation")).toBe("vertical");
    expect(root.getAttribute("dir")).toBe("ltr");

    for (const [index, trigger] of triggers.entries()) {
      const header = headers[index]!;
      const content = contents[index]!;
      expect(header.getAttribute("role")).toBe("heading");
      expect(header.getAttribute("aria-level")).toBe("3");
      expect(header.firstElementChild).toBe(trigger);
      expect(trigger.getAttribute("role")).toBe("button");
      expect(content.getAttribute("role")).toBe("region");
      expect(trigger.id).not.toBe("");
      expect(content.id).not.toBe("");
      expect(trigger.getAttribute("aria-controls")).toBe(content.id);
      expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
      ids.add(trigger.id);
      ids.add(content.id);
    }

    expect(ids.size).toBe(triggers.length + contents.length);
  });

  it("should initialize single accordions from default-value", () => {
    const { triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha", "beta"],
    });

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
    expect(contents[0].hidden).toBe(false);
    expect(contents[1].hidden).toBe(true);
  });

  it("should call valuechange with the next single value", () => {
    const { root, triggers } = createAccordionFixture({
      type: "single",
      value: "alpha",
      values: ["alpha", "beta"],
    });
    const values: unknown[] = [];
    const valueLists: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
      valueLists.push((event as CustomEvent).detail.values);
    });
    triggers[1].click();

    expect(values).toEqual(["beta"]);
    expect(valueLists).toEqual([["beta"]]);
    expect(root.value).toBe("beta");
  });

  it("should call valuechange with an empty string when a collapsible single item closes", () => {
    const { root, triggers } = createAccordionFixture({
      type: "single",
      value: "alpha",
      collapsible: true,
      values: ["alpha"],
    });
    const values: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
    });
    triggers[0].click();

    expect(values).toEqual([""]);
    expect(root.value).toBe("");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
  });

  it("should call valuechange with the next multiple values", () => {
    const { root, triggers } = createAccordionFixture({
      type: "multiple",
      value: "alpha",
      values: ["alpha", "beta"],
    });
    const values: unknown[] = [];
    const valueLists: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
      valueLists.push((event as CustomEvent).detail.values);
    });
    triggers[1].click();

    expect(values).toEqual([["alpha", "beta"]]);
    expect(valueLists).toEqual([["alpha", "beta"]]);
    expect(root.value).toBe("alpha,beta");
  });

  it("should handle first item disabled navigation", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      defaultValue: "beta",
      disabledValues: ["alpha"],
      values: ["alpha", "beta"],
    });

    triggers[1].focus();
    dispatchAccordionKey(triggers[1], "Home");

    expect(document.activeElement).toBe(triggers[1]);
    expect(triggers[0].disabled).toBe(true);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("preserves disabled content metadata when mounted", () => {
    const { contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      disabledValues: ["alpha"],
      values: ["alpha"],
    });

    expect(contents[0].hidden).toBe(false);
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[0].getAttribute("data-state")).toBe("open");
    expect(contents[0].getAttribute("data-disabled")).toBe("");
    expect(contents[0].getAttribute("data-orientation")).toBe("vertical");
  });

  it("does not refocus a trigger that is already focused", () => {
    const { triggers } = createAccordionFixture({
      type: "single",
      collapsible: true,
      values: ["alpha"],
    });
    const focusSpy = vi.spyOn(triggers[0], "focus");

    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Enter");

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    focusSpy.mockRestore();
  });

  it("ignores pointer keyboard and focus events from disabled custom triggers", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      disabledValues: ["alpha"],
      values: ["alpha"],
    });
    const values: unknown[] = [];

    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
    });
    triggers[0].click();
    triggers[0].focus();
    dispatchAccordionKey(triggers[0], "Enter");
    dispatchAccordionSpace(triggers[0]);

    expect(values).toEqual([]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[0].getAttribute("aria-disabled")).toBe("true");
    expect(contents[0].hidden).toBe(true);
  });

  it("adds heading role semantics for the native Header custom element", () => {
    const { headers } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha"],
    });

    expect(headers[0].tagName.toLowerCase()).toBe("aria-accordion-header");
    expect(headers[0].getAttribute("role")).toBe("heading");
    expect(headers[0].getAttribute("aria-level")).toBe("3");
    headers[0].setAttribute("aria-level", "2");
    expect(headers[0].getAttribute("aria-level")).toBe("2");
  });

  it("keeps closed content hidden by default", () => {
    const { contents } = createAccordionFixture({
      type: "single",
      values: ["alpha", "beta"],
    });

    expect(contents[0].hidden).toBe(true);
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
    expect(contents[0].getAttribute("data-state")).toBe("closed");
    expect(contents[1].hidden).toBe(true);
    expect(contents[1].getAttribute("aria-hidden")).toBe("true");
  });

  it("reflects default-open content in SSR-like serialized markup", () => {
    const { root } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha", "beta"],
    });
    const html = root.outerHTML;

    expect(html).toContain('dir="ltr"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-hidden="false"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-hidden="true"');
  });

  it("reflects multiple open sections in SSR-like serialized markup", () => {
    const { root, triggers, contents } = createAccordionFixture({
      type: "multiple",
      defaultValue: "alpha,beta",
      values: ["alpha", "beta"],
    });

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
    expect(contents[0].getAttribute("aria-hidden")).toBe("false");
    expect(contents[1].getAttribute("aria-hidden")).toBe("false");
    expect(root.outerHTML).toContain('aria-expanded="true"');
    expect(root.outerHTML).toContain('dir="ltr"');
  });

  it("renders dir=rtl on the root in SSR-like serialized markup", () => {
    const { root } = createAccordionFixture({
      type: "single",
      dir: "rtl",
      values: ["alpha"],
    });

    expect(root.getAttribute("dir")).toBe("rtl");
    expect(root.outerHTML).toContain('dir="rtl"');
  });

  it("renders force-mounted closed content in SSR-like serialized markup", () => {
    const { root, contents } = createAccordionFixture({
      type: "single",
      forceMountValues: ["alpha"],
      values: ["alpha", "beta"],
    });

    expect(contents[0].hidden).toBe(false);
    expect(contents[0].getAttribute("aria-hidden")).toBe("true");
    expect(contents[0].getAttribute("data-state")).toBe("closed");
    expect(root.outerHTML).toContain("Content-alpha");
    expect(root.outerHTML).toContain('force-mount=""');
  });

  it("uses native custom element hosts for root item trigger and content composition", () => {
    const { root, items, triggers, contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      aliases: true,
      nested: true,
      values: ["alpha", "beta"],
    });

    expect(root.tagName.toLowerCase()).toBe("aria-accordion");
    expect(items[0].tagName.toLowerCase()).toBe("aria-accordion-item");
    expect(triggers[0].tagName.toLowerCase()).toBe("aria-accordion-button");
    expect(contents[0].tagName.toLowerCase()).toBe("aria-accordion-panel");
    expect(items[0].getAttribute("data-state")).toBe("open");
    expect(items[1].getAttribute("data-state")).toBe("closed");
  });

  it("does not generate inline content size styles", () => {
    const { contents } = createAccordionFixture({
      type: "single",
      defaultValue: "alpha",
      values: ["alpha"],
    });

    expect(contents[0].style.getPropertyValue("--accordion-content-height")).toBe("");
    expect(contents[0].style.getPropertyValue("--accordion-content-width")).toBe("");
    expect(contents[0].style.width).toBe("");
    expect(contents[0].style.opacity).toBe("");
    expect(contents[0].hasAttribute("style")).toBe(false);
  });




});
