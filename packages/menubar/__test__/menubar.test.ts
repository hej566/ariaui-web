import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createMenubarElement, defineMenubarElements, getPartSpec, type ComponentPartName } from "../src";
import { computeMenubarPosition, positionMenubarContent, stopMenubarPositioning } from "../src/menubar-position";

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

function createMenubarFixture(options: { controlledValue?: string; dir?: "ltr" | "rtl"; loop?: boolean } = {}) {
  defineMenubarElements();
  const root = document.createElement("aria-menubar") as RuntimeElement;
  if (options.controlledValue !== undefined) root.setAttribute("value", options.controlledValue);
  if (options.dir) root.setAttribute("dir", options.dir);
  if (options.loop) root.setAttribute("loop", "");
  root.innerHTML = `
    <aria-menubar-menu value="file">
      <aria-menubar-trigger value="file">File</aria-menubar-trigger>
      <aria-menubar-content loop>
        <aria-menubar-item value="new">New Tab</aria-menubar-item>
        <aria-menubar-item value="window">New Window</aria-menubar-item>
        <aria-menubar-item disabled value="private">Private Window</aria-menubar-item>
        <aria-menubar-sub>
          <aria-menubar-sub-trigger>Share</aria-menubar-sub-trigger>
          <aria-menubar-sub-content loop>
            <aria-menubar-item value="email">Email link</aria-menubar-item>
            <aria-menubar-item value="messages">Messages</aria-menubar-item>
          </aria-menubar-sub-content>
        </aria-menubar-sub>
      </aria-menubar-content>
    </aria-menubar-menu>
    <aria-menubar-menu value="edit">
      <aria-menubar-trigger value="edit">Edit</aria-menubar-trigger>
      <aria-menubar-content loop>
        <aria-menubar-item value="undo">Undo</aria-menubar-item>
        <aria-menubar-item value="redo" text-value="repeat">Redo</aria-menubar-item>
      </aria-menubar-content>
    </aria-menubar-menu>
    <aria-menubar-menu value="view">
      <aria-menubar-trigger value="view">View</aria-menubar-trigger>
      <aria-menubar-content>
        <aria-menubar-checkbox-item value="bookmarks" checked>Always Show Bookmarks</aria-menubar-checkbox-item>
        <aria-menubar-radio-group default-value="pedro">
          <aria-menubar-radio-item value="andy">Andy</aria-menubar-radio-item>
          <aria-menubar-radio-item value="pedro">Pedro</aria-menubar-radio-item>
        </aria-menubar-radio-group>
      </aria-menubar-content>
    </aria-menubar-menu>
  `;
  document.body.append(root);
  return {
    root,
    triggers: Array.from(root.querySelectorAll<RuntimeElement>("aria-menubar-trigger")),
    contents: Array.from(root.querySelectorAll<RuntimeElement>("aria-menubar-content")),
  };
}

function keyDown(element: Element, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  element.dispatchEvent(event);
  return event;
}

