import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineToggleElements } from "../src";

type ToggleRoot = HTMLElement & {
  control: HTMLButtonElement;
  defaultPressed: boolean;
  onPressedChange: ((pressed: boolean) => void) | null;
  pressed: boolean;
};

function setupToggle(attributes: Record<string, string | boolean> = {}) {
  defineToggleElements();
  const root = document.createElement("aria-toggle") as ToggleRoot;
  for (const [name, value] of Object.entries(attributes)) {
    if (value === true) root.setAttribute(name, "");
    else if (value !== false) root.setAttribute(name, String(value));
  }
  document.body.append(root);
  return root;
}

describe("@ariaui-web/toggle upstream parity", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("uses defaultPressed for uncontrolled state", async () => {
    const root = setupToggle({ "aria-label": "Bold", "default-pressed": true });
    const changes: boolean[] = [];
    root.addEventListener("pressedchange", (event) => changes.push((event as CustomEvent<{ pressed: boolean }>).detail.pressed));

    expect(root.control).toBeInstanceOf(HTMLButtonElement);
    expect(root.control.type).toBe("button");
    expect(root.control.getAttribute("aria-pressed")).toBe("true");
    expect(root.control.dataset.state).toBe("on");

    root.control.click();
    await Promise.resolve();

    expect(changes).toEqual([false]);
    expect(root.pressed).toBe(false);
    expect(root.control.getAttribute("aria-pressed")).toBe("false");
    expect(root.control.dataset.state).toBe("off");
  });

  it("keeps pressed controlled by the pressed property", async () => {
    const root = setupToggle({ "aria-label": "Italic" });
    const onPressedChange = vi.fn();
    root.pressed = true;
    root.onPressedChange = onPressedChange;

    root.control.click();
    await Promise.resolve();

    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(root.pressed).toBe(true);
    expect(root.control.getAttribute("aria-pressed")).toBe("true");
    expect(root.control.dataset.state).toBe("on");
  });

  it("does not toggle or notify when disabled", async () => {
    const root = setupToggle({ "aria-label": "Underline", "default-pressed": true, disabled: true });
    const onPressedChange = vi.fn();
    root.onPressedChange = onPressedChange;

    expect(root.control.disabled).toBe(true);
    expect(root.control.hasAttribute("data-disabled")).toBe(true);
    root.control.click();
    await Promise.resolve();

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(root.pressed).toBe(true);
    expect(root.control.getAttribute("aria-pressed")).toBe("true");
  });

  it("does not toggle when a consumer click listener prevents default", async () => {
    const root = setupToggle({ "aria-label": "Strike" });
    const onPressedChange = vi.fn();
    root.onPressedChange = onPressedChange;
    root.addEventListener("click", (event) => event.preventDefault());

    root.control.click();
    await Promise.resolve();

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(root.pressed).toBe(false);
    expect(root.control.getAttribute("aria-pressed")).toBe("false");
    expect(root.control.dataset.state).toBe("off");
  });

  it("has no accessibility violations", async () => {
    const main = document.createElement("main");
    main.append(setupToggle({ "aria-label": "Bold" }));
    document.body.append(main);
    expect((await axe(main)).violations).toEqual([]);
  });
});
