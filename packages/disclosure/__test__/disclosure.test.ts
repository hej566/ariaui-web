import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createDisclosureElement, defineDisclosureElements, getPartSpec, type ComponentPartName } from "../src";

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
type DisclosureFixtureOptions = {
  contentId?: string;
  defaultOpen?: boolean;
  forceMount?: boolean;
  nativeComposition?: boolean;
  open?: boolean;
};
type DisclosureFixture = {
  content: RuntimeElement;
  contentHost: HTMLElement;
  root: RuntimeElement;
  trigger: RuntimeElement;
};

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

function createDisclosureFixture(options: DisclosureFixtureOptions = {}): DisclosureFixture {
  defineDisclosureElements();

  const root = document.createElement("aria-disclosure") as RuntimeElement;
  const header = document.createElement("div");
  const trigger = document.createElement("aria-disclosure-trigger") as RuntimeElement;
  const content = document.createElement("aria-disclosure-content") as RuntimeElement;
  const contentHost = options.nativeComposition ? document.createElement("div") : content;

  trigger.textContent = "Toggle";
  contentHost.textContent = "Secret Content";

  if (options.defaultOpen) {
    root.setAttribute("default-open", "");
  }

  if (options.open) {
    root.setAttribute("open", "");
  }

  if (options.contentId) {
    content.id = options.contentId;
  }

  if (options.forceMount) {
    content.setAttribute("force-mount", "");
  }

  if (options.nativeComposition) {
    content.setAttribute("native-composition", "");
    content.setAttribute("class", "content-class");
    contentHost.setAttribute("data-motion-content", "");
    content.append(contentHost);
  }

  header.append(trigger);
  root.append(header, content);
  document.body.append(root);

  return {
    content,
    contentHost,
    root,
    trigger,
  };
}

async function flushDisclosureMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

function dispatchDisclosureKey(element: Element, key: string) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  if (key === " ") {
    element.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true }));
  }
  return event;
}

