import { afterEach, describe, expect, it, vi } from "vitest";
import { createRadioElement, defineRadioElements } from "../src";

type RadioRoot = HTMLElement & {
  defaultValue: string;
  disabled: boolean;
  value: string;
};
type RadioItem = HTMLElement & { disabled: boolean; value: string };

function setupRadio(
  options: {
    controlledValue?: string;
    defaultValue?: string;
    disabled?: boolean;
  } = {},
) {
  defineRadioElements();
  const root = document.createElement("aria-radio") as RadioRoot;
  root.setAttribute("aria-label", "Density");
  if (options.controlledValue !== undefined)
    root.setAttribute("value", options.controlledValue);
  if (options.defaultValue !== undefined)
    root.setAttribute("default-value", options.defaultValue);
  if (options.disabled) root.setAttribute("disabled", "");

  const values = ["default", "comfortable", "compact"];
  const items = values.map((value) => {
    const item = document.createElement("aria-radio-item") as RadioItem;
    item.value = value;
    item.textContent = value;
    const indicator = document.createElement("aria-radio-indicator");
    item.prepend(indicator);
    root.append(item);
    return item;
  });
  document.body.append(root);
  return {
    indicators: items.map(
      (item) => item.querySelector<HTMLElement>("aria-radio-indicator")!,
    ),
    items,
    root,
  };
}

function keyDown(element: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key,
  });
  element.dispatchEvent(event);
  return event;
}

function pressSpace(element: HTMLElement) {
  const event = keyDown(element, " ");
  element.dispatchEvent(
    new KeyboardEvent("keyup", { bubbles: true, cancelable: true, key: " " }),
  );
  return event;
}

