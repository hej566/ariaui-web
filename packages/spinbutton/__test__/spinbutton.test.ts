import { afterEach, describe, expect, it, vi } from "vitest";
import { createSpinbuttonElement, defineSpinbuttonElements } from "../src";

type SpinbuttonRoot = HTMLElement & {
  defaultValue: string;
  disabled: boolean;
  value: string;
};

function setupSpinbutton(options: {
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  step?: number;
  value?: number;
} = {}) {
  defineSpinbuttonElements();
  const root = document.createElement("aria-spinbutton") as SpinbuttonRoot;
  root.setAttribute("aria-label", "Quantity");
  if (options.defaultValue !== undefined) root.setAttribute("default-value", String(options.defaultValue));
  if (options.value !== undefined) root.setAttribute("value", String(options.value));
  if (options.min !== undefined) root.setAttribute("min", String(options.min));
  if (options.max !== undefined) root.setAttribute("max", String(options.max));
  if (options.step !== undefined) root.setAttribute("step", String(options.step));
  if (options.disabled) root.setAttribute("disabled", "");

  const decrement = document.createElement("aria-spinbutton-decrement");
  decrement.textContent = "Decrease";
  const input = document.createElement("aria-spinbutton-input");
  const increment = document.createElement("aria-spinbutton-increment");
  increment.textContent = "Increase";
  root.append(decrement, input, increment);
  document.body.append(root);
  return { decrement, increment, input, root };
}

function keyDown(element: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

describe("@ariaui-web/spinbutton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("defines source-equivalent Root, Decrement, Increment, and Input elements", () => {
    defineSpinbuttonElements();
    defineSpinbuttonElements();
    expect(createSpinbuttonElement("Root").tagName).toBe("ARIA-SPINBUTTON");
    expect(createSpinbuttonElement("Decrement").tagName).toBe("ARIA-SPINBUTTON-DECREMENT");
    expect(createSpinbuttonElement("Increment").tagName).toBe("ARIA-SPINBUTTON-INCREMENT");
    expect(createSpinbuttonElement("Input").tagName).toBe("ARIA-SPINBUTTON-INPUT");
  });

  it("renders the upstream role, focus, and button contracts", () => {
    const { decrement, increment, input, root } = setupSpinbutton({ defaultValue: 10, min: 0, max: 100 });
    expect(root.getAttribute("role")).toBe("group");
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("tabindex")).toBe("0");
    expect(input.getAttribute("aria-valuenow")).toBe("10");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("100");
    expect(input.textContent).toBe("10");
    expect(decrement.getAttribute("role")).toBe("button");
    expect(increment.getAttribute("role")).toBe("button");
    expect(decrement.getAttribute("tabindex")).toBe("-1");
    expect(increment.getAttribute("tabindex")).toBe("-1");
    expect(decrement.hasAttribute("aria-controls")).toBe(false);
  });

  it("defaults to an explicit min or zero and exposes safe integer bounds", () => {
    const first = setupSpinbutton({ min: 5 });
    expect(first.root.value).toBe("5");
    expect(first.input.getAttribute("aria-valuenow")).toBe("5");
    document.body.replaceChildren();
    const second = setupSpinbutton();
    expect(second.root.value).toBe("0");
    expect(second.input.getAttribute("aria-valuemin")).toBe(String(Number.MIN_SAFE_INTEGER));
    expect(second.input.getAttribute("aria-valuemax")).toBe(String(Number.MAX_SAFE_INTEGER));
  });

  it("increments and decrements uncontrolled values with custom steps", () => {
    const { decrement, increment, input, root } = setupSpinbutton({ defaultValue: 10, step: 5 });
    const values: number[] = [];
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent<{ value: number }>).detail.value));
    increment.click();
    decrement.click();
    expect(values).toEqual([15, 10]);
    expect(root.value).toBe("10");
    expect(input.getAttribute("aria-valuenow")).toBe("10");
  });

  it("dispatches controlled values without mutating the authored value", () => {
    const { increment, input, root } = setupSpinbutton({ value: 5 });
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);
    increment.click();
    expect(root.value).toBe("5");
    expect(input.getAttribute("aria-valuenow")).toBe("5");
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ value: 6 });
    root.value = "6";
    expect(input.getAttribute("aria-valuenow")).toBe("6");
  });

  it("clamps values and automatically disables controls at bounds", () => {
    const { decrement, increment, input, root } = setupSpinbutton({ defaultValue: 0, min: 0, max: 2 });
    expect(decrement.hasAttribute("disabled")).toBe(true);
    decrement.click();
    expect(root.value).toBe("0");
    increment.click();
    increment.click();
    expect(root.value).toBe("2");
    expect(input.getAttribute("aria-valuenow")).toBe("2");
    expect(increment.hasAttribute("disabled")).toBe(true);
    increment.click();
    expect(root.value).toBe("2");
  });

  it("supports Arrow, Home, End, PageUp, and PageDown keyboard commands", () => {
    const { input, root } = setupSpinbutton({ defaultValue: 10, min: 0, max: 100, step: 3 });
    expect(keyDown(input, "ArrowUp").defaultPrevented).toBe(true);
    keyDown(input, "ArrowDown");
    keyDown(input, "PageUp");
    expect(root.value).toBe("40");
    keyDown(input, "PageDown");
    expect(root.value).toBe("10");
    keyDown(input, "End");
    expect(root.value).toBe("100");
    keyDown(input, "Home");
    expect(root.value).toBe("0");
    expect(keyDown(input, "Tab").defaultPrevented).toBe(false);
  });

  it("propagates disabled state and ignores all interactions", () => {
    const { decrement, increment, input, root } = setupSpinbutton({ defaultValue: 5, disabled: true });
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);
    increment.click();
    decrement.click();
    keyDown(input, "ArrowUp");
    expect(root.value).toBe("5");
    expect(listener).not.toHaveBeenCalled();
    expect(input.getAttribute("aria-disabled")).toBe("true");
    expect(input.getAttribute("tabindex")).toBe("-1");
    expect(increment.hasAttribute("disabled")).toBe(true);
    expect(decrement.hasAttribute("disabled")).toBe(true);
    expect(root.hasAttribute("data-disabled")).toBe(true);
  });

  it("preserves authored Input content while updating ARIA state", () => {
    defineSpinbuttonElements();
    const root = document.createElement("aria-spinbutton") as SpinbuttonRoot;
    root.setAttribute("default-value", "2");
    const input = document.createElement("aria-spinbutton-input");
    input.textContent = "Two guests";
    root.append(input);
    document.body.append(root);
    expect(input.textContent).toBe("Two guests");
    expect(input.getAttribute("aria-valuenow")).toBe("2");
    keyDown(input, "ArrowUp");
    expect(input.textContent).toBe("Two guests");
    expect(input.getAttribute("aria-valuenow")).toBe("3");
  });

  it("formats aria-valuetext from native prefix and suffix attributes", () => {
    const { input, root } = setupSpinbutton({ defaultValue: 2 });
    root.setAttribute("value-text-prefix", "Guests: ");
    root.setAttribute("value-text-suffix", " total");
    expect(input.getAttribute("aria-valuetext")).toBe("Guests: 2 total");
    keyDown(input, "ArrowUp");
    expect(input.getAttribute("aria-valuetext")).toBe("Guests: 3 total");
  });

  it("respects a canceled control click before applying its default action", async () => {
    const { increment, root } = setupSpinbutton({ defaultValue: 5 });
    increment.addEventListener("click", (event) => event.preventDefault());
    increment.click();
    await Promise.resolve();
    expect(root.value).toBe("5");
  });
});
