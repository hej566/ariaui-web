import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { createTabsElement, defineTabsElements } from "../src";

type TabsRoot = HTMLElement & { defaultValue: string; orientation: string; value: string };
type TabsTrigger = HTMLElement & { disabled: boolean; value: string };

function setupTabs(options: {
  controlledValue?: string;
  defaultValue?: string;
  disabled?: string[];
  native?: boolean;
  orientation?: "horizontal" | "vertical";
} = {}) {
  defineTabsElements();
  const root = document.createElement("aria-tabs") as TabsRoot;
  if (options.controlledValue !== undefined) root.setAttribute("value", options.controlledValue);
  if (options.defaultValue !== undefined) root.setAttribute("default-value", options.defaultValue);
  if (options.orientation) root.setAttribute("orientation", options.orientation);

  const list = document.createElement("aria-tabs-list");
  const panel = document.createElement("aria-tabs-panel");
  const values = ["account", "password", "settings"];
  const triggers = values.map((value) => {
    const trigger = document.createElement("aria-tabs-trigger") as TabsTrigger;
    trigger.value = value;
    trigger.disabled = options.disabled?.includes(value) ?? false;
    if (options.native) {
      trigger.setAttribute("native-composition", "");
      const button = document.createElement("button");
      button.textContent = value;
      trigger.append(button);
    } else {
      trigger.textContent = value;
    }
    list.append(trigger);
    return trigger;
  });
  const contents = values.map((value) => {
    const content = document.createElement("aria-tabs-content");
    content.setAttribute("value", value);
    content.textContent = `${value} content`;
    panel.append(content);
    return content;
  });
  root.append(list, panel);
  document.body.append(root);
  return { contents, list, panel, root, triggers };
}