describe("@ariaui-web/radio", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("defines source-equivalent Root, Item, and Indicator elements", () => {
    defineRadioElements();
    defineRadioElements();
    expect(createRadioElement("Root").tagName).toBe("ARIA-RADIO");
    expect(createRadioElement("Item").tagName).toBe("ARIA-RADIO-ITEM");
    expect(createRadioElement("Indicator").tagName).toBe(
      "ARIA-RADIO-INDICATOR",
    );
    expect(customElements.get("aria-radio")).toBeTruthy();
  });

  it("renders radiogroup and radio semantics with generated item ids", () => {
    const { items, root } = setupRadio();
    expect(root.getAttribute("role")).toBe("radiogroup");
    expect(root.getAttribute("aria-label")).toBe("Density");
    expect(items.every((item) => item.getAttribute("role") === "radio")).toBe(
      true,
    );
    expect(
      items.every((item) => item.id.startsWith("ariaui-radio-item-")),
    ).toBe(true);
  });

  it("initializes uncontrolled selection from default-value", () => {
    const { indicators, items, root } = setupRadio({
      defaultValue: "comfortable",
    });
    expect(root.value).toBe("comfortable");
    expect(items.map((item) => item.getAttribute("aria-checked"))).toEqual([
      "false",
      "true",
      "false",
    ]);
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual([
      "unchecked",
      "checked",
      "unchecked",
    ]);
    expect(items.map((item) => item.tabIndex)).toEqual([-1, 0, -1]);
    expect(
      indicators.map((indicator) => indicator.getAttribute("data-state")),
    ).toEqual(["unchecked", "checked", "unchecked"]);
    expect(root.getAttribute("aria-activedescendant")).toBe(items[1]?.id);
  });

  it("uses the first enabled item as the tab stop when nothing is selected", () => {
    const { items } = setupRadio();
    items[0]!.disabled = true;
    expect(items.map((item) => item.tabIndex)).toEqual([-1, 0, -1]);
    expect(items.map((item) => item.getAttribute("aria-checked"))).toEqual([
      "false",
      "false",
      "false",
    ]);
  });

  it("selects and focuses an enabled item on click", () => {
    const { items, root } = setupRadio({ defaultValue: "default" });
    const changes: string[] = [];
    root.addEventListener("valuechange", (event) => {
      changes.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    items[2]!.click();

    expect(root.value).toBe("compact");
    expect(items.map((item) => item.getAttribute("aria-checked"))).toEqual([
      "false",
      "false",
      "true",
    ]);
    expect(document.activeElement).toBe(items[2]);
    expect(changes).toEqual(["compact"]);
  });

  it("dispatches controlled changes without mutating the controlled value", () => {
    const { items, root } = setupRadio({ controlledValue: "default" });
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);

    items[1]!.click();

    expect(root.value).toBe("default");
    expect(items[0]?.getAttribute("aria-checked")).toBe("true");
    expect(items[1]?.getAttribute("aria-checked")).toBe("false");
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      value: "comfortable",
    });

    root.value = "comfortable";
    expect(items[1]?.getAttribute("aria-checked")).toBe("true");
  });

  it("moves focus and selection with arrows, wraps, and skips disabled items", () => {
    const { items, root } = setupRadio({ defaultValue: "default" });
    items[1]!.disabled = true;
    items[0]!.focus();

    expect(keyDown(items[0]!, "ArrowDown").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[2]);
    expect(root.value).toBe("compact");

    keyDown(items[2]!, "ArrowRight");
    expect(document.activeElement).toBe(items[0]);
    expect(root.value).toBe("default");

    keyDown(items[0]!, "ArrowUp");
    expect(document.activeElement).toBe(items[2]);
    expect(root.value).toBe("compact");

    keyDown(items[2]!, "ArrowLeft");
    expect(document.activeElement).toBe(items[0]);
  });

  it("selects the focused item with Space and Enter", () => {
    const { items, root } = setupRadio();
    items[1]!.focus();
    expect(pressSpace(items[1]!).defaultPrevented).toBe(true);
    expect(root.value).toBe("comfortable");

    items[2]!.focus();
    expect(keyDown(items[2]!, "Enter").defaultPrevented).toBe(true);
    expect(root.value).toBe("compact");
  });

  it("blocks item and group disabled activation and reflects disabled state", () => {
    const itemSetup = setupRadio();
    itemSetup.items[0]!.disabled = true;
    itemSetup.items[0]!.click();
    expect(itemSetup.root.value).toBe("");
    expect(itemSetup.items[0]?.getAttribute("aria-disabled")).toBe("true");
    expect(itemSetup.indicators[0]?.hasAttribute("data-disabled")).toBe(true);

    document.body.replaceChildren();
    const groupSetup = setupRadio({ disabled: true });
    groupSetup.items[1]!.click();
    expect(groupSetup.root.value).toBe("");
    expect(groupSetup.root.hasAttribute("data-disabled")).toBe(true);
    expect(
      groupSetup.items.every(
        (item) => item.getAttribute("aria-disabled") === "true",
      ),
    ).toBe(true);
    expect(groupSetup.items.every((item) => item.tabIndex === -1)).toBe(true);
  });

  it("emits one required hidden input for the checked named item", () => {
    const { items } = setupRadio({ defaultValue: "default" });
    for (const item of items) item.setAttribute("name", "density");
    items[0]!.setAttribute("required", "");

    let inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>("input[type='hidden']"),
    );
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toMatchObject({
      name: "density",
      required: true,
      value: "default",
    });

    items[2]!.click();
    inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>("input[type='hidden']"),
    );
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toMatchObject({
      name: "density",
      required: false,
      value: "compact",
    });
  });

  it("preserves a user-provided id and aria-activedescendant override", () => {
    defineRadioElements();
    const root = document.createElement("aria-radio") as RadioRoot;
    root.setAttribute("default-value", "custom");
    root.setAttribute("aria-activedescendant", "external-active");
    const item = document.createElement("aria-radio-item") as RadioItem;
    item.id = "custom-radio-id";
    item.value = "custom";
    root.append(item);
    document.body.append(root);

    expect(item.id).toBe("custom-radio-id");
    expect(root.getAttribute("aria-activedescendant")).toBe("external-active");
  });

  it("activates items from associated labels", () => {
    const { items, root } = setupRadio();
    items[1]!.id = "density-comfortable";
    const label = document.createElement("label");
    label.htmlFor = items[1]!.id;
    label.textContent = "Comfortable";
    root.append(label);

    label.click();

    expect(root.value).toBe("comfortable");
    expect(document.activeElement).toBe(items[1]);
  });

  it("synchronizes dynamically added items and indicators", async () => {
    const { root } = setupRadio({ defaultValue: "compact" });
    const item = document.createElement("aria-radio-item") as RadioItem;
    item.value = "later";
    root.append(item);
    const indicator = document.createElement("aria-radio-indicator");
    item.append(indicator);
    root.value = "later";
    await Promise.resolve();

    expect(item.getAttribute("aria-checked")).toBe("true");
    expect(indicator.getAttribute("data-state")).toBe("checked");
    expect(root.getAttribute("aria-activedescendant")).toBe(item.id);
  });

  it("keeps an Item outside Root inert", () => {
    defineRadioElements();
    const item = document.createElement("aria-radio-item") as RadioItem;
    item.value = "orphan";
    document.body.append(item);
    item.click();
    expect(item.hasAttribute("checked")).toBe(false);
    expect(item.getAttribute("aria-checked")).toBe("false");
  });
});
