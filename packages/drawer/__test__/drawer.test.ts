import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createDrawerElement, defineDrawerElements, getPartSpec, type ComponentPartName } from "../src";

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
type DrawerFixtureOptions = {
  contentNativeComposition?: boolean;
  defaultOpen?: boolean;
  forceMount?: boolean;
  open?: boolean;
  overlayNativeComposition?: boolean;
  side?: "top" | "right" | "bottom" | "left";
};
type DrawerFixture = {
  action: RuntimeElement;
  cancel: RuntimeElement;
  close: RuntimeElement;
  content: RuntimeElement;
  contentHost: HTMLElement;
  description: RuntimeElement;
  firstInput: HTMLInputElement;
  overlay: RuntimeElement;
  overlayHost: HTMLElement;
  portal: RuntimeElement;
  root: RuntimeElement;
  secondInput: HTMLInputElement;
  title: RuntimeElement;
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

function createDrawerFixture(options: DrawerFixtureOptions = {}): DrawerFixture {
  defineDrawerElements();
  const root = document.createElement("aria-drawer") as RuntimeElement;
  const trigger = document.createElement("aria-drawer-trigger") as RuntimeElement;
  const portal = document.createElement("aria-drawer-portal") as RuntimeElement;
  const overlay = document.createElement("aria-drawer-overlay") as RuntimeElement;
  const overlayHost = options.overlayNativeComposition ? document.createElement("div") : overlay;
  const content = document.createElement("aria-drawer-content") as RuntimeElement;
  const contentHost = options.contentNativeComposition ? document.createElement("div") : content;
  const header = document.createElement("aria-drawer-header") as RuntimeElement;
  const title = document.createElement("aria-drawer-title") as RuntimeElement;
  const description = document.createElement("aria-drawer-description") as RuntimeElement;
  const firstInput = document.createElement("input");
  const secondInput = document.createElement("input");
  const footer = document.createElement("aria-drawer-footer") as RuntimeElement;
  const cancel = document.createElement("aria-drawer-cancel") as RuntimeElement;
  const action = document.createElement("aria-drawer-action") as RuntimeElement;
  const close = document.createElement("aria-drawer-close") as RuntimeElement;

  trigger.textContent = "Open Drawer";
  overlayHost.textContent = "Overlay";
  title.textContent = "Edit profile";
  description.textContent = "Make changes to your profile here.";
  firstInput.id = "drawer-test-name";
  firstInput.value = "Pedro Duarte";
  secondInput.id = "drawer-test-username";
  secondInput.value = "@peduarte";
  cancel.textContent = "Cancel";
  action.textContent = "Save changes";
  close.textContent = "Close";
  content.className = "local-content";
  overlay.className = "local-overlay";

  if (options.defaultOpen) root.setAttribute("default-open", "");
  if (options.open) root.setAttribute("open", "");
  if (options.forceMount) {
    portal.setAttribute("force-mount", "");
    overlay.setAttribute("force-mount", "");
    content.setAttribute("force-mount", "");
  }
  if (options.side) content.setAttribute("side", options.side);
  if (options.overlayNativeComposition) {
    overlay.setAttribute("native-composition", "");
    overlayHost.setAttribute("data-motion-overlay", "");
    overlay.append(overlayHost);
  }
  if (options.contentNativeComposition) {
    content.setAttribute("native-composition", "");
    contentHost.setAttribute("data-motion-content", "");
    content.append(contentHost);
  }

  header.append(title, description);
  contentHost.append(header, firstInput, secondInput, footer, close);
  footer.append(cancel, action);
  portal.append(overlay, content);
  root.append(trigger, portal);
  document.body.append(root);
  return { action, cancel, close, content, contentHost, description, firstInput, overlay, overlayHost, portal, root, secondInput, title, trigger };
}

async function flushDrawerMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

function dispatchDrawerKey(element: Element, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  element.dispatchEvent(event);
  if (key === " ") element.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true, ...init }));
  return event;
}

function wheelOn(element: Element) {
  const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 50 });
  element.dispatchEvent(event);
  return event;
}

