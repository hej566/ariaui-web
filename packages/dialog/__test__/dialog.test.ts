import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createDialogElement, defineDialogElements, getPartSpec, type ComponentPartName } from "../src";

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

describe("@ariaui-web/dialog", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/dialog");
    expect(componentSpec.slug).toBe("dialog");
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

      const element = createDialogElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/dialog part");
  });

  it("defines all custom elements idempotently", () => {
    defineDialogElements();
    defineDialogElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineDialogElements();
    const element = createDialogElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("dialog");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineDialogElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("dialog");
      expect(element.getAttribute("data-package")).toBe("dialog");
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
    defineDialogElements();
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
    defineDialogElements();

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
    defineDialogElements();

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
    defineDialogElements();

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




  function createDialogFixture(options: {
    defaultOpen?: boolean;
    disabledTrigger?: boolean;
    forceMount?: boolean;
    omitCancel?: boolean;
    open?: boolean;
  } = {}) {
    defineDialogElements();
    const root = document.createElement("aria-dialog") as RuntimeElement;
    const trigger = document.createElement("aria-dialog-trigger") as RuntimeElement;
    const portal = document.createElement("aria-dialog-portal") as RuntimeElement;
    const overlay = document.createElement("aria-dialog-overlay") as RuntimeElement;
    const content = document.createElement("aria-dialog-content") as RuntimeElement;
    const title = document.createElement("aria-dialog-title") as RuntimeElement;
    const description = document.createElement("aria-dialog-description") as RuntimeElement;
    const close = document.createElement("aria-dialog-close") as RuntimeElement;
    const cancel = document.createElement("aria-dialog-cancel") as RuntimeElement;
    const action = document.createElement("aria-dialog-action") as RuntimeElement;
    const nameField = document.createElement("input");
    const usernameField = document.createElement("input");
    const footer = document.createElement("div");

    trigger.textContent = "Edit Profile";
    title.textContent = "Edit profile";
    description.textContent = "Make changes to your profile here. Click save when you are done.";
    nameField.id = "dialog-demo-name";
    nameField.value = "Pedro Duarte";
    usernameField.id = "dialog-demo-username";
    usernameField.value = "@peduarte";
    close.textContent = "Close";
    cancel.textContent = "Cancel";
    action.textContent = "Save changes";

    if (options.defaultOpen) {
      root.setAttribute("default-open", "");
    }

    if (options.open) {
      root.setAttribute("open", "");
    }

    if (options.disabledTrigger) {
      trigger.disabled = true;
    }

    if (options.forceMount) {
      portal.setAttribute("force-mount", "");
      overlay.setAttribute("force-mount", "");
      content.setAttribute("force-mount", "");
    }

    if (options.omitCancel) {
      footer.append(action);
    } else {
      footer.append(cancel, action);
    }
    content.append(title, description, nameField, usernameField, footer, close);
    portal.append(overlay, content);
    root.append(trigger, portal);
    document.body.append(root);

    return { root, trigger, portal, overlay, content, title, description, close, cancel, action, nameField, usernameField };
  }

  function flushDialogMicrotasks() {
    return new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));
  }

  function dispatchDialogKey(element: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  it("declares dialog source defaults in componentSpec metadata", () => {
    expect(getPartSpec("Root").defaultRole).toBeNull();
    expect(getPartSpec("Content").defaultRole).toBeNull();
    expect(getPartSpec("Description").defaultRole).toBeNull();
    expect(getPartSpec("Content").defaultAttributes).toMatchObject({
      "data-dialog-content": "",
    });
    expect(getPartSpec("Title").defaultAttributes).toMatchObject({
      "aria-level": "2",
    });
    expect(getPartSpec("Action").defaultAttributes).toMatchObject({
      "data-dialog-action": "",
    });
    expect(getPartSpec("Cancel").defaultAttributes).toMatchObject({
      "data-dialog-cancel": "",
    });
  });

  it("matches the dialog part and default semantics from the source spec", () => {
    const { root, trigger, content, title, description, close, cancel, action } = createDialogFixture({ forceMount: true });

    expect(root.hasAttribute("role")).toBe(false);
    expect(trigger.getAttribute("role")).toBe("button");
    expect(content.hasAttribute("role")).toBe(false);
    expect(content.getAttribute("data-dialog-content")).toBe("");
    expect(title.getAttribute("role")).toBe("heading");
    expect(title.getAttribute("aria-level")).toBe("2");
    expect(description.hasAttribute("role")).toBe(false);
    expect(close.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("role")).toBe("button");
    expect(action.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("data-dialog-cancel")).toBe("");
    expect(action.getAttribute("data-dialog-action")).toBe("");
  });

  it("keeps dialog content closed by default until Trigger opens it", () => {
    const { root, trigger, portal, overlay, content } = createDialogFixture();

    expect(root.open).toBe(false);
    expect(root.getAttribute("data-state")).toBe("closed");
    expect(root.hasAttribute("aria-expanded")).toBe(false);
    expect(document.body.querySelector("[role='dialog']")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("data-state")).toBe("closed");
    expect(portal.hidden).toBe(true);
    expect(overlay.hidden).toBe(true);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("closed");
  });

  it("opens from Trigger and exposes dialog semantics with title and description linkage", async () => {
    const { root, trigger, portal, overlay, content, title, description, cancel } = createDialogFixture();

    trigger.click();
    await flushDialogMicrotasks();

    expect(root.open).toBe(true);
    expect(root.getAttribute("data-state")).toBe("open");
    expect(root.hasAttribute("aria-expanded")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-state")).toBe("open");
    expect(document.activeElement).toBe(cancel);
  });

  it("opens from default-open and focuses Cancel before Action", async () => {
    const { root, trigger, portal, overlay, content, cancel } = createDialogFixture({ defaultOpen: true });
    await flushDialogMicrotasks();

    expect(root.open).toBe(true);
    expect(root.getAttribute("data-state")).toBe("open");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
    expect(document.activeElement).toBe(cancel);
  });

  it("focuses the first tabbable element when no Cancel button is present", async () => {
    const { trigger, nameField } = createDialogFixture({ omitCancel: true });

    trigger.click();
    await flushDialogMicrotasks();

    expect(document.activeElement).toBe(nameField);
  });

  it("closes by default when Trigger is clicked while open", async () => {
    const { root, trigger, content } = createDialogFixture();

    trigger.click();
    await flushDialogMicrotasks();
    trigger.click();
    await flushDialogMicrotasks();

    expect(root.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.hasAttribute("aria-controls")).toBe(false);
    expect(content.hidden).toBe(true);
    expect(content.hasAttribute("role")).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps the dialog closed when Trigger click is prevented", async () => {
    const { root, trigger, content } = createDialogFixture();
    trigger.addEventListener("click", (event) => event.preventDefault());

    trigger.click();
    await flushDialogMicrotasks();

    expect(root.open).toBe(false);
    expect(content.hidden).toBe(true);
    expect(content.hasAttribute("role")).toBe(false);
  });

  it("does not close when close requests are prevented", async () => {
    const closeFixture = createDialogFixture();
    closeFixture.trigger.click();
    await flushDialogMicrotasks();
    closeFixture.close.addEventListener("click", (event) => event.preventDefault());
    closeFixture.close.click();
    await flushDialogMicrotasks();
    expect(closeFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const cancelFixture = createDialogFixture();
    cancelFixture.trigger.click();
    await flushDialogMicrotasks();
    cancelFixture.cancel.addEventListener("click", (event) => event.preventDefault());
    cancelFixture.cancel.click();
    await flushDialogMicrotasks();
    expect(cancelFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const actionFixture = createDialogFixture();
    actionFixture.trigger.click();
    await flushDialogMicrotasks();
    actionFixture.action.addEventListener("click", (event) => event.preventDefault());
    actionFixture.action.click();
    await flushDialogMicrotasks();
    expect(actionFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const overlayFixture = createDialogFixture();
    overlayFixture.trigger.click();
    await flushDialogMicrotasks();
    overlayFixture.overlay.addEventListener("click", (event) => event.preventDefault());
    overlayFixture.overlay.click();
    await flushDialogMicrotasks();
    expect(overlayFixture.root.open).toBe(true);
  });

  it("closes from Close, Cancel, Action, Overlay, and Escape by default", async () => {
    const closeFixture = createDialogFixture();
    closeFixture.trigger.click();
    await flushDialogMicrotasks();
    closeFixture.close.click();
    await flushDialogMicrotasks();
    expect(closeFixture.root.open).toBe(false);
    expect(closeFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const cancelFixture = createDialogFixture();
    cancelFixture.trigger.click();
    await flushDialogMicrotasks();
    cancelFixture.cancel.click();
    await flushDialogMicrotasks();
    expect(cancelFixture.root.open).toBe(false);
    expect(cancelFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const actionFixture = createDialogFixture();
    actionFixture.trigger.click();
    await flushDialogMicrotasks();
    actionFixture.action.click();
    await flushDialogMicrotasks();
    expect(actionFixture.root.open).toBe(false);
    expect(actionFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const overlayFixture = createDialogFixture();
    overlayFixture.trigger.click();
    await flushDialogMicrotasks();
    overlayFixture.overlay.click();
    await flushDialogMicrotasks();
    expect(overlayFixture.root.open).toBe(false);
    expect(overlayFixture.content.hidden).toBe(true);

    document.body.replaceChildren();
    const escapeFixture = createDialogFixture();
    escapeFixture.trigger.click();
    await flushDialogMicrotasks();
    const escapeEvent = dispatchDialogKey(escapeFixture.content, "Escape");
    await flushDialogMicrotasks();
    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(escapeFixture.root.open).toBe(false);
    expect(escapeFixture.content.hidden).toBe(true);
  });

  it("does not close when Escape is prevented by keydown or escapekeydown", async () => {
    const keydownFixture = createDialogFixture();
    keydownFixture.trigger.click();
    await flushDialogMicrotasks();
    keydownFixture.content.addEventListener("keydown", (event) => event.preventDefault());
    dispatchDialogKey(keydownFixture.content, "Escape");
    await flushDialogMicrotasks();
    expect(keydownFixture.root.open).toBe(true);

    document.body.replaceChildren();
    const escapeHookFixture = createDialogFixture();
    escapeHookFixture.trigger.click();
    await flushDialogMicrotasks();
    escapeHookFixture.content.addEventListener("escapekeydown", (event) => event.preventDefault());
    dispatchDialogKey(escapeHookFixture.content, "Escape");
    await flushDialogMicrotasks();
    expect(escapeHookFixture.root.open).toBe(true);
  });

  it("traps focus inside open Content", async () => {
    const { trigger, content, cancel, action, close, nameField } = createDialogFixture();

    trigger.click();
    await flushDialogMicrotasks();

    expect(document.activeElement).toBe(cancel);
    dispatchDialogKey(content, "Tab");
    expect(document.activeElement).toBe(action);
    dispatchDialogKey(content, "Tab");
    expect(document.activeElement).toBe(close);
    dispatchDialogKey(content, "Tab");
    expect(document.activeElement).toBe(nameField);
    dispatchDialogKey(content, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(close);
  });

  it("reports close requests without mutating controlled open state", async () => {
    const { root, trigger, content } = createDialogFixture({ open: true });
    const changes: boolean[] = [];

    root.addEventListener("openchange", (event) => {
      changes.push((event as CustomEvent).detail.open);
    });

    trigger.click();
    await flushDialogMicrotasks();

    expect(changes).toEqual([false]);
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("role")).toBe("dialog");
  });

  it("emits preventable open and close autofocus hooks", async () => {
    const { root, trigger, content, cancel } = createDialogFixture();
    const openAutoFocus = vi.fn((event: Event) => event.preventDefault());
    const closeAutoFocus = vi.fn((event: Event) => event.preventDefault());

    content.addEventListener("openautofocus", openAutoFocus);
    content.addEventListener("closeautofocus", closeAutoFocus);

    trigger.click();
    await flushDialogMicrotasks();
    expect(openAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(cancel);

    (root as unknown as { requestDialogClose(source: Element): boolean }).requestDialogClose(trigger);
    await flushDialogMicrotasks();
    expect(closeAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(trigger);
  });

  it("keeps force-mounted portal overlay and content mounted while closed", () => {
    const { portal, overlay, content } = createDialogFixture({ forceMount: true });

    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.hasAttribute("role")).toBe(false);
  });

  it("updates concatenated title and description references when content labels change", async () => {
    const { trigger, content, title, description } = createDialogFixture();
    const secondTitle = document.createElement("aria-dialog-title") as RuntimeElement;
    const secondDescription = document.createElement("aria-dialog-description") as RuntimeElement;

    secondTitle.textContent = "Second title";
    secondDescription.textContent = "Second description";
    content.append(secondTitle, secondDescription);

    trigger.click();
    await flushDialogMicrotasks();

    expect(content.getAttribute("aria-labelledby")).toBe(title.id + " " + secondTitle.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    secondTitle.remove();
    secondDescription.remove();
    await flushDialogMicrotasks();

    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
  });

  it("uses native dialog custom element hosts for root trigger portal overlay content title description action cancel and close", () => {
    const { root, trigger, portal, overlay, content, title, description, action, cancel, close } = createDialogFixture({ defaultOpen: true });

    expect(root.tagName.toLowerCase()).toBe("aria-dialog");
    expect(trigger.tagName.toLowerCase()).toBe("aria-dialog-trigger");
    expect(portal.tagName.toLowerCase()).toBe("aria-dialog-portal");
    expect(overlay.tagName.toLowerCase()).toBe("aria-dialog-overlay");
    expect(content.tagName.toLowerCase()).toBe("aria-dialog-content");
    expect(title.tagName.toLowerCase()).toBe("aria-dialog-title");
    expect(description.tagName.toLowerCase()).toBe("aria-dialog-description");
    expect(action.tagName.toLowerCase()).toBe("aria-dialog-action");
    expect(cancel.tagName.toLowerCase()).toBe("aria-dialog-cancel");
    expect(close.tagName.toLowerCase()).toBe("aria-dialog-close");
  });


});
