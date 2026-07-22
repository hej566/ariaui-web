import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineTooltipElements } from "../src";

type TooltipRoot = HTMLElement & {
  defaultOpen: boolean;
  offset: number;
  onOpenChange: ((open: boolean) => void) | null;
  open: boolean;
  placement: string;
};

type TooltipTrigger = HTMLElement & {
  control: HTMLElement | null;
  focus: boolean;
  hover: boolean;
};

type TooltipContent = HTMLElement & {
  control: HTMLElement | null;
};

function tick() {
  return new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(resolve)));
}

function enter(element: Element) {
  element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
}

function leave(element: Element, relatedTarget: EventTarget | null = document.body) {
  element.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false, relatedTarget }));
}

function setup(options: {
  arrow?: boolean;
  contentNative?: HTMLElement;
  defaultOpen?: boolean;
  focus?: boolean;
  hover?: boolean;
  offset?: number;
  open?: boolean;
  placement?: string;
  triggerNative?: HTMLElement;
} = {}) {
  defineTooltipElements();
  const root = document.createElement("aria-tooltip") as TooltipRoot;
  if (options.placement) root.setAttribute("placement", options.placement);
  if (options.offset != null) root.setAttribute("offset", String(options.offset));
  if (options.defaultOpen) root.setAttribute("default-open", "");
  if (options.open != null) root.toggleAttribute("open", options.open);

  const trigger = document.createElement("aria-tooltip-trigger") as TooltipTrigger;
  if (options.hover === false) trigger.setAttribute("hover", "false");
  if (options.focus === false) trigger.setAttribute("focus", "false");
  if (options.triggerNative) {
    trigger.setAttribute("native-composition", "");
    trigger.append(options.triggerNative);
  } else {
    trigger.textContent = "Hover me";
  }

  const content = document.createElement("aria-tooltip-content") as TooltipContent;
  if (options.arrow) content.setAttribute("arrow", "");
  if (options.contentNative) {
    content.setAttribute("native-composition", "");
    content.append(options.contentNative);
  } else {
    content.textContent = "Tooltip content";
  }
  root.append(trigger, content);
  document.body.append(root);
  return { content, contentControl: content.control ?? content, root, trigger, triggerControl: trigger.control ?? trigger };
}