function keyDown(element: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

describe("@ariaui-web/tabs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("defines the five source-equivalent parts idempotently", () => {
    defineTabsElements();
    defineTabsElements();
    expect(createTabsElement("Root").tagName).toBe("ARIA-TABS");
    expect(createTabsElement("List").tagName).toBe("ARIA-TABS-LIST");
    expect(createTabsElement("Trigger").tagName).toBe("ARIA-TABS-TRIGGER");
    expect(createTabsElement("Panel").tagName).toBe("ARIA-TABS-PANEL");
    expect(createTabsElement("Content").tagName).toBe("ARIA-TABS-CONTENT");
  });

  it("initializes selection from default-value and coordinates tabpanel semantics", () => {
    const { contents, list, panel, root, triggers } = setupTabs({ defaultValue: "password" });
    expect(root.value).toBe("password");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(list.getAttribute("role")).toBe("tablist");
    expect(list.getAttribute("aria-orientation")).toBe("horizontal");
    expect(panel.hasAttribute("role")).toBe(false);
    expect(triggers.map((trigger) => trigger.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    expect(triggers.map((trigger) => trigger.tabIndex)).toEqual([-1, 0, -1]);
    expect(contents.map((content) => content.getAttribute("role"))).toEqual(["tabpanel", "tabpanel", "tabpanel"]);
    expect(contents.map((content) => content.hidden)).toEqual([true, false, true]);
    expect(triggers[1]!.getAttribute("aria-controls")).toBe(contents[1]!.id);
    expect(contents[1]!.getAttribute("aria-labelledby")).toBe(triggers[1]!.id);
  });

  it("selects a tab on click and dispatches an additive valuechange event", () => {
    const { contents, root, triggers } = setupTabs({ defaultValue: "account" });
    const clickListener = vi.fn();
    const changeListener = vi.fn();
    triggers[2]!.addEventListener("click", clickListener);
    root.addEventListener("valuechange", changeListener);
    triggers[2]!.click();
    expect(root.value).toBe("settings");
    expect(triggers[2]!.getAttribute("aria-selected")).toBe("true");
    expect(contents.map((content) => content.hidden)).toEqual([true, true, false]);
    expect(clickListener).toHaveBeenCalledOnce();
    expect((changeListener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ value: "settings" });
  });

  it("dispatches controlled changes without mutating the controlled value", () => {
    const { root, triggers } = setupTabs({ controlledValue: "account" });
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);
    triggers[1]!.click();
    expect(root.value).toBe("account");
    expect(triggers[0]!.getAttribute("aria-selected")).toBe("true");
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ value: "password" });
    root.value = "password";
    expect(triggers[1]!.getAttribute("aria-selected")).toBe("true");
  });

  it("uses horizontal arrows with wrapping and automatic activation", () => {
    const { root, triggers } = setupTabs({ defaultValue: "account" });
    triggers[0]!.focus();
    expect(keyDown(triggers[0]!, "ArrowRight").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("password");
    keyDown(triggers[1]!, "ArrowLeft");
    expect(document.activeElement).toBe(triggers[0]);
    keyDown(triggers[0]!, "ArrowLeft");
    expect(document.activeElement).toBe(triggers[2]);
    expect(root.value).toBe("settings");
  });

  it("moves to the first and last enabled tab with Home and End", () => {
    const { root, triggers } = setupTabs({ defaultValue: "password", disabled: ["account"] });
    keyDown(triggers[1]!, "End");
    expect(document.activeElement).toBe(triggers[2]);
    expect(root.value).toBe("settings");
    keyDown(triggers[2]!, "Home");
    expect(document.activeElement).toBe(triggers[1]);
    expect(root.value).toBe("password");
  });

  it("uses vertical arrows only when orientation is vertical", () => {
    const { list, root, triggers } = setupTabs({ defaultValue: "account", orientation: "vertical" });
    expect(list.getAttribute("aria-orientation")).toBe("vertical");
    expect(keyDown(triggers[0]!, "ArrowRight").defaultPrevented).toBe(false);
    expect(root.value).toBe("account");
    expect(keyDown(triggers[0]!, "ArrowDown").defaultPrevented).toBe(true);
    expect(root.value).toBe("password");
    keyDown(triggers[1]!, "ArrowUp");
    expect(root.value).toBe("account");
  });

  it("blocks disabled tabs, skips them during navigation, and repairs disabled selection", () => {
    const { root, triggers } = setupTabs({ defaultValue: "account", disabled: ["password"] });
    triggers[1]!.click();
    expect(root.value).toBe("account");
    expect(triggers[1]!.getAttribute("aria-disabled")).toBe("true");
    expect(triggers[1]!.tabIndex).toBe(-1);
    keyDown(triggers[0]!, "ArrowRight");
    expect(root.value).toBe("settings");
    triggers[2]!.disabled = true;
    expect(root.value).toBe("account");
  });

  it("preserves keyed selection on insertion and falls back when the active tab is removed", async () => {
    const { list, panel, root, triggers } = setupTabs({ defaultValue: "password" });
    const insertedTrigger = document.createElement("aria-tabs-trigger");
    insertedTrigger.setAttribute("value", "profile");
    const insertedContent = document.createElement("aria-tabs-content");
    insertedContent.setAttribute("value", "profile");
    list.prepend(insertedTrigger);
    panel.prepend(insertedContent);
    await Promise.resolve();
    expect(root.value).toBe("password");
    expect(triggers[1]!.getAttribute("aria-selected")).toBe("true");
    triggers[1]!.remove();
    await Promise.resolve();
    expect(root.value).toBe("profile");
  });

  it("keeps nested tab roots independent", () => {
    const outer = setupTabs({ defaultValue: "account" });
    const inner = setupTabs({ defaultValue: "password" });
    outer.contents[0]!.append(inner.root);
    inner.triggers[2]!.click();
    expect(inner.root.value).toBe("settings");
    expect(outer.root.value).toBe("account");
  });

  it("slots trigger semantics and roving focus onto a native child", () => {
    const { root, triggers } = setupTabs({ defaultValue: "account", native: true });
    const buttons = triggers.map((trigger) => trigger.firstElementChild as HTMLButtonElement);
    expect(triggers[0]!.hasAttribute("role")).toBe(false);
    expect(buttons.map((button) => button.getAttribute("role"))).toEqual(["tab", "tab", "tab"]);
    expect(buttons.map((button) => button.tabIndex)).toEqual([0, -1, -1]);
    keyDown(buttons[0]!, "ArrowRight");
    expect(document.activeElement).toBe(buttons[1]);
    expect(root.value).toBe("password");
  });

  it("forwards consumer attributes for Root, List, Trigger, and Content composition", () => {
    defineTabsElements();
    const root = document.createElement("aria-tabs");
    root.setAttribute("native-composition", "");
    root.setAttribute("default-value", "first");
    root.setAttribute("class", "root-prop");
    root.setAttribute("data-slot-prop", "root");
    root.innerHTML = `
      <section class="root-child">
        <aria-tabs-list native-composition class="list-prop" data-slot-prop="list">
          <nav class="list-child">
            <aria-tabs-trigger native-composition value="first" class="trigger-prop" data-slot-prop="trigger"><button class="trigger-child">First</button></aria-tabs-trigger>
          </nav>
        </aria-tabs-list>
        <aria-tabs-panel>
          <aria-tabs-content native-composition value="first" class="content-prop" data-slot-prop="content"><section class="content-child">First panel</section></aria-tabs-content>
        </aria-tabs-panel>
      </section>
    `;
    document.body.append(root);
    const rootChild = root.firstElementChild as HTMLElement;
    const listChild = root.querySelector("nav")!;
    const triggerChild = root.querySelector("button")!;
    const contentChild = root.querySelector("aria-tabs-content > section")!;
    expect(rootChild.classList.contains("root-prop")).toBe(true);
    expect(rootChild.getAttribute("data-slot-prop")).toBe("root");
    expect(listChild.classList.contains("list-prop")).toBe(true);
    expect(listChild.getAttribute("role")).toBe("tablist");
    expect(triggerChild.classList.contains("trigger-prop")).toBe(true);
    expect(triggerChild.getAttribute("role")).toBe("tab");
    expect(contentChild.classList.contains("content-prop")).toBe(true);
    expect(contentChild.getAttribute("role")).toBe("tabpanel");
  });

  it("keeps part state synchronized after reconnecting", () => {
    const setup = setupTabs({ defaultValue: "account" });
    setup.root.remove();
    setup.root.setAttribute("value", "settings");
    document.body.append(setup.root);
    expect(setup.triggers[2]!.getAttribute("aria-selected")).toBe("true");
  });

  it("has no basic accessibility violations", async () => {
    const { root } = setupTabs({ defaultValue: "account" });
    root.setAttribute("aria-label", "Account settings");
    const result = await axe(root);
    expect(result.violations).toEqual([]);
  });
});
