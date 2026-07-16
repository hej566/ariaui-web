import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createContextMenuElement, defineContextMenuElements, getPartSpec, type ComponentPartName } from "../src";

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

function hasExpandablePartContract(part: RuntimePartSpec) {
  return Boolean(part.defaultRole && expandableRoles.has(part.defaultRole) && part.name !== "Item");
}

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

describe("@ariaui-web/context-menu", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/context-menu");
    expect(componentSpec.slug).toBe("context-menu");
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

      if (documentedAttributes.includes("aria-expanded") && hasExpandablePartContract(part)) {
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

      const element = createContextMenuElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/context-menu part");
  });

  it("defines all custom elements idempotently", () => {
    defineContextMenuElements();
    defineContextMenuElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineContextMenuElements();
    const element = createContextMenuElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("context-menu");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineContextMenuElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("context-menu");
      expect(element.getAttribute("data-package")).toBe("context-menu");
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
    defineContextMenuElements();
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
    defineContextMenuElements();

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
    defineContextMenuElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const role = part.defaultRole as string | null;

      if (hasExpandablePartContract(part as RuntimePartSpec)) {
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
    defineContextMenuElements();

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

  it("matches the source package context menu part inventory and static semantics", () => {
    defineContextMenuElements();

    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Content",
      "Item",
      "Sub",
      "SubTrigger",
      "SubContent",
      "Group",
      "Label",
      "Separator",
    ]);

    const root = appendPart("aria-context-menu");
    const content = appendPart("aria-context-menu-content");
    const item = appendPart("aria-context-menu-item");
    const sub = appendPart("aria-context-menu-sub");
    const subTrigger = appendPart("aria-context-menu-sub-trigger");
    const subContent = appendPart("aria-context-menu-sub-content");
    const group = appendPart("aria-context-menu-group");
    const label = appendPart("aria-context-menu-label");
    const separator = appendPart("aria-context-menu-separator");

    expect(root.hasAttribute("role")).toBe(false);
    expect(content.getAttribute("role")).toBe("menu");
    expect(content.getAttribute("tabindex")).toBe("0");
    expect(content.hasAttribute("data-context-menu-content")).toBe(true);
    expect(content.hidden).toBe(true);
    expect(item.getAttribute("role")).toBe("menuitem");
    expect(item.getAttribute("tabindex")).toBe("-1");
    expect(item.hasAttribute("aria-haspopup")).toBe(false);
    expect(item.hasAttribute("aria-expanded")).toBe(false);
    expect(sub.hasAttribute("role")).toBe(false);
    expect(subTrigger.getAttribute("role")).toBe("menuitem");
    expect(subTrigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(subTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(subTrigger.getAttribute("tabindex")).toBe("-1");
    expect(subContent.getAttribute("role")).toBe("menu");
    expect(subContent.getAttribute("tabindex")).toBe("0");
    expect(subContent.hasAttribute("data-context-menu-content")).toBe(true);
    expect(subContent.hidden).toBe(true);
    expect(group.getAttribute("role")).toBe("group");
    expect(label.hasAttribute("role")).toBe(false);
    expect(separator.getAttribute("role")).toBe("separator");
  });

  it("opens from a native contextmenu event at the pointer position and closes on selection", () => {
    defineContextMenuElements();

    const area = document.createElement("div");
    const root = document.createElement("aria-context-menu") as RuntimeElement;
    const content = document.createElement("aria-context-menu-content") as RuntimeElement;
    const back = document.createElement("aria-context-menu-item") as RuntimeElement;
    const reload = document.createElement("aria-context-menu-item") as RuntimeElement;
    const values: string[] = [];

    area.id = "context-menu-area";
    area.textContent = "Right click anywhere in this area";
    root.setAttribute("area", area.id);
    back.value = "back";
    back.textContent = "Back";
    reload.value = "reload";
    reload.textContent = "Reload";
    content.append(back, reload);
    root.append(content);
    document.body.append(area, root);
    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    const contextEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 140,
    });
    area.dispatchEvent(contextEvent);

    expect(contextEvent.defaultPrevented).toBe(true);
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(content.style.left).toBe("120px");
    expect(content.style.top).toBe("140px");
    expect(content.style.visibility).toBe("visible");
    expect(content.getAttribute("data-side")).toBe("bottom");
    expect(content.getAttribute("data-focused")).toBe("true");
    expect(document.activeElement).toBe(content);
    expect(content.hasAttribute("aria-activedescendant")).toBe(false);
    expect(back.getAttribute("data-active")).toBe("false");
    expect(back.getAttribute("tabindex")).toBe("-1");

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(back.id);
    expect(back.getAttribute("data-active")).toBe("true");
    expect(back.getAttribute("tabindex")).toBe("0");

    reload.click();
    expect(values).toEqual(["reload"]);
    expect(root.value).toBe("reload");
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("closes when clicking outside the menu surface, including the context area", () => {
    defineContextMenuElements();

    const area = document.createElement("div");
    const outside = document.createElement("button");
    const root = document.createElement("aria-context-menu") as RuntimeElement;
    const content = document.createElement("aria-context-menu-content") as RuntimeElement;
    const item = document.createElement("aria-context-menu-item") as RuntimeElement;

    area.id = "context-menu-area";
    area.textContent = "Right click anywhere in this area";
    outside.textContent = "Outside";
    root.setAttribute("area", area.id);
    item.value = "back";
    item.textContent = "Back";
    content.append(item);
    root.append(content);
    document.body.append(area, outside, root);

    area.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 40, clientY: 50 }));
    expect(root.open).toBe(true);

    content.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(root.open).toBe(true);

    area.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);

    area.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 60, clientY: 70 }));
    expect(root.open).toBe(true);

    outside.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("supports source-equivalent submenu, group label, and keyboard behavior", () => {
    defineContextMenuElements();

    const area = document.createElement("div");
    const root = document.createElement("aria-context-menu") as RuntimeElement;
    const content = document.createElement("aria-context-menu-content") as RuntimeElement;
    const topItem = document.createElement("aria-context-menu-item") as RuntimeElement;
    const sub = document.createElement("aria-context-menu-sub") as RuntimeElement;
    const subTrigger = document.createElement("aria-context-menu-sub-trigger") as RuntimeElement;
    const subContent = document.createElement("aria-context-menu-sub-content") as RuntimeElement;
    const saveAs = document.createElement("aria-context-menu-item") as RuntimeElement;
    const group = document.createElement("aria-context-menu-group") as RuntimeElement;
    const label = document.createElement("aria-context-menu-label") as RuntimeElement;
    const pedro = document.createElement("aria-context-menu-item") as RuntimeElement;
    const values: string[] = [];

    area.id = "context-area";
    root.setAttribute("area", area.id);
    topItem.value = "back";
    topItem.textContent = "Back";
    subTrigger.textContent = "More Tools";
    saveAs.value = "save-as";
    saveAs.textContent = "Save Page As";
    subContent.append(saveAs);
    sub.append(subTrigger, subContent);
    label.textContent = "People";
    pedro.value = "pedro";
    pedro.textContent = "Pedro Duarte";
    group.append(label, pedro);
    content.append(topItem, sub, group);
    root.append(content);
    document.body.append(area, root);
    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    area.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 20, clientY: 30 }));

    expect(group.getAttribute("aria-labelledby")).toBe(label.id);
    expect(label.id).toBeTruthy();
    expect(subTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(subContent.hidden).toBe(true);

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(content.getAttribute("aria-activedescendant")).toBe(subTrigger.id);

    content.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(true);
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(subTrigger.getAttribute("aria-controls")).toBe(subContent.id);
    expect(subContent.hidden).toBe(false);
    expect(subContent.getAttribute("aria-labelledby")).toBe(subTrigger.id);
    expect(subContent.getAttribute("aria-activedescendant")).toBe(saveAs.id);
    expect(document.activeElement).toBe(subContent);

    subContent.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);
    expect(document.activeElement).toBe(subTrigger);

    subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    expect(sub.open).toBe(true);
    expect(subContent.hidden).toBe(false);
    expect(subContent.hasAttribute("aria-activedescendant")).toBe(false);

    saveAs.click();
    expect(values).toEqual(["save-as"]);
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(sub.open).toBe(false);
    expect(subContent.hidden).toBe(true);
  });

  it("positions an initially hovered submenu before submenu content can affect trigger layout", () => {
    defineContextMenuElements();

    const originalRectDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "getBoundingClientRect");
    const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, "clientWidth");
    const originalClientHeightDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, "clientHeight");

    const area = document.createElement("div");
    const root = document.createElement("aria-context-menu") as RuntimeElement;
    const content = document.createElement("aria-context-menu-content") as RuntimeElement;
    const sub = document.createElement("aria-context-menu-sub") as RuntimeElement;
    const subTrigger = document.createElement("aria-context-menu-sub-trigger") as RuntimeElement;
    const subContent = document.createElement("aria-context-menu-sub-content") as RuntimeElement;
    const subItem = document.createElement("aria-context-menu-item") as RuntimeElement;

    area.id = "initial-hover-area";
    root.setAttribute("area", area.id);
    sub.setAttribute("offset", "-4 4");
    subTrigger.textContent = "More Tools";
    subItem.textContent = "Developer Tools";
    subContent.append(subItem);
    sub.append(subTrigger, subContent);
    content.append(sub);
    root.append(content);
    document.body.append(area, root);

    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value(this: HTMLElement) {
        if (this === content) {
          return new DOMRect(80, 100, 140, 160);
        }

        if (this === subTrigger) {
          const submenuIsStillInParentFlow = !subContent.hidden && subContent.style.position !== "fixed";
          return new DOMRect(100, 120, submenuIsStillInParentFlow ? 320 : 120, 32);
        }

        if (this === subContent) {
          return new DOMRect(0, 0, 180, 100);
        }

        return new DOMRect(0, 0, 0, 0);
      },
    });

    try {
      area.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 80, clientY: 100 }));
      subTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));

      expect(sub.open).toBe(true);
      expect(subContent.hidden).toBe(false);
      expect(subContent.getAttribute("data-side")).toBe("right");
      expect(subContent.style.left).toBe("216px");
      expect(subContent.style.top).toBe("124px");
      expect(subContent.style.visibility).toBe("visible");
    } finally {
      if (originalRectDescriptor) {
        Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", originalRectDescriptor);
      }
      if (originalClientWidthDescriptor) {
        Object.defineProperty(document.documentElement, "clientWidth", originalClientWidthDescriptor);
      } else {
        delete (document.documentElement as Partial<HTMLElement>).clientWidth;
      }
      if (originalClientHeightDescriptor) {
        Object.defineProperty(document.documentElement, "clientHeight", originalClientHeightDescriptor);
      } else {
        delete (document.documentElement as Partial<HTMLElement>).clientHeight;
      }
    }
  });



});
