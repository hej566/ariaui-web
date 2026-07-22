import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineToggleGroupElements } from "../src";

type ToggleValue = string | string[] | null;
type ToggleGroupRoot = HTMLElement & {
  defaultValue: ToggleValue;
  mode: "single" | "multiple";
  onActiveChange: ((active: boolean[]) => void) | null;
  onValueChange: ((value: ToggleValue) => void) | null;
  value: ToggleValue;
};
type ToggleGroupItem = HTMLElement & {
  control: HTMLButtonElement;
  isActive: boolean;
  value: string;
};

function press(target: HTMLElement, key: string, code = key) {
  target.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, code, key }));
}

function createItem(label: string, options: { active?: boolean | undefined; disabled?: boolean | undefined; value?: string | undefined } = {}) {
  const item = document.createElement("aria-toggle-group-item") as ToggleGroupItem;
  item.textContent = label;
  if (options.active) item.isActive = true;
  if (options.disabled) item.setAttribute("disabled", "");
  if (options.value) item.setAttribute("value", options.value);
  return item;
}

function setupGroup(options: {
  active?: boolean[];
  adjacent?: boolean;
  defaultValue?: ToggleValue;
  disabled?: boolean[];
  mode?: "single" | "multiple";
  nested?: boolean;
  onActiveChange?: (active: boolean[]) => void;
  onValueChange?: (value: ToggleValue) => void;
  values?: string[];
  value?: ToggleValue;
} = {}) {
  defineToggleGroupElements();
  const root = document.createElement("aria-toggle-group") as ToggleGroupRoot;
  root.mode = options.mode ?? "multiple";
  if ("defaultValue" in options) root.defaultValue = options.defaultValue ?? null;
  if ("value" in options) root.value = options.value ?? null;
  if (options.onActiveChange) root.onActiveChange = options.onActiveChange;
  if (options.onValueChange) root.onValueChange = options.onValueChange;

  const items = [
    createItem("Item 0", { active: options.active?.[0], disabled: options.disabled?.[0], value: options.values?.[0] }),
    createItem("Item 1", { active: options.active?.[1], disabled: options.disabled?.[1], value: options.values?.[1] }),
    createItem("Item 2", { active: options.active?.[2], disabled: options.disabled?.[2], value: options.values?.[2] }),
  ] as [ToggleGroupItem, ToggleGroupItem, ToggleGroupItem];
  for (const item of items) {
    if (options.nested) {
      const wrapper = document.createElement("div");
      wrapper.append(item);
      root.append(wrapper);
    } else {
      root.append(item);
    }
  }

  if (options.adjacent) document.body.append(document.createElement("button"));
  document.body.append(root);
  if (options.adjacent) document.body.append(document.createElement("button"));
  return {
    buttons: items.map((item) => item.control) as [HTMLButtonElement, HTMLButtonElement, HTMLButtonElement],
    items,
    root,
  };
}

