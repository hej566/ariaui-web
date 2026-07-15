import { afterEach, describe, expect, it } from "vitest";
import {
  componentSpec,
  createHoverCardElement,
  defineHoverCardElements,
  getPartSpec,
  type ComponentPartName,
} from "../src";

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

type RuntimeElementList = [
  RuntimeElement,
  RuntimeElement,
  RuntimeElement,
  RuntimeElement,
  ...RuntimeElement[],
];

const checkableRoles = new Set([
  "checkbox",
  "menuitemcheckbox",
  "menuitemradio",
  "radio",
  "switch",
]);
const buttonLikeRoles = new Set([
  "button",
  "checkbox",
  "link",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "switch",
  "tab",
]);
const expandableRoles = new Set(["button", "combobox", "menuitem"]);
const selectableRoles = new Set(["option", "row", "tab", "treeitem"]);
const focusableRoles = new Set([
  "button",
  "checkbox",
  "link",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "switch",
  "tab",
]);

function documentedRequirementAttributes() {
  const attributes = new Set<string>();
  const tagNames: ReadonlySet<string> = new Set(
    componentSpec.parts.map((part) => part.tagName),
  );
  const attributePattern =
    /\b(?:aria|data)-[a-z0-9-]+\b|\bnative-composition\b|\bdefault-open\b|\bdismissible\b|\btabIndex\b|\btabindex\b|\brole\b|\bid\b|\bdir\b|\borientation\b|\bdisabled\b|\brequired\b|\bvalue\b|\bopen\b|\bchecked\b|\bselected\b|\bpressed\b/g;

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

  for (const attribute of [
    "aria-expanded",
    "arrow",
    "arrow-class",
    "data-align",
    "data-side",
    "data-state",
    "default-open",
    "offset",
    "placement",
  ]) {
    attributes.add(attribute);
  }

  return Array.from(attributes).sort();
}

function kebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function appendHoverCardElement(element: RuntimeElement) {
  if (element.matches("aria-hover-card")) {
    document.body.append(element);
    return element;
  }

  const root = document.createElement("aria-hover-card");
  root.append(element);
  document.body.append(root);
  return element;
}

function appendPart(tagName: string) {
  return appendHoverCardElement(
    document.createElement(tagName) as RuntimeElement,
  );
}

function renderHoverCard(rootAttributes: Record<string, string> = {}) {
  defineHoverCardElements();
  const root = document.createElement("aria-hover-card") as RuntimeElement;
  const trigger = document.createElement(
    "aria-hover-card-trigger",
  ) as RuntimeElement;
  const content = document.createElement(
    "aria-hover-card-content",
  ) as RuntimeElement;

  for (const [name, value] of Object.entries(rootAttributes)) {
    root.setAttribute(name, value);
  }

  trigger.textContent = "Hover me";
  content.textContent = "Card content";
  root.append(trigger, content);
  document.body.append(root);
  return { root, trigger, content };
}