describe("@ariaui-web/drawer", () => {
  afterEach(() => {
    document.body.replaceChildren();
    document.body.style.overflow = "";
    vi.restoreAllMocks();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/drawer");
    expect(componentSpec.slug).toBe("drawer");
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

      if (documentedAttributes.includes("aria-expanded") && part.defaultRole && expandableRoles.has(part.defaultRole) && part.name === "Trigger") {
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

      const element = createDrawerElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/drawer part");
  });

  it("defines all custom elements idempotently", () => {
    defineDrawerElements();
    defineDrawerElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineDrawerElements();
    const element = createDrawerElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("drawer");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineDrawerElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("drawer");
      expect(element.getAttribute("data-package")).toBe("drawer");
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
    defineDrawerElements();
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
    defineDrawerElements();

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
    defineDrawerElements();

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
    defineDrawerElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }

      if (role === "button" && !["Action", "Cancel", "Close", "Trigger"].includes(part.name)) {
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

  it("tracks source parity metadata for the Drawer contract", () => {
    expect(componentSpec.sourceTestParity).toMatchObject({
      sourceTestCases: 19,
      learningSources: ["../ariaui/packages/drawer/__test__/drawer.test.tsx"],
    });
    expect(componentSpec.sourceTestParity.nativeRequirements).toEqual(expect.arrayContaining([
      "controlled and uncontrolled open-state behavior",
      "Trigger opens the drawer and respects prevented clicks",
      "Close, Cancel, Action, Overlay, and Escape dismissal paths",
      "focus moves into Content, traps with Tab, and restores on close",
      "body scroll is locked while open and restored when closed",
      "Content native-composition slots dialog props onto a custom host",
      "Overlay native-composition slots backdrop props onto a custom host",
      "side attributes reflect `top`, `right`, `bottom`, and `left` on Content",
    ]));
  });

  it("renders closed by default and opens from default-open", () => {
    const closed = createDrawerFixture();
    expect(closed.root.open).toBe(false);
    expect(closed.root.getAttribute("data-state")).toBe("closed");
    expect(closed.portal.hidden).toBe(true);
    expect(closed.overlay.hidden).toBe(true);
    expect(closed.content.hidden).toBe(true);
    expect(closed.content.getAttribute("aria-hidden")).toBe("true");
    expect(closed.content.hasAttribute("role")).toBe(false);
    expect(closed.trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("false");
    expect(closed.trigger.getAttribute("data-state")).toBe("closed");

    document.body.replaceChildren();
    const open = createDrawerFixture({ defaultOpen: true });
    expect(open.root.open).toBe(true);
    expect(open.portal.hidden).toBe(false);
    expect(open.overlay.hidden).toBe(false);
    expect(open.content.getAttribute("role")).toBe("dialog");
    expect(open.content.getAttribute("aria-modal")).toBe("true");
    expect(open.content.getAttribute("data-side")).toBe("bottom");
    expect(open.trigger.getAttribute("aria-expanded")).toBe("true");
    expect(open.trigger.getAttribute("aria-controls")).toBe(open.content.id);
  });

  it("opens from Trigger click Enter and Space while respecting prevented and disabled activation", async () => {
    const { root, trigger, content } = createDrawerFixture();
    const changes: boolean[] = [];
    trigger.addEventListener("click", vi.fn());
    root.addEventListener("openchange", (event) => changes.push((event as CustomEvent<{ open: boolean }>).detail.open));
    trigger.click();
    await flushDrawerMicrotasks();
    expect(changes).toEqual([true]);
    expect(root.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.hidden).toBe(false);
    expect(document.activeElement).toBe(content.querySelector("input"));

    root.open = false;
    await flushDrawerMicrotasks();
    dispatchDrawerKey(trigger, "Enter");
    await flushDrawerMicrotasks();
    expect(root.open).toBe(true);

    root.open = false;
    await flushDrawerMicrotasks();
    dispatchDrawerKey(trigger, " ");
    await flushDrawerMicrotasks();
    expect(root.open).toBe(true);

    document.body.replaceChildren();
    const prevented = createDrawerFixture();
    prevented.trigger.addEventListener("click", (event) => event.preventDefault());
    prevented.trigger.click();
    await flushDrawerMicrotasks();
    expect(prevented.root.open).toBe(false);

    document.body.replaceChildren();
    const disabled = createDrawerFixture();
    disabled.trigger.disabled = true;
    disabled.trigger.click();
    await flushDrawerMicrotasks();
    expect(disabled.root.open).toBe(false);
  });

  it("closes through Close Cancel Action Overlay and Escape with preventable dismissal hooks", async () => {
    const { action, cancel, close, content, overlay, root, trigger } = createDrawerFixture({ defaultOpen: true });
    const changes: boolean[] = [];
    root.addEventListener("openchange", (event) => changes.push((event as CustomEvent<{ open: boolean }>).detail.open));
    close.click();
    await flushDrawerMicrotasks();
    expect(root.open).toBe(false);
    expect(changes).toEqual([false]);

    for (const closer of [cancel, action, overlay]) {
      trigger.click();
      await flushDrawerMicrotasks();
      closer.click();
      await flushDrawerMicrotasks();
      expect(root.open).toBe(false);
    }

    trigger.click();
    await flushDrawerMicrotasks();
    dispatchDrawerKey(content, "Escape");
    await flushDrawerMicrotasks();
    expect(root.open).toBe(false);

    trigger.click();
    await flushDrawerMicrotasks();
    close.addEventListener("click", (event) => event.preventDefault(), { once: true });
    close.click();
    await flushDrawerMicrotasks();
    expect(root.open).toBe(true);

    overlay.addEventListener("interactoutside", (event) => event.preventDefault(), { once: true });
    overlay.click();
    await flushDrawerMicrotasks();
    expect(root.open).toBe(true);

    content.addEventListener("escapekeydown", (event) => event.preventDefault(), { once: true });
    dispatchDrawerKey(content, "Escape");
    await flushDrawerMicrotasks();
    expect(root.open).toBe(true);

    action.addEventListener("click", (event) => event.preventDefault(), { once: true });
    action.click();
    await flushDrawerMicrotasks();
    expect(root.open).toBe(true);
  });

  it("keeps controlled-style open roots visible while reporting close requests", async () => {
    const { cancel, content, root } = createDrawerFixture({ open: true });
    const changes: boolean[] = [];
    root.addEventListener("openchange", (event) => changes.push((event as CustomEvent<{ open: boolean }>).detail.open));
    cancel.click();
    await flushDrawerMicrotasks();
    expect(changes).toEqual([false]);
    expect(root.open).toBe(true);
    expect(content.hidden).toBe(false);
  });

  it("traps focus inside Content and restores focus to Trigger on close", async () => {
    const { action, cancel, close, content, firstInput, root, secondInput, trigger } = createDrawerFixture();
    trigger.focus();
    trigger.click();
    await flushDrawerMicrotasks();
    expect(document.activeElement).toBe(firstInput);
    dispatchDrawerKey(content, "Tab");
    expect(document.activeElement).toBe(secondInput);
    dispatchDrawerKey(content, "Tab");
    expect(document.activeElement).toBe(cancel);
    dispatchDrawerKey(content, "Tab");
    expect(document.activeElement).toBe(action);
    dispatchDrawerKey(content, "Tab");
    expect(document.activeElement).toBe(close);
    dispatchDrawerKey(content, "Tab");
    expect(document.activeElement).toBe(firstInput);
    dispatchDrawerKey(content, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(close);
    dispatchDrawerKey(content, "Escape");
    await flushDrawerMicrotasks();
    expect(root.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("locks viewport scroll while open and allows scrolling inside drawer content", async () => {
    const background = document.createElement("button");
    document.body.append(background);
    const { content, root, trigger } = createDrawerFixture();
    expect(wheelOn(document.body).defaultPrevented).toBe(false);
    trigger.click();
    await flushDrawerMicrotasks();
    expect(document.body.style.overflow).toBe("hidden");
    expect(wheelOn(background).defaultPrevented).toBe(true);
    expect(wheelOn(content).defaultPrevented).toBe(false);
    background.focus();
    for (const key of ["PageDown", "PageUp", "ArrowDown", "ArrowUp", "End", "Home", " "]) {
      expect(dispatchDrawerKey(background, key).defaultPrevented).toBe(true);
    }
    root.open = false;
    await flushDrawerMicrotasks();
    expect(document.body.style.overflow).toBe("");
    expect(wheelOn(background).defaultPrevented).toBe(false);
  });

  it("wires dialog ids, side state, and action metadata", () => {
    const { action, cancel, content, description, title } = createDrawerFixture({ defaultOpen: true, side: "left" });
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-side")).toBe("left");
    expect(content.hasAttribute("data-direction")).toBe(false);
    expect(title.getAttribute("aria-level")).toBe("2");
    expect(cancel.getAttribute("data-drawer-cancel")).toBe("");
    expect(action.getAttribute("data-drawer-action")).toBe("");
    expect(cancel.getAttribute("type")).toBe("button");
    expect(action.getAttribute("type")).toBe("button");
  });

  it("slots Content and Overlay metadata onto native-composition child hosts", () => {
    const { content, contentHost, firstInput, overlay, overlayHost, secondInput, trigger } = createDrawerFixture({
      contentNativeComposition: true,
      defaultOpen: true,
      overlayNativeComposition: true,
      side: "right",
    });
    expect(contentHost.getAttribute("data-motion-content")).toBe("");
    expect(contentHost.getAttribute("data-drawer-content")).toBe("");
    expect(contentHost.getAttribute("role")).toBe("dialog");
    expect(contentHost.getAttribute("aria-modal")).toBe("true");
    expect(contentHost.getAttribute("data-side")).toBe("right");
    expect(contentHost.className).toContain("local-content");
    expect(contentHost.id).toBe(trigger.getAttribute("aria-controls"));
    expect(contentHost.hasAttribute("native-composition")).toBe(false);
    expect(content.getAttribute("role")).toBeNull();
    expect(overlayHost.getAttribute("data-motion-overlay")).toBe("");
    expect(overlayHost.getAttribute("data-state")).toBe("open");
    expect(overlayHost.className).toContain("local-overlay");
    expect(overlay.hasAttribute("native-composition")).toBe(true);
    expect(overlayHost.hasAttribute("native-composition")).toBe(false);
    firstInput.focus();
    dispatchDrawerKey(contentHost, "Tab");
    expect(document.activeElement).toBe(secondInput);
  });

  it("keeps force-mounted overlay and content present while closed for exit animation", () => {
    const { content, overlay, portal } = createDrawerFixture({ forceMount: true });
    expect(portal.hidden).toBe(false);
    expect(overlay.hidden).toBe(false);
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("data-state")).toBe("closed");
  });




});