describe("@ariaui-web/tooltip upstream parity", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("renders the trigger button", () => {
    const { triggerControl } = setup();
    expect(triggerControl).toBeInstanceOf(HTMLButtonElement);
    expect(triggerControl.textContent).toBe("Hover me");
  });

  it("does not expose content initially", () => {
    const { contentControl } = setup();
    expect(contentControl.hidden).toBe(true);
  });

  it("shows tooltip on mouse enter", async () => {
    const { contentControl, root, triggerControl } = setup();
    enter(triggerControl);
    await tick();
    expect(root.open).toBe(true);
    expect(contentControl.hidden).toBe(false);
  });

  it("hides tooltip on mouse leave", async () => {
    const { contentControl, triggerControl } = setup();
    enter(triggerControl);
    leave(triggerControl);
    await tick();
    expect(contentControl.hidden).toBe(true);
  });

  it("reveals directly on the flipped side when the requested side overflows", async () => {
    const { contentControl, triggerControl } = setup({ placement: "top" });
    vi.spyOn(triggerControl, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 2, 80, 32));
    vi.spyOn(contentControl, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 120, 40));
    enter(triggerControl);
    await tick();
    expect(contentControl.dataset.side).toBe("bottom");
    expect(contentControl.style.visibility).toBe("visible");
  });

  it("positions against the viewport instead of a clipped parent", async () => {
    const clipped = document.createElement("div");
    clipped.style.overflow = "hidden";
    document.body.append(clipped);
    const { contentControl, root, triggerControl } = setup({ placement: "bottom", offset: 8 });
    clipped.append(root);
    vi.spyOn(triggerControl, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 100, 120, 32));
    vi.spyOn(contentControl, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 220, 40));
    enter(triggerControl);
    await tick();
    expect(contentControl.dataset.side).toBe("bottom");
    expect(contentControl.style.position).toBe("fixed");
  });

  it("shows tooltip on focus", async () => {
    const { contentControl, triggerControl } = setup();
    triggerControl.focus();
    await tick();
    expect(contentControl.hidden).toBe(false);
  });

  it("hides tooltip on blur", async () => {
    const { contentControl, triggerControl } = setup();
    triggerControl.focus();
    triggerControl.blur();
    await tick();
    expect(contentControl.hidden).toBe(true);
  });

  it("does not show tooltip when open is false", () => {
    const { contentControl, root } = setup({ open: false });
    expect(root.open).toBe(false);
    expect(contentControl.hidden).toBe(true);
  });

  it("shows tooltip when open is true", () => {
    const { contentControl } = setup({ open: true });
    expect(contentControl.hidden).toBe(false);
  });

  it("toggles tooltip via external control", async () => {
    const { contentControl, root } = setup();
    root.open = true;
    await tick();
    expect(contentControl.hidden).toBe(false);
    root.open = false;
    await tick();
    expect(contentControl.hidden).toBe(true);
  });

  it("keeps the tooltip visible after content changes while open", async () => {
    const { contentControl } = setup({ open: true });
    contentControl.textContent = "Updated";
    await tick();
    expect(contentControl.hidden).toBe(false);
    expect(contentControl.textContent).toBe("Updated");
  });

  it("renders content when defaultOpen is true", () => {
    const { contentControl, root } = setup({ defaultOpen: true });
    expect(root.open).toBe(true);
    expect(contentControl.hidden).toBe(false);
  });

  it("renders content with role tooltip", () => {
    const { contentControl } = setup({ open: true });
    expect(contentControl.getAttribute("role")).toBe("tooltip");
  });

  it("links trigger to tooltip content via aria-describedby", () => {
    const { contentControl, triggerControl } = setup({ open: true });
    expect(contentControl.id).not.toBe("");
    expect(triggerControl.getAttribute("aria-describedby")).toBe(contentControl.id);
  });

  it("renders children content", () => {
    const { contentControl } = setup({ open: true });
    expect(contentControl.textContent).toContain("Tooltip content");
  });

  it("applies a custom class", () => {
    const { content, contentControl } = setup({ open: true });
    content.className = "custom-tooltip";
    expect(contentControl.classList.contains("custom-tooltip")).toBe(true);
  });

  it("applies custom styles", () => {
    const { contentControl } = setup({ open: true });
    contentControl.style.backgroundColor = "red";
    expect(contentControl.style.backgroundColor).toBe("red");
  });

  it("uses native-composition content as the positioned tooltip element", () => {
    const child = document.createElement("div");
    child.className = "motion-child";
    const { contentControl } = setup({ contentNative: child, open: true });
    expect(contentControl).toBe(child);
    expect(child.getAttribute("role")).toBe("tooltip");
    expect(child.style.position).toBe("fixed");
  });

  it("renders an arrow when requested", () => {
    const { contentControl } = setup({ arrow: true, open: true });
    expect(contentControl.querySelector("[data-tooltip-arrow]")).toBeInstanceOf(HTMLElement);
  });

  it("does not render an arrow when omitted", () => {
    const { contentControl } = setup({ open: true });
    expect(contentControl.querySelector("[data-tooltip-arrow]")).toBeNull();
  });

  it("renders Trigger as a button by default", () => {
    expect(setup().triggerControl.tagName).toBe("BUTTON");
  });

  it("forwards host focus to the native trigger", () => {
    const { trigger, triggerControl } = setup();
    trigger.focus();
    expect(document.activeElement).toBe(triggerControl);
  });

  it("passes through trigger attributes", () => {
    const { root, trigger, triggerControl } = setup();
    trigger.setAttribute("aria-label", "Help");
    trigger.setAttribute("aria-describedby", "persistent-help");
    trigger.setAttribute("disabled", "");
    expect(triggerControl.getAttribute("aria-label")).toBe("Help");
    expect(triggerControl.getAttribute("aria-describedby")).toBe("persistent-help");
    expect((triggerControl as HTMLButtonElement).disabled).toBe(true);
    root.open = true;
    expect(triggerControl.getAttribute("aria-describedby")?.split(" ")).toContain("persistent-help");
  });

  it("preserves authored trigger event listeners", () => {
    const { triggerControl } = setup();
    const listener = vi.fn();
    triggerControl.addEventListener("mouseenter", listener);
    enter(triggerControl);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("exposes tooltip semantics while open", () => {
    const { contentControl } = setup({ open: true });
    expect(contentControl.getAttribute("role")).toBe("tooltip");
    expect(contentControl.dataset.state).toBe("open");
  });

  it("has no accessibility violations when closed", async () => {
    const { root } = setup();
    expect((await axe(root)).violations).toEqual([]);
  });

  it("has no accessibility violations when open", async () => {
    const { root } = setup({ open: true });
    expect((await axe(root)).violations).toEqual([]);
  });

  it("removes aria-describedby while closed", async () => {
    const { root, triggerControl } = setup({ open: true });
    expect(triggerControl.hasAttribute("aria-describedby")).toBe(true);
    root.open = false;
    await tick();
    expect(triggerControl.hasAttribute("aria-describedby")).toBe(false);
  });

  it("keeps tooltip content out of the tab order", () => {
    const { contentControl } = setup({ open: true });
    expect(contentControl.hasAttribute("tabindex")).toBe(false);
  });

  it("does not show on hover when hover is false", async () => {
    const { contentControl, triggerControl } = setup({ hover: false });
    enter(triggerControl);
    await tick();
    expect(contentControl.hidden).toBe(true);
  });

  it("does not show on focus when focus is false", async () => {
    const { contentControl, triggerControl } = setup({ focus: false });
    triggerControl.focus();
    await tick();
    expect(contentControl.hidden).toBe(true);
  });

  it("requires Content to register with a Root before portalling", () => {
    defineTooltipElements();
    const content = document.createElement("aria-tooltip-content");
    document.body.append(content);
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(content.hidden).toBe(true);
  });

  it("calls onOpenChange when state changes", async () => {
    const { root, triggerControl } = setup();
    const callback = vi.fn();
    root.onOpenChange = callback;
    enter(triggerControl);
    leave(triggerControl);
    await tick();
    expect(callback).toHaveBeenNthCalledWith(1, true);
    expect(callback).toHaveBeenNthCalledWith(2, false);
  });

  it("cleans up portalled content when Root unmounts", async () => {
    const { content, root } = setup({ open: true });
    root.remove();
    await tick();
    expect(content.isConnected).toBe(false);
  });

  it("closes on Escape without moving focus", async () => {
    const { contentControl, triggerControl } = setup();
    triggerControl.focus();
    triggerControl.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    await tick();
    expect(contentControl.hidden).toBe(true);
    expect(document.activeElement).toBe(triggerControl);
  });

  it("uses a custom span trigger with native composition", () => {
    const span = document.createElement("span");
    span.tabIndex = 0;
    const { triggerControl } = setup({ triggerNative: span });
    expect(triggerControl).toBe(span);
  });

  it("uses an anchor trigger with native composition", () => {
    const anchor = document.createElement("a");
    anchor.href = "#target";
    const { triggerControl } = setup({ triggerNative: anchor });
    expect(triggerControl).toBe(anchor);
  });

  it("does not set button type on non-button native triggers", () => {
    const span = document.createElement("span");
    const { triggerControl } = setup({ triggerNative: span });
    expect(triggerControl.hasAttribute("type")).toBe(false);
  });

  it("shows tooltip on hover with a native-composition trigger", async () => {
    const span = document.createElement("span");
    const { contentControl, triggerControl } = setup({ triggerNative: span });
    enter(triggerControl);
    await tick();
    expect(contentControl.hidden).toBe(false);
  });

  it("keeps tooltip open when pointer moves from trigger to content", async () => {
    const { contentControl, triggerControl } = setup();
    enter(triggerControl);
    leave(triggerControl, contentControl);
    enter(contentControl);
    await tick();
    expect(contentControl.hidden).toBe(false);
  });

  it("closes tooltip when pointer leaves both trigger and content", async () => {
    const { contentControl, triggerControl } = setup();
    enter(triggerControl);
    leave(triggerControl, contentControl);
    enter(contentControl);
    leave(contentControl, document.body);
    await tick();
    expect(contentControl.hidden).toBe(true);
  });

  it("keeps tooltip open when pointer moves from content back to trigger", async () => {
    const { contentControl, triggerControl } = setup();
    enter(triggerControl);
    enter(contentControl);
    leave(contentControl, triggerControl);
    await tick();
    expect(contentControl.hidden).toBe(false);
  });

  it("keeps tooltip open when content mouseleave is prevented", async () => {
    const { contentControl, triggerControl } = setup();
    enter(triggerControl);
    contentControl.addEventListener("mouseleave", (event) => event.preventDefault());
    leave(contentControl, document.body);
    await tick();
    expect(contentControl.hidden).toBe(false);
  });
});
