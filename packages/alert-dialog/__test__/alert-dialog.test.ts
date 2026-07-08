import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createAlertDialogElement, defineAlertDialogElements, getPartSpec, type ComponentPartName } from "../src";

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

describe("@ariaui-web/alert-dialog", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/alert-dialog");
    expect(componentSpec.slug).toBe("alert-dialog");
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

      const element = createAlertDialogElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/alert-dialog part");
  });

  it("defines all custom elements idempotently", () => {
    defineAlertDialogElements();
    defineAlertDialogElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineAlertDialogElements();
    const element = createAlertDialogElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("alert-dialog");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineAlertDialogElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("alert-dialog");
      expect(element.getAttribute("data-package")).toBe("alert-dialog");
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
    defineAlertDialogElements();
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
    defineAlertDialogElements();

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
    defineAlertDialogElements();

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
    defineAlertDialogElements();

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





  function createAlertDialogFixture(options: {
    defaultOpen?: boolean;
    disabledTrigger?: boolean;
    forceMount?: boolean;
    open?: boolean;
  } = {}) {
    defineAlertDialogElements();
    const root = document.createElement("aria-alert-dialog") as RuntimeElement;
    const trigger = document.createElement("aria-alert-dialog-trigger") as RuntimeElement;
    const portal = document.createElement("aria-alert-dialog-portal") as RuntimeElement;
    const overlay = document.createElement("aria-alert-dialog-overlay") as RuntimeElement;
    const content = document.createElement("aria-alert-dialog-content") as RuntimeElement;
    const icon = document.createElement("aria-alert-dialog-icon") as RuntimeElement;
    const title = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    const description = document.createElement("aria-alert-dialog-description") as RuntimeElement;
    const cancel = document.createElement("aria-alert-dialog-cancel") as RuntimeElement;
    const action = document.createElement("aria-alert-dialog-action") as RuntimeElement;

    trigger.textContent = "Open";
    icon.textContent = "!";
    title.textContent = "Delete item?";
    description.textContent = "This action cannot be undone.";
    cancel.textContent = "Cancel";
    action.textContent = "Delete";

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

    content.append(icon, title, description, cancel, action);
    portal.append(overlay, content);
    root.append(trigger, portal);
    document.body.append(root);

    return { root, trigger, portal, overlay, content, icon, title, description, cancel, action };
  }

  function flushAlertDialogMicrotasks() {
    return new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));
  }

  function dispatchAlertDialogKey(element: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  function wheelIsPrevented() {
    const event = new WheelEvent("wheel", { bubbles: true, cancelable: true });
    document.body.dispatchEvent(event);
    return event.defaultPrevented;
  }

  it("declares alert-dialog source defaults in componentSpec metadata", () => {
    expect(getPartSpec("Content").defaultAttributes).toMatchObject({
      "data-alert-dialog-content": "",
    });
    expect(getPartSpec("Icon").defaultAttributes).toMatchObject({
      "aria-hidden": "true",
    });
    expect(getPartSpec("Title").defaultAttributes).toMatchObject({
      "aria-level": "2",
    });
    expect(getPartSpec("Cancel").defaultAttributes).toMatchObject({
      "data-alert-dialog-cancel": "",
    });
  });

  it("matches the alert-dialog part and default semantics from the source spec", () => {
    const { root, trigger, content, icon, title, description, cancel, action } = createAlertDialogFixture({ forceMount: true });

    expect(root.hasAttribute("role")).toBe(false);
    expect(trigger.getAttribute("role")).toBe("button");
    expect(content.hasAttribute("role")).toBe(false);
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(title.getAttribute("role")).toBe("heading");
    expect(title.getAttribute("aria-level")).toBe("2");
    expect(description.hasAttribute("role")).toBe(false);
    expect(cancel.getAttribute("role")).toBe("button");
    expect(action.getAttribute("role")).toBe("button");
    expect(cancel.getAttribute("data-alert-dialog-cancel")).toBe("");
    expect(content.getAttribute("data-alert-dialog-content")).toBe("");
  });

  it("keeps content outside the alertdialog tree while closed", () => {
    const { trigger, portal, overlay, content } = createAlertDialogFixture();

    expect(document.body.querySelector("[role='alertdialog']")).toBeNull();
    expect(trigger.getAttribute("data-state")).toBe("closed");
    expect(portal.hidden).toBe(true);
    expect(overlay.hidden).toBe(true);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("closed");
  });

  it("opens from Trigger and exposes alertdialog semantics with title and description linkage", async () => {
    const { trigger, content, title, description, cancel } = createAlertDialogFixture();

    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("data-state")).toBe("open");
    expect(document.activeElement).toBe(cancel);
  });

  it("opens from Trigger keyboard activation with Enter and Space", async () => {
    const enterFixture = createAlertDialogFixture();

    enterFixture.trigger.focus();
    const enterKeyDown = dispatchAlertDialogKey(enterFixture.trigger, "Enter");
    await flushAlertDialogMicrotasks();

    expect(enterKeyDown.defaultPrevented).toBe(true);
    expect(enterFixture.root.open).toBe(true);
    expect(enterFixture.content.getAttribute("role")).toBe("alertdialog");
    expect(document.activeElement).toBe(enterFixture.cancel);

    document.body.replaceChildren();
    const spaceFixture = createAlertDialogFixture();

    spaceFixture.trigger.focus();
    const spaceKeyDown = dispatchAlertDialogKey(spaceFixture.trigger, " ");
    const spaceKeyUp = new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true });
    spaceFixture.trigger.dispatchEvent(spaceKeyUp);
    await flushAlertDialogMicrotasks();

    expect(spaceKeyDown.defaultPrevented).toBe(true);
    expect(spaceKeyUp.defaultPrevented).toBe(true);
    expect(spaceFixture.root.open).toBe(true);
    expect(spaceFixture.content.getAttribute("role")).toBe("alertdialog");
    expect(document.activeElement).toBe(spaceFixture.cancel);
  });

  it("keeps the dialog closed when Trigger click is prevented", async () => {
    const { trigger, content } = createAlertDialogFixture();
    trigger.addEventListener("click", (event) => event.preventDefault());

    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(content.hasAttribute("role")).toBe(false);
    expect(content.hidden).toBe(true);
  });

  it("supports default-open open state and controlled open state without requiring a Trigger", () => {
    const defaultOpen = createAlertDialogFixture({ defaultOpen: true });
    expect(defaultOpen.content.getAttribute("role")).toBe("alertdialog");
    expect(defaultOpen.trigger.getAttribute("data-state")).toBe("open");

    document.body.replaceChildren();
    defineAlertDialogElements();
    const controlledRoot = document.createElement("aria-alert-dialog") as RuntimeElement;
    const controlledContent = document.createElement("aria-alert-dialog-content") as RuntimeElement;
    const controlledTitle = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    controlledRoot.setAttribute("open", "");
    controlledTitle.textContent = "Controlled title";
    controlledContent.append(controlledTitle);
    controlledRoot.append(controlledContent);
    document.body.append(controlledRoot);

    expect(controlledContent.getAttribute("role")).toBe("alertdialog");
    expect(controlledContent.getAttribute("aria-labelledby")).toBe(controlledTitle.id);
    expect(controlledContent.hasAttribute("aria-describedby")).toBe(false);
  });

  it("closes from Cancel and Action and dispatches openchange before teardown", async () => {
    const { root, trigger, cancel, action, content } = createAlertDialogFixture();
    const changes: boolean[] = [];
    root.addEventListener("openchange", (event) => {
      changes.push((event as CustomEvent).detail.open);
    });

    trigger.click();
    await flushAlertDialogMicrotasks();
    cancel.click();
    await flushAlertDialogMicrotasks();

    expect(changes).toEqual([true, false]);
    expect(content.hasAttribute("role")).toBe(false);
    expect(content.hidden).toBe(true);

    trigger.click();
    await flushAlertDialogMicrotasks();
    action.click();
    await flushAlertDialogMicrotasks();

    expect(changes).toEqual([true, false, true, false]);
    expect(content.hasAttribute("role")).toBe(false);
  });

  it("keeps controlled open state rendered while reporting close requests", async () => {
    const { root, cancel, content } = createAlertDialogFixture({ open: true });
    const onOpenChange = vi.fn();
    root.addEventListener("openchange", (event) => {
      onOpenChange((event as CustomEvent).detail.open);
    });

    cancel.click();
    await flushAlertDialogMicrotasks();

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(root.open).toBe(true);
    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.hidden).toBe(false);
  });

  it("keeps the dialog open when Cancel or Action click is prevented", async () => {
    const { cancel, action, content } = createAlertDialogFixture({ defaultOpen: true });
    cancel.addEventListener("click", (event) => event.preventDefault());
    action.addEventListener("click", (event) => event.preventDefault());

    cancel.click();
    await flushAlertDialogMicrotasks();
    expect(content.getAttribute("role")).toBe("alertdialog");

    action.click();
    await flushAlertDialogMicrotasks();
    expect(content.getAttribute("role")).toBe("alertdialog");
  });

  it("closes on Escape while allowing keydown and escape-close prevention", async () => {
    const first = createAlertDialogFixture({ defaultOpen: true });
    dispatchAlertDialogKey(first.content, "Enter");
    await flushAlertDialogMicrotasks();
    expect(first.content.getAttribute("role")).toBe("alertdialog");

    dispatchAlertDialogKey(first.content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(first.content.hasAttribute("role")).toBe(false);

    document.body.replaceChildren();
    const keydownPrevented = createAlertDialogFixture({ defaultOpen: true });
    keydownPrevented.content.addEventListener("keydown", (event) => event.preventDefault());
    dispatchAlertDialogKey(keydownPrevented.content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(keydownPrevented.content.getAttribute("role")).toBe("alertdialog");

    document.body.replaceChildren();
    const escapePrevented = createAlertDialogFixture({ defaultOpen: true });
    escapePrevented.content.addEventListener("escapekeydown", (event) => event.preventDefault());
    dispatchAlertDialogKey(escapePrevented.content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(escapePrevented.content.getAttribute("role")).toBe("alertdialog");
  });

  it("traps focus within the open dialog and restores focus to the trigger on close", async () => {
    const { trigger, content, cancel, action } = createAlertDialogFixture();

    trigger.focus();
    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(document.activeElement).toBe(cancel);
    dispatchAlertDialogKey(cancel, "Tab");
    expect(document.activeElement).toBe(action);
    dispatchAlertDialogKey(action, "Tab");
    expect(document.activeElement).toBe(cancel);
    dispatchAlertDialogKey(cancel, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(action);

    dispatchAlertDialogKey(content, "Escape");
    await flushAlertDialogMicrotasks();
    expect(document.activeElement).toBe(trigger);
  });

  it("does not restore focus to a disabled trigger", async () => {
    const { trigger, content } = createAlertDialogFixture({ defaultOpen: true, disabledTrigger: true });

    expect(trigger.disabled).toBe(true);
    dispatchAlertDialogKey(content, "Escape");
    await flushAlertDialogMicrotasks();

    expect(document.activeElement).not.toBe(trigger);
  });

  it("falls back to body focus when closing without a Trigger", async () => {
    defineAlertDialogElements();
    const root = document.createElement("aria-alert-dialog") as RuntimeElement;
    const content = document.createElement("aria-alert-dialog-content") as RuntimeElement;
    const title = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    const cancel = document.createElement("aria-alert-dialog-cancel") as RuntimeElement;

    root.setAttribute("default-open", "");
    title.textContent = "Delete item?";
    cancel.textContent = "Cancel";
    content.append(title, cancel);
    root.append(content);
    document.body.append(root);
    await flushAlertDialogMicrotasks();

    expect(document.activeElement).toBe(cancel);
    dispatchAlertDialogKey(content, "Escape");
    await flushAlertDialogMicrotasks();

    expect(content.hasAttribute("role")).toBe(false);
    expect(document.activeElement).toBe(document.body);
  });

  it("allows open and close autofocus to be prevented", async () => {
    const openFixture = createAlertDialogFixture();
    const openAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
    });
    openFixture.content.addEventListener("openautofocus", openAutoFocus);

    openFixture.trigger.click();
    await flushAlertDialogMicrotasks();

    expect(openAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(openFixture.cancel);

    document.body.replaceChildren();
    const closeFixture = createAlertDialogFixture();
    const closeAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
    });
    closeFixture.content.addEventListener("closeautofocus", closeAutoFocus);
    closeFixture.trigger.focus();
    closeFixture.trigger.click();
    await flushAlertDialogMicrotasks();
    closeFixture.cancel.click();
    await flushAlertDialogMicrotasks();

    expect(closeAutoFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(closeFixture.trigger);
  });

  it("supports force-mounted closed portal overlay and content state", async () => {
    const { trigger, portal, overlay, content } = createAlertDialogFixture({ forceMount: true });

    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(overlay.getAttribute("data-state")).toBe("closed");
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.hasAttribute("role")).toBe(false);

    trigger.click();
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("open");
    expect(content.hidden).toBe(false);
  });

  it("uses unique ids and concatenated labelling for multiple titles and descriptions", async () => {
    const { content, title, description } = createAlertDialogFixture({ defaultOpen: true });
    const secondTitle = document.createElement("aria-alert-dialog-title") as RuntimeElement;
    const secondDescription = document.createElement("aria-alert-dialog-description") as RuntimeElement;
    secondTitle.textContent = "Secondary title";
    secondDescription.textContent = "Secondary description";
    content.insertBefore(secondTitle, description);
    content.append(secondDescription);
    await flushAlertDialogMicrotasks();

    expect(new Set([title.id, secondTitle.id]).size).toBe(2);
    expect(new Set([description.id, secondDescription.id]).size).toBe(2);
    expect(content.getAttribute("aria-labelledby")).toBe(title.id + " " + secondTitle.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    secondTitle.remove();
    await flushAlertDialogMicrotasks();
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);

    title.remove();
    await flushAlertDialogMicrotasks();
    expect(content.hasAttribute("aria-labelledby")).toBe(false);
    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    description.remove();
    secondDescription.remove();
    await flushAlertDialogMicrotasks();
    expect(content.hasAttribute("aria-describedby")).toBe(false);
  });

  it("keeps remaining description linkage when one of multiple descriptions unmounts", async () => {
    const { content, description } = createAlertDialogFixture({ defaultOpen: true });
    const secondDescription = document.createElement("aria-alert-dialog-description") as RuntimeElement;
    secondDescription.textContent = "Secondary description";
    content.append(secondDescription);
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("aria-describedby")).toBe(description.id + " " + secondDescription.id);

    description.remove();
    await flushAlertDialogMicrotasks();

    expect(content.getAttribute("aria-describedby")).toBe(secondDescription.id);
  });

  it("marks background content inert while open and keeps it inert until the last dialog closes", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);
    const first = createAlertDialogFixture({ defaultOpen: true });
    const second = createAlertDialogFixture({ defaultOpen: true });
    await flushAlertDialogMicrotasks();

    expect(outside.hasAttribute("inert")).toBe(true);
    first.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(outside.hasAttribute("inert")).toBe(true);

    second.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(outside.hasAttribute("inert")).toBe(false);
  });

  it("locks viewport scroll while open and unlocks after the last dialog closes", async () => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "scroll";
    document.documentElement.style.overflow = "auto";

    expect(wheelIsPrevented()).toBe(false);

    const first = createAlertDialogFixture({ defaultOpen: true });
    const second = createAlertDialogFixture({ defaultOpen: true });
    await flushAlertDialogMicrotasks();

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(wheelIsPrevented()).toBe(true);
    const contentWheel = new WheelEvent("wheel", { bubbles: true, cancelable: true });
    first.content.dispatchEvent(contentWheel);
    expect(contentWheel.defaultPrevented).toBe(false);

    first.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(wheelIsPrevented()).toBe(true);

    second.cancel.click();
    await flushAlertDialogMicrotasks();
    expect(wheelIsPrevented()).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.documentElement.style.overflow).toBe("auto");

    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
  });

  it("uses native Portal host placement instead of framework portal relocation", () => {
    const { root, portal, overlay, content } = createAlertDialogFixture({ defaultOpen: true });

    expect(root.contains(portal)).toBe(true);
    expect(portal.contains(overlay)).toBe(true);
    expect(portal.contains(content)).toBe(true);
    expect(overlay.parentElement).toBe(portal);
    expect(content.parentElement).toBe(portal);
    expect(document.body.contains(root)).toBe(true);
    expect(document.body.contains(overlay)).toBe(true);
    expect(document.body.contains(content)).toBe(true);
  });

  it("uses native alert-dialog custom element hosts for root trigger portal overlay content title description action and cancel", () => {
    const { root, trigger, portal, overlay, content, title, description, action, cancel } = createAlertDialogFixture({ defaultOpen: true });

    expect(root.tagName.toLowerCase()).toBe("aria-alert-dialog");
    expect(trigger.tagName.toLowerCase()).toBe("aria-alert-dialog-trigger");
    expect(portal.tagName.toLowerCase()).toBe("aria-alert-dialog-portal");
    expect(overlay.tagName.toLowerCase()).toBe("aria-alert-dialog-overlay");
    expect(content.tagName.toLowerCase()).toBe("aria-alert-dialog-content");
    expect(title.tagName.toLowerCase()).toBe("aria-alert-dialog-title");
    expect(description.tagName.toLowerCase()).toBe("aria-alert-dialog-description");
    expect(action.tagName.toLowerCase()).toBe("aria-alert-dialog-action");
    expect(cancel.tagName.toLowerCase()).toBe("aria-alert-dialog-cancel");
  });

});