describe("@ariaui-web/hover-card", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/hover-card");
    expect(componentSpec.slug).toBe("hover-card");
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

    expect(specWithRequirements.requirementAttributes).toEqual(
      documentedAttributes,
    );

    for (const part of specWithRequirements.parts) {
      expect(part.defaultAttributes).toBeDefined();

      for (const attribute of Object.keys(part.defaultAttributes)) {
        expect(documentedAttributes).toContain(attribute);
      }

      if (
        documentedAttributes.includes("aria-expanded") &&
        part.defaultRole &&
        expandableRoles.has(part.defaultRole)
      ) {
        expect(part.defaultAttributes["aria-expanded"]).toBe("false");
      }

      if (
        documentedAttributes.includes("aria-selected") &&
        part.defaultRole &&
        selectableRoles.has(part.defaultRole)
      ) {
        expect(part.defaultAttributes["aria-selected"]).toBe("false");
      }
    }
  });

  it("exposes helpers that resolve and create every spec part", () => {
    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);

      const element = createHoverCardElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow(
      "Unknown @ariaui-web/hover-card part",
    );
  });

  it("defines all custom elements idempotently", () => {
    defineHoverCardElements();
    defineHoverCardElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineHoverCardElements();
    const element = createHoverCardElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("hover-card");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineHoverCardElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("hover-card");
      expect(element.getAttribute("data-package")).toBe("hover-card");
      expect(element.getAttribute("data-part")).toBe(part.name);
      expect(element.getAttribute("part")).toBe(kebabCase(part.name));
      for (const [attribute, value] of Object.entries(
        runtimePart.defaultAttributes,
      )) {
        expect(element.getAttribute(attribute)).toBe(value);
      }

      if (part.defaultRole) {
        expect(element.getAttribute("role")).toBe(part.defaultRole);
      } else {
        expect(element.hasAttribute("role")).toBe(false);
      }

      const roleOverride = document.createElement(part.tagName);
      roleOverride.setAttribute("role", "presentation");
      appendHoverCardElement(roleOverride as RuntimeElement);
      expect(roleOverride.getAttribute("role")).toBe("presentation");
    }
  });

  it("reflects shared state attributes required by the generated spec", () => {
    defineHoverCardElements();
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
      expect(element.getAttribute("data-orientation")).toBe(
        rootPart.defaultAttributes.orientation,
      );
    } else {
      expect(element.hasAttribute("data-orientation")).toBe(false);
    }
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    defineHoverCardElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !checkableRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      const defaultElement = document.createElement(
        part.tagName,
      ) as RuntimeElement;
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

      const hiddenInput = element.querySelector(
        "input[data-ariaui-web-hidden-input='true']",
      );

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
      expect(
        element.querySelector("input[data-ariaui-web-hidden-input='true']"),
      ).toBeNull();
    }
  });

  it("implements expandable and selectable role reflection from the generated spec", () => {
    defineHoverCardElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const role = part.defaultRole as string | null;

      if (role && expandableRoles.has(role)) {
        expect(element.getAttribute("aria-expanded")).toBe("false");
        const expansionOwner =
          part.name === "Trigger"
            ? (element.closest("aria-hover-card") as RuntimeElement)
            : element;
        expansionOwner.open = true;
        expect(element.getAttribute("aria-expanded")).toBe("true");
        expansionOwner.open = false;
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
    defineHoverCardElements();

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
      element.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      const spaceKeyDown = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(spaceKeyDown);
      element.dispatchEvent(
        new KeyboardEvent("keyup", { key: " ", bubbles: true }),
      );

      expect(spaceKeyDown.defaultPrevented).toBe(true);
      expect(clickCount).toBe(2);

      element.disabled = true;
      const disabledKeyDown = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(disabledKeyDown);
      element.click();

      expect(disabledKeyDown.defaultPrevented).toBe(true);
      expect(element.getAttribute("aria-disabled")).toBe("true");
      expect(element.getAttribute("data-disabled")).toBe("");
      expect(clickCount).toBe(2);
    }
  });

  it("starts closed and applies default-open once", () => {
    const closed = renderHoverCard();
    expect(closed.root.open).toBe(false);
    expect(closed.content.hidden).toBe(true);
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("false");

    const opened = renderHoverCard({ "default-open": "" });
    expect(opened.root.open).toBe(true);
    expect(opened.content.hidden).toBe(false);
    expect(opened.trigger.getAttribute("aria-expanded")).toBe("true");

    opened.root.open = false;
    opened.root.setAttribute("data-test-mutation", "one");
    expect(opened.root.open).toBe(false);
  });

  it("associates Trigger and Content with stable ids and tooltip semantics", () => {
    const { trigger, content } = renderHoverCard();

    expect(trigger.id).not.toBe("");
    expect(content.id).not.toBe("");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
    expect(content.getAttribute("role")).toBe("tooltip");
  });

  it("reports Trigger and Content connected outside Root", () => {
    defineHoverCardElements();
    const TriggerConstructor = customElements.get(
      "aria-hover-card-trigger",
    ) as unknown as {
      new (): RuntimeElement & { connectedCallback(): void };
    };
    const orphan = new TriggerConstructor();

    expect(() => orphan.connectedCallback()).toThrow(
      "HoverCard components must be wrapped in <HoverCard.Root />",
    );
  });

  it("opens and closes from Trigger pointer hover while composing consumer handlers", async () => {
    const { root, trigger, content } = renderHoverCard();
    let consumerEnterCount = 0;
    trigger.addEventListener("mouseenter", () => {
      consumerEnterCount += 1;
    });

    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(consumerEnterCount).toBe(1);
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);

    trigger.dispatchEvent(new MouseEvent("mouseleave"));
    await Promise.resolve();
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("keeps the safe area open while the pointer moves into Content", async () => {
    const { root, trigger, content } = renderHoverCard();
    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    trigger.dispatchEvent(new MouseEvent("mouseleave"));
    content.dispatchEvent(new MouseEvent("mouseenter"));
    await Promise.resolve();
    expect(root.open).toBe(true);

    content.dispatchEvent(new MouseEvent("mouseleave"));
    await Promise.resolve();
    expect(root.open).toBe(false);
  });

  it("opens on focus, closes on blur, and closes on Escape", async () => {
    const { root, trigger, content } = renderHoverCard();
    trigger.dispatchEvent(new FocusEvent("focus"));
    expect(root.open).toBe(true);

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(root.open).toBe(false);

    trigger.dispatchEvent(new FocusEvent("focus"));
    trigger.dispatchEvent(new FocusEvent("blur"));
    await Promise.resolve();
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("lets consumers cancel openchange and own open state", () => {
    const { root, trigger, content } = renderHoverCard();
    const changes: boolean[] = [];

    root.addEventListener("openchange", (event) => {
      const change = event as CustomEvent<{ open: boolean; source: Element }>;
      changes.push(change.detail.open);
      expect(change.detail.source).toBe(trigger);
      event.preventDefault();
    });

    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(changes).toEqual([true]);
    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);

    root.open = true;
    expect(content.hidden).toBe(false);
  });

  it("positions against the viewport rather than a clipped parent", () => {
    const { root, trigger, content } = renderHoverCard();
    root.setAttribute("placement", "bottom");
    root.setAttribute("offset", "8");
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 1000,
    });
    trigger.getBoundingClientRect = () => new DOMRect(100, 100, 120, 32);
    content.getBoundingClientRect = () => new DOMRect(0, 0, 220, 160);

    root.open = true;

    expect(content.getAttribute("popover")).toBe("manual");
    expect(content.style.position).toBe("fixed");
    expect(content.style.left).toBe("50px");
    expect(content.style.top).toBe("140px");
    expect(content.dataset.side).toBe("bottom");
    expect(content.dataset.align).toBe("center");
  });

  it("flips at viewport collisions and renders one optional arrow", () => {
    const { root, trigger, content } = renderHoverCard();
    root.setAttribute("placement", "bottom-start");
    content.setAttribute("arrow", "");
    content.setAttribute("arrow-class", "test-arrow");
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 240,
    });
    trigger.getBoundingClientRect = () => new DOMRect(16, 210, 80, 24);
    content.getBoundingClientRect = () => new DOMRect(0, 0, 180, 100);

    root.open = true;

    expect(content.dataset.side).toBe("top");
    expect(content.dataset.align).toBe("start");
    expect(content.querySelectorAll("[data-hover-card-arrow]")).toHaveLength(1);
    expect(
      content
        .querySelector("[data-hover-card-arrow]")
        ?.classList.contains("test-arrow"),
    ).toBe(true);
  });

  it("repositions while open when the document scrolls", () => {
    const { root, trigger, content } = renderHoverCard();
    let triggerLeft = 100;
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 1000,
    });
    trigger.getBoundingClientRect = () =>
      new DOMRect(triggerLeft, 100, 120, 32);
    content.getBoundingClientRect = () => new DOMRect(0, 0, 220, 160);

    root.open = true;
    expect(content.style.left).toBe("50px");

    triggerLeft = 200;
    document.dispatchEvent(new Event("scroll"));
    expect(content.style.left).toBe("150px");
  });
});