describe("@ariaui-web/disclosure", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/disclosure");
    expect(componentSpec.slug).toBe("disclosure");
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

      const element = createDisclosureElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/disclosure part");
  });

  it("defines all custom elements idempotently", () => {
    defineDisclosureElements();
    defineDisclosureElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineDisclosureElements();
    const element = createDisclosureElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("disclosure");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineDisclosureElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("disclosure");
      expect(element.getAttribute("data-package")).toBe("disclosure");
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
    defineDisclosureElements();
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
    expect(element.hasAttribute("aria-expanded")).toBe(false);
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
    defineDisclosureElements();

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
    defineDisclosureElements();

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
    defineDisclosureElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }

      if (role === "button" && part.name !== "Trigger") {
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

  it("renders closed by default and opens from default-open", () => {
    const closed = createDisclosureFixture();

    expect(closed.root.open).toBe(false);
    expect(closed.root.getAttribute("data-state")).toBe("closed");
    expect(closed.root.hasAttribute("aria-expanded")).toBe(false);
    expect(closed.trigger.getAttribute("role")).toBe("button");
    expect(closed.trigger.getAttribute("type")).toBe("button");
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("false");
    expect(closed.trigger.getAttribute("aria-controls")).toBe(closed.contentHost.id);
    expect(closed.content.hidden).toBe(true);
    expect(closed.content.getAttribute("aria-hidden")).toBe("true");
    expect(closed.content.getAttribute("data-state")).toBe("closed");

    document.body.replaceChildren();
    const open = createDisclosureFixture({ defaultOpen: true });

    expect(open.root.open).toBe(true);
    expect(open.root.getAttribute("data-state")).toBe("open");
    expect(open.trigger.getAttribute("aria-expanded")).toBe("true");
    expect(open.trigger.getAttribute("aria-controls")).toBe(open.contentHost.id);
    expect(open.content.hidden).toBe(false);
    expect(open.content.getAttribute("aria-hidden")).toBe("false");
    expect(open.content.getAttribute("data-state")).toBe("open");
  });

  it("generates stable trigger-content relationships", () => {
    const custom = createDisclosureFixture({ contentId: "custom-disclosure-content" });

    expect(custom.contentHost.id).toBe("custom-disclosure-content");
    expect(custom.trigger.getAttribute("aria-controls")).toBe("custom-disclosure-content");

    document.body.replaceChildren();
    const first = createDisclosureFixture();
    const second = createDisclosureFixture();

    expect(first.contentHost.id).toBeTruthy();
    expect(second.contentHost.id).toBeTruthy();
    expect(first.trigger.getAttribute("aria-controls")).toBe(first.contentHost.id);
    expect(second.trigger.getAttribute("aria-controls")).toBe(second.contentHost.id);
    expect(first.contentHost.id).not.toBe(second.contentHost.id);
  });

  it("toggles content on click Enter and Space while preserving consumer handlers", async () => {
    const { root, trigger, content } = createDisclosureFixture();
    const customClick = vi.fn();
    const changes: boolean[] = [];

    trigger.addEventListener("click", customClick);
    root.addEventListener("openchange", (event) => {
      changes.push((event as CustomEvent<{ open: boolean }>).detail.open);
    });

    trigger.click();
    await flushDisclosureMicrotasks();

    expect(customClick).toHaveBeenCalledTimes(1);
    expect(changes).toEqual([true]);
    expect(root.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.hidden).toBe(false);

    trigger.click();
    await flushDisclosureMicrotasks();

    expect(changes).toEqual([true, false]);
    expect(root.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(content.hidden).toBe(true);

    dispatchDisclosureKey(trigger, "Enter");
    await flushDisclosureMicrotasks();
    expect(root.open).toBe(true);

    dispatchDisclosureKey(trigger, " ");
    await flushDisclosureMicrotasks();
    expect(root.open).toBe(false);
  });

  it("does not toggle when trigger activation is prevented or disabled", async () => {
    const prevented = createDisclosureFixture();
    prevented.trigger.addEventListener("click", (event) => event.preventDefault());

    prevented.trigger.click();
    await flushDisclosureMicrotasks();

    expect(prevented.root.open).toBe(false);
    expect(prevented.content.hidden).toBe(true);

    document.body.replaceChildren();
    const disabled = createDisclosureFixture();
    disabled.trigger.disabled = true;

    disabled.trigger.click();
    await flushDisclosureMicrotasks();

    expect(disabled.root.open).toBe(false);
    expect(disabled.content.hidden).toBe(true);
  });

  it("reports controlled-style open requests without mutating controlled open state", async () => {
    const { root, trigger, content } = createDisclosureFixture({ open: true });
    const changes: boolean[] = [];

    root.addEventListener("openchange", (event) => {
      changes.push((event as CustomEvent<{ open: boolean }>).detail.open);
    });

    trigger.click();
    await flushDisclosureMicrotasks();

    expect(changes).toEqual([false]);
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("slots content metadata onto native-composition child hosts", () => {
    const { content, contentHost, trigger } = createDisclosureFixture({
      defaultOpen: true,
      nativeComposition: true,
    });

    expect(contentHost.getAttribute("data-motion-content")).toBe("");
    expect(contentHost.id).toBe(trigger.getAttribute("aria-controls"));
    expect(contentHost.className).toContain("content-class");
    expect(contentHost.getAttribute("role")).toBe("region");
    expect(contentHost.getAttribute("data-state")).toBe("open");
    expect(contentHost.getAttribute("aria-hidden")).toBe("false");
    expect(contentHost.hidden).toBe(false);
    expect(contentHost.hasAttribute("native-composition")).toBe(false);
    expect(content.getAttribute("role")).toBeNull();
  });

  it("keeps force-mounted content present for animation while closed", () => {
    const { content, trigger } = createDisclosureFixture({ forceMount: true });

    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });




});