describe("@ariaui-web/toggle-group upstream parity", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("toggles items independently in multiple mode", async () => {
    const { buttons } = setupGroup();
    buttons[0].click();
    await Promise.resolve();
    expect(buttons.map((button) => button.dataset.active)).toEqual(["true", "false", "false"]);
    buttons[2].click();
    await Promise.resolve();
    expect(buttons.map((button) => button.dataset.active)).toEqual(["true", "false", "true"]);
  });

  it("deactivates other items in single mode", async () => {
    const { buttons } = setupGroup({ mode: "single", active: [true, false, false] });
    buttons[2].click();
    await Promise.resolve();
    expect(buttons.map((button) => button.dataset.active)).toEqual(["false", "false", "true"]);
    buttons[2].click();
    await Promise.resolve();
    expect(buttons.map((button) => button.dataset.active)).toEqual(["false", "false", "false"]);
  });

  it("calls onActiveChange with the projected next state", async () => {
    const onActiveChange = vi.fn();
    const { buttons } = setupGroup({ onActiveChange });
    buttons[1].click();
    await Promise.resolve();
    buttons[1].click();
    await Promise.resolve();
    expect(onActiveChange).toHaveBeenNthCalledWith(1, [false, true, false]);
    expect(onActiveChange).toHaveBeenNthCalledWith(2, [false, false, false]);
  });

  it("supports controlled multiple value state", async () => {
    const onValueChange = vi.fn();
    const { buttons } = setupGroup({ values: ["bold", "italic", "underline"], value: ["bold"], onValueChange });
    expect(buttons.map((button) => button.dataset.active)).toEqual(["true", "false", "false"]);
    buttons[1].click();
    await Promise.resolve();
    expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"]);
    expect(buttons.map((button) => button.dataset.active)).toEqual(["true", "false", "false"]);
  });

  it("supports uncontrolled multiple value state with defaultValue", async () => {
    const onValueChange = vi.fn();
    const onActiveChange = vi.fn();
    const { buttons } = setupGroup({
      values: ["bold", "italic", "underline"],
      defaultValue: ["italic"],
      onValueChange,
      onActiveChange,
    });
    expect(buttons.map((button) => button.dataset.active)).toEqual(["false", "true", "false"]);
    buttons[2].click();
    await Promise.resolve();
    expect(onValueChange).toHaveBeenCalledWith(["italic", "underline"]);
    expect(onActiveChange).toHaveBeenCalledWith([false, true, true]);
    expect(buttons.map((button) => button.dataset.active)).toEqual(["false", "true", "true"]);
  });

  it("supports a string defaultValue in multiple value state", async () => {
    const { buttons } = setupGroup({ values: ["bold", "italic", "underline"], defaultValue: "bold" });
    expect(buttons[0].dataset.active).toBe("true");
    buttons[0].click();
    await Promise.resolve();
    expect(buttons[0].dataset.active).toBe("false");
  });

  it("reflects item value properties used by declarative renderers", () => {
    defineToggleGroupElements();
    const root = document.createElement("aria-toggle-group") as ToggleGroupRoot;
    root.mode = "single";
    root.defaultValue = "all";
    const all = createItem("All");
    const missed = createItem("Missed");
    all.value = "all";
    missed.value = "missed";
    root.append(all, missed);
    document.body.append(root);

    expect(all.getAttribute("value")).toBe("all");
    expect(all.control.dataset.active).toBe("true");
    expect(missed.control.dataset.active).toBe("false");
  });

  it("keeps an id fallback stable after moving it to the native button", async () => {
    defineToggleGroupElements();
    const root = document.createElement("aria-toggle-group") as ToggleGroupRoot;
    root.mode = "single";
    root.defaultValue = "left";
    const item = createItem("Left");
    item.id = "left";
    root.append(item);
    document.body.append(root);

    expect(item.control.id).toBe("left");
    expect(item.control.dataset.active).toBe("true");
    item.control.click();
    await Promise.resolve();
    expect(root.value).toBeNull();
    expect(item.control.dataset.active).toBe("false");
  });

  it("supports controlled single value state", async () => {
    const onValueChange = vi.fn();
    const { buttons } = setupGroup({ mode: "single", values: ["bold", "italic", "underline"], value: "bold", onValueChange });
    buttons[1].click();
    await Promise.resolve();
    expect(onValueChange).toHaveBeenCalledWith("italic");
    buttons[0].click();
    await Promise.resolve();
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(buttons[0].dataset.active).toBe("true");
  });

  it("uses the first array value in single value state", () => {
    const { buttons } = setupGroup({ mode: "single", values: ["bold", "italic", "underline"], defaultValue: ["bold", "italic"] });
    expect(buttons.map((button) => button.dataset.active)).toEqual(["true", "false", "false"]);
  });

  it("registers items when they are wrapped", async () => {
    const { buttons } = setupGroup({ nested: true, disabled: [false, true, false] });
    expect(buttons.map((button) => button.tabIndex)).toEqual([0, -1, -1]);
    buttons[2].click();
    await Promise.resolve();
    expect(buttons[2].dataset.active).toBe("true");
  });

  it("renders Root as a group wrapper", () => {
    const { root } = setupGroup();
    expect(root.getAttribute("role")).toBe("group");
    expect(root.querySelectorAll("aria-toggle-group-item")).toHaveLength(3);
  });

  it("uses roving tabindex and skips disabled items initially", () => {
    const { buttons } = setupGroup({ disabled: [true, false, false] });
    expect(buttons.map((button) => button.tabIndex)).toEqual([-1, 0, -1]);
    expect(buttons[0].disabled).toBe(true);
  });

  it("keeps an all-disabled group out of the roving tab stop", () => {
    const { buttons } = setupGroup({ disabled: [true, true, true] });
    expect(buttons.every((button) => button.disabled && button.tabIndex === -1)).toBe(true);
  });

  it("moves focus with arrow keys and skips disabled items", async () => {
    const { buttons } = setupGroup({ disabled: [false, true, false] });
    buttons[0].focus();
    press(buttons[0], "ArrowRight");
    expect(document.activeElement).toBe(buttons[2]);
    press(buttons[2], "ArrowRight");
    expect(document.activeElement).toBe(buttons[0]);
    press(buttons[0], "ArrowLeft");
    expect(document.activeElement).toBe(buttons[2]);
  });

  it("moves focus to the first and last enabled item with Home and End", async () => {
    const { buttons } = setupGroup({ disabled: [false, true, false] });
    buttons[0].focus();
    press(buttons[0], "End");
    expect(document.activeElement).toBe(buttons[2]);
    press(buttons[2], "Home");
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("activates the focused item on Enter and Space", async () => {
    const { buttons } = setupGroup();
    buttons[1].focus();
    press(buttons[1], "Enter");
    await Promise.resolve();
    expect(buttons[1].dataset.active).toBe("true");
    press(buttons[1], " ", "Space");
    await Promise.resolve();
    expect(buttons[1].dataset.active).toBe("false");
  });

  it("allows Tab and Shift+Tab to move into and out of the group", () => {
    const { buttons } = setupGroup({ adjacent: true, disabled: [true, false, false] });
    const [before, after] = Array.from(document.body.querySelectorAll<HTMLButtonElement>(":scope > button")) as [HTMLButtonElement, HTMLButtonElement];
    expect(before.tabIndex).toBe(0);
    expect(buttons.map((button) => button.tabIndex)).toEqual([-1, 0, -1]);
    expect(after.tabIndex).toBe(0);
  });

  it("reflects active, disabled, label, and aria-pressed state", () => {
    const { buttons } = setupGroup({ active: [false, true, false], disabled: [false, false, true] });
    expect(buttons[0].getAttribute("aria-label")).toBe("toggle-item-0");
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
    expect(buttons[1].getAttribute("data-active")).toBe("true");
    expect(buttons[1].getAttribute("aria-pressed")).toBe("true");
    expect(buttons[2].disabled).toBe(true);
  });

  it("has no accessibility violations", async () => {
    const { root } = setupGroup();
    expect((await axe(root)).violations).toEqual([]);
  });

  it("keeps an Item outside Root inert until it is registered", async () => {
    defineToggleGroupElements();
    const item = createItem("Detached");
    document.body.append(item);
    item.control.click();
    await Promise.resolve();
    expect(item.control.dataset.active).toBe("false");
    const { root } = setupGroup();
    root.append(item);
    await Promise.resolve();
    item.control.click();
    await Promise.resolve();
    expect(item.control.dataset.active).toBe("true");
  });

  it("ignores removed items in value-driven mode", async () => {
    const onValueChange = vi.fn();
    const { items, buttons } = setupGroup({ values: ["known", "other", "last"], value: "known", mode: "single", onValueChange });
    const removedButton = buttons[1];
    items[1].remove();
    await Promise.resolve();
    removedButton.click();
    await Promise.resolve();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("recovers roving focus when the focused item is removed", async () => {
    const { items, buttons } = setupGroup();
    buttons[1].focus();
    items[1].remove();
    await Promise.resolve();
    buttons[0].focus();
    press(buttons[0], "ArrowRight");
    expect(document.activeElement).toBe(buttons[2]);
  });

  it("supports an empty Root without navigation errors", () => {
    defineToggleGroupElements();
    const root = document.createElement("aria-toggle-group");
    document.body.append(root);
    expect(() => root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))).not.toThrow();
    expect(root.getAttribute("role")).toBe("group");
  });
});