function rect(left: number, top: number, width: number, height: number) {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("@ariaui-web/menubar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/menubar");
    expect(componentSpec.slug).toBe("menubar");
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

      if (documentedAttributes.includes("aria-expanded") && (part.name === "Trigger" || part.name === "SubTrigger")) {
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

      const element = createMenubarElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/menubar part");
  });

  it("defines all custom elements idempotently", () => {
    defineMenubarElements();
    defineMenubarElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineMenubarElements();
    const element = createMenubarElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("menubar");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineMenubarElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("menubar");
      expect(element.getAttribute("data-package")).toBe("menubar");
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
    defineMenubarElements();
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
    } else if (componentSpec.slug === "menubar") {
      expect(element.getAttribute("data-orientation")).toBe("horizontal");
    } else {
      expect(element.hasAttribute("data-orientation")).toBe(false);
    }
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    defineMenubarElements();

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
    defineMenubarElements();

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
    defineMenubarElements();

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

  it("applies source roles, popup linkage, orientation, and closed data state", () => {
    const { root, triggers, contents } = createMenubarFixture();

    expect(root.getAttribute("role")).toBe("menubar");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(triggers.map((trigger) => trigger.getAttribute("role"))).toEqual(["menuitem", "menuitem", "menuitem"]);
    expect(triggers.map((trigger) => trigger.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    expect(triggers[0]!.getAttribute("data-menubar-value")).toBe("file");
    expect(triggers[0]!.getAttribute("data-state")).toBe("closed");
    expect(triggers[0]!.hasAttribute("aria-controls")).toBe(false);
    expect(contents[0]!.getAttribute("role")).toBe("menu");
    expect(contents[0]!.hidden).toBe(true);
  });

  it("opens, switches, and dismisses menus while preserving source ARIA state", () => {
    const { root, triggers, contents } = createMenubarFixture();

    triggers[0]!.click();
    expect(root.value).toBe("file");
    expect(triggers[0]!.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[0]!.getAttribute("aria-controls")).toBe(contents[0]!.id);
    expect(contents[0]!.hidden).toBe(false);
    expect(contents[0]!.getAttribute("aria-labelledby")).toBe(triggers[0]!.id);
    expect(contents[0]!.getAttribute("data-side")).toBe("bottom");

    triggers[1]!.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(root.value).toBe("edit");
    expect(contents[0]!.hidden).toBe(true);
    expect(contents[1]!.hidden).toBe(false);

    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(root.value).toBe("");
    expect(contents[1]!.hidden).toBe(true);
  });

  it("anchors panels to their trigger and flips them at viewport boundaries", () => {
    expect(computeMenubarPosition(rect(100, 740, 80, 32), { width: 200, height: 180 }, { width: 800, height: 800 }, "content")).toEqual({
      align: "start",
      left: 100,
      side: "top",
      top: 555,
    });
    expect(computeMenubarPosition(rect(700, 100, 80, 32), { width: 180, height: 120 }, { width: 800, height: 800 }, "subcontent")).toEqual({
      align: "start",
      left: 518,
      side: "left",
      top: 96,
    });
    expect(computeMenubarPosition(rect(-80, -200, 80, 32), { width: 200, height: 160 }, { width: 800, height: 800 }, "content")).toEqual({
      align: "start",
      left: 8,
      side: "bottom",
      top: -163,
    });
    expect(computeMenubarPosition(rect(700, 100, 80, 32), { width: 200, height: 160 }, { width: 800, height: 800 }, "content")).toEqual({
      align: "start",
      left: 592,
      side: "bottom",
      top: 137,
    });
  });

  it("keeps an open panel anchored when its trigger moves", () => {
    const trigger = document.createElement("button");
    const content = document.createElement("div");
    document.body.append(trigger, content);
    let triggerRect = rect(100, 100, 80, 32);
    vi.spyOn(trigger, "getBoundingClientRect").mockImplementation(() => triggerRect);
    vi.spyOn(content, "getBoundingClientRect").mockReturnValue(rect(0, 0, 200, 160));
    Object.defineProperties(content, {
      offsetHeight: { configurable: true, value: 160 },
      offsetWidth: { configurable: true, value: 200 },
    });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return undefined as unknown as number;
    });

    positionMenubarContent(trigger, content, "content");
    expect(content.style.left).toBe("100px");
    expect(content.style.top).toBe("137px");

    triggerRect = rect(260, 200, 80, 32);
    window.dispatchEvent(new Event("resize"));
    expect(content.style.left).toBe("260px");
    expect(content.style.top).toBe("237px");

    triggerRect = rect(-80, -200, 80, 32);
    window.dispatchEvent(new Event("resize"));
    expect(content.style.left).toBe("8px");
    expect(content.style.top).toBe("-163px");

    stopMenubarPositioning(content);
  });

  it("navigates triggers with direction, boundaries, loop, and printable typeahead", () => {
    const { triggers } = createMenubarFixture({ loop: true });
    triggers[0]!.focus();
    keyDown(triggers[0]!, "ArrowRight");
    expect(document.activeElement).toBe(triggers[1]);
    keyDown(triggers[1]!, "End");
    expect(document.activeElement).toBe(triggers[2]);
    keyDown(triggers[2]!, "ArrowRight");
    expect(document.activeElement).toBe(triggers[0]);
    keyDown(triggers[0]!, "v");
    expect(document.activeElement).toBe(triggers[2]);

    document.body.replaceChildren();
    const rtl = createMenubarFixture({ dir: "rtl" });
    rtl.triggers[0]!.focus();
    keyDown(rtl.triggers[0]!, "ArrowLeft");
    expect(document.activeElement).toBe(rtl.triggers[1]);
  });

  it("navigates enabled menu items, typeahead text values, and submenu focus", () => {
    const { triggers, contents } = createMenubarFixture();
    keyDown(triggers[0]!, "ArrowDown");
    const fileItems = Array.from(contents[0]!.querySelectorAll<RuntimeElement>("aria-menubar-item, aria-menubar-sub-trigger"));
    expect(document.activeElement).toBe(fileItems[0]);
    keyDown(fileItems[0]!, "ArrowUp");
    expect(document.activeElement).toBe(fileItems[3]);

    keyDown(contents[0]!, "s");
    expect(document.activeElement).toBe(fileItems[3]);
    keyDown(fileItems[3]!, "ArrowRight");
    const subContent = contents[0]!.querySelector<RuntimeElement>("aria-menubar-sub-content")!;
    expect(subContent.hidden).toBe(false);
    expect(document.activeElement?.textContent?.trim()).toBe("Email link");
    keyDown(document.activeElement!, "ArrowLeft");
    expect(document.activeElement).toBe(fileItems[3]);
  });

  it("cycles shared-prefix items with repeated printable typeahead", () => {
    const { triggers, contents } = createMenubarFixture();
    triggers[0]!.click();
    const items = Array.from(contents[0]!.querySelectorAll<RuntimeElement>("aria-menubar-item"));

    items[0]!.focus();
    keyDown(items[0]!, "n");
    expect(document.activeElement).toBe(items[1]);
    keyDown(items[1]!, "n");
    expect(document.activeElement).toBe(items[0]);
  });

  it("updates checkbox and radio state before closing and emits source events", () => {
    const { root, triggers } = createMenubarFixture();
    const changes: string[] = [];
    root.addEventListener("checkedchange", () => changes.push("checked"));
    root.addEventListener("valuechange", () => changes.push("value"));
    triggers[2]!.click();
    changes.length = 0;
    const checkbox = root.querySelector<RuntimeElement>("aria-menubar-checkbox-item")!;
    checkbox.click();
    expect(checkbox.checked).toBe(false);
    expect(changes[0]).toBe("checked");
    expect(root.value).toBe("");

    triggers[2]!.click();
    const andy = root.querySelector<RuntimeElement>('aria-menubar-radio-item[value="andy"]')!;
    const pedro = root.querySelector<RuntimeElement>('aria-menubar-radio-item[value="pedro"]')!;
    andy.click();
    expect(andy.checked).toBe(true);
    expect(pedro.checked).toBe(false);
    expect(changes).toContain("value");
  });

  it("keeps controlled root value external while emitting proposed menu changes", () => {
    const { root, triggers, contents } = createMenubarFixture({ controlledValue: "file" });
    const proposed: string[] = [];
    root.addEventListener("valuechange", (event) => proposed.push((event as CustomEvent).detail.value));

    triggers[1]!.click();
    expect(proposed.at(-1)).toBe("edit");
    expect(root.value).toBe("file");
    expect(contents[0]!.hidden).toBe(false);
    expect(contents[1]!.hidden).toBe(true);

    root.value = "edit";
    expect(contents[0]!.hidden).toBe(true);
    expect(contents[1]!.hidden).toBe(false);
  });

  it("switches the open menu with Tab and Shift+Tab from a focused trigger", () => {
    const { root, triggers, contents } = createMenubarFixture();
    triggers[0]!.click();
    triggers[0]!.focus();

    const next = keyDown(triggers[0]!, "Tab");
    expect(next.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("edit");
    expect(contents[0]!.hidden).toBe(true);
    expect(contents[1]!.hidden).toBe(false);

    const previous = keyDown(triggers[1]!, "Tab", { shiftKey: true });
    expect(previous.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(triggers[0]);
    expect(root.value).toBe("file");
  });

  it("switches top-level menus with logical lateral keys from menu and submenu items", () => {
    const { root, triggers, contents } = createMenubarFixture();
    keyDown(triggers[0]!, "ArrowDown");
    const firstItem = contents[0]!.querySelector<RuntimeElement>("aria-menubar-item")!;

    keyDown(firstItem, "ArrowRight");
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("edit");

    keyDown(triggers[0]!, "ArrowDown");
    const subTrigger = contents[0]!.querySelector<RuntimeElement>("aria-menubar-sub-trigger")!;
    subTrigger.focus();
    keyDown(subTrigger, "ArrowRight");
    const subItem = contents[0]!.querySelector<RuntimeElement>("aria-menubar-sub-content aria-menubar-item")!;
    expect(document.activeElement).toBe(subItem);

    keyDown(subItem, "ArrowRight");
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("edit");
  });

  it("focuses a clicked subtrigger while hover highlighting remains non-focus-stealing", () => {
    const { triggers, contents } = createMenubarFixture();
    triggers[0]!.click();
    const subTrigger = contents[0]!.querySelector<RuntimeElement>("aria-menubar-sub-trigger")!;
    const firstItem = contents[0]!.querySelector<RuntimeElement>("aria-menubar-item")!;

    triggers[0]!.focus();
    firstItem.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(document.activeElement).toBe(triggers[0]);
    expect(firstItem.hasAttribute("data-highlighted")).toBe(true);

    subTrigger.click();
    expect(document.activeElement).toBe(subTrigger);
    expect(subTrigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("keeps the menu open when a selectable item event is prevented", () => {
    const { root, triggers, contents } = createMenubarFixture();
    triggers[0]!.click();
    const item = contents[0]!.querySelector<RuntimeElement>("aria-menubar-item")!;
    item.addEventListener("select", (event) => event.preventDefault());

    item.click();
    expect(root.value).toBe("file");
    expect(contents[0]!.hidden).toBe(false);
  });

  it("composes cancelable entry, Escape, outside, and close autofocus lifecycle events", () => {
    const { root, triggers, contents } = createMenubarFixture();
    const content = contents[0]!;
    content.addEventListener("entryfocus", (event) => event.preventDefault(), { once: true });

    triggers[0]!.focus();
    keyDown(triggers[0]!, "ArrowDown");
    expect(root.value).toBe("file");
    expect(document.activeElement).toBe(triggers[0]);

    content.addEventListener("escapekeydown", (event) => event.preventDefault(), { once: true });
    keyDown(content.querySelector("aria-menubar-item")!, "Escape");
    expect(root.value).toBe("file");

    content.addEventListener("pointerdownoutside", (event) => event.preventDefault(), { once: true });
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(root.value).toBe("file");

    const item = content.querySelector<RuntimeElement>("aria-menubar-item")!;
    content.addEventListener("closeautofocus", (event) => event.preventDefault(), { once: true });
    item.focus();
    item.click();
    expect(root.value).toBe("");
    expect(document.activeElement).toBe(item);
  });




});
