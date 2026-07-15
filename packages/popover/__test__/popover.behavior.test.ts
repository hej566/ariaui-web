import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { definePopoverElements } from "../src";

type RuntimePopoverElement = HTMLElement & {
  disabled: boolean;
  open: boolean;
  syncPopoverTreeFromRoot: () => void;
};

function fixture(rootAttributes = "") {
  definePopoverElements();
  const host = document.createElement("div");
  host.innerHTML = `
    <aria-popover ${rootAttributes}>
      <aria-popover-trigger>Dimensions</aria-popover-trigger>
      <aria-popover-content>
        <aria-popover-heading>Dimensions</aria-popover-heading>
        <aria-popover-description>Set the dimensions for the layer.</aria-popover-description>
        <input aria-label="Width" />
        <aria-popover-close aria-label="Close">Close</aria-popover-close>
      </aria-popover-content>
    </aria-popover>`;
  document.body.append(host);

  const root = host.querySelector("aria-popover") as RuntimePopoverElement;
  const trigger = host.querySelector("aria-popover-trigger") as RuntimePopoverElement;
  const content = host.querySelector("aria-popover-content") as RuntimePopoverElement;
  const heading = host.querySelector("aria-popover-heading") as RuntimePopoverElement;
  const description = host.querySelector("aria-popover-description") as RuntimePopoverElement;
  const close = host.querySelector("aria-popover-close") as RuntimePopoverElement;

  return { close, content, description, heading, host, root, trigger };
}

async function flushMicrotasks() {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
}

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0));
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("@ariaui-web/popover native state", () => {
  it("starts closed and synchronizes direct and default open state", async () => {
    const closed = fixture();
    expect(closed.root.open).toBe(false);
    expect(closed.trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("false");
    expect(closed.trigger.hasAttribute("aria-controls")).toBe(false);
    expect(closed.content.hidden).toBe(true);

    closed.root.open = true;
    await flushMicrotasks();
    expect(closed.trigger.getAttribute("aria-expanded")).toBe("true");
    expect(closed.trigger.getAttribute("aria-controls")).toBe(closed.content.id);
    expect(closed.content.hidden).toBe(false);
    expect(closed.content.getAttribute("role")).toBe("dialog");
    expect(closed.content.getAttribute("aria-modal")).toBe("false");

    closed.host.remove();
    const opened = fixture("default-open");
    await flushMicrotasks();
    expect(opened.root.open).toBe(true);
    expect(opened.content.hidden).toBe(false);
  });

  it("connects heading and description ids to Content", () => {
    const { content, description, heading, root } = fixture("open");
    expect(heading.id).not.toBe("");
    expect(description.id).not.toBe("");
    expect(content.getAttribute("aria-labelledby")).toBe(heading.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(root.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("data-state")).toBe("open");
  });

  it("updates labelling when Heading and Description descendants change", async () => {
    const { content, description, heading } = fixture("open");
    heading.remove();
    description.remove();
    await flushMicrotasks();
    expect(content.hasAttribute("aria-labelledby")).toBe(false);
    expect(content.hasAttribute("aria-describedby")).toBe(false);
    const replacement = document.createElement("aria-popover-heading");
    replacement.id = "replacement-heading";
    replacement.textContent = "Replacement";
    content.prepend(replacement);
    await flushMicrotasks();
    expect(content.getAttribute("aria-labelledby")).toBe("replacement-heading");
  });

  it("toggles from Trigger click, Enter, and Space and ignores disabled Trigger", async () => {
    const { root, trigger } = fixture();
    trigger.click();
    await flushMicrotasks();
    expect(root.open).toBe(true);
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await flushMicrotasks();
    expect(root.open).toBe(false);
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    trigger.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true }));
    await flushMicrotasks();
    expect(root.open).toBe(true);
    trigger.disabled = true;
    trigger.click();
    await flushMicrotasks();
    expect(root.open).toBe(true);
  });

  it("supports canceled controlled requests", async () => {
    const { root, trigger } = fixture();
    const changes: boolean[] = [];
    root.addEventListener("openchange", (event) => {
      const change = event as CustomEvent<{ open: boolean; source: Element }>;
      changes.push(change.detail.open);
      expect(change.detail.source).toBe(trigger);
      event.preventDefault();
    });
    trigger.click();
    await flushMicrotasks();
    expect(changes).toEqual([true]);
    expect(root.open).toBe(false);
  });

  it("closes from Close, outside mousedown, and Escape while restoring Trigger focus", async () => {
    const { close, content, root, trigger } = fixture("open");
    close.click();
    await flushMicrotasks();
    expect(root.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
    root.open = true;
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flushMicrotasks();
    expect(root.open).toBe(false);
    root.open = true;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await flushMicrotasks();
    expect(root.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("respects a prevented Close click", async () => {
    const { close, root } = fixture("open");
    close.addEventListener("click", (event) => event.preventDefault());
    close.click();
    await flushMicrotasks();
    expect(root.open).toBe(true);
  });

  it("leaves orphan parts inert instead of throwing", async () => {
    definePopoverElements();
    document.body.innerHTML = "<aria-popover-trigger>Orphan trigger</aria-popover-trigger><aria-popover-content>Orphan content</aria-popover-content><aria-popover-close>Orphan close</aria-popover-close>";
    const trigger = document.querySelector<HTMLElement>("aria-popover-trigger")!;
    const close = document.querySelector<HTMLElement>("aria-popover-close")!;
    expect(() => trigger.click()).not.toThrow();
    expect(() => close.click()).not.toThrow();
    await flushMicrotasks();
    expect(document.querySelector("aria-popover")).toBeNull();
  });

  it("uses the effective native-composition host and preserves its heading id", () => {
    definePopoverElements();
    document.body.innerHTML = `<aria-popover open>
      <aria-popover-trigger>Open</aria-popover-trigger>
      <aria-popover-content native-composition>
        <section data-testid="host">
          <aria-popover-heading native-composition><h3 id="existing-heading">Settings</h3></aria-popover-heading>
          <button>Inside</button>
        </section>
      </aria-popover-content>
    </aria-popover>`;
    const trigger = document.querySelector("aria-popover-trigger")!;
    const host = document.querySelector<HTMLElement>("[data-testid='host']")!;
    expect(host.getAttribute("role")).toBe("dialog");
    expect(host.getAttribute("aria-labelledby")).toBe("existing-heading");
    expect(trigger.getAttribute("aria-controls")).toBe(host.id);
  });

  it("renders exactly one arrow and resolves a viewport flip", () => {
    const { content, root, trigger } = fixture("open placement=bottom offset=8");
    content.setAttribute("arrow", "");
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 590, 40, 20));
    vi.spyOn(content, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 180, 120));
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 640 });
    root.syncPopoverTreeFromRoot();
    expect(content.querySelectorAll("[data-popover-arrow]")).toHaveLength(1);
    expect(content.dataset.side).toBe("top");
    expect(content.style.position).toBe("fixed");
    expect(content.style.top).toBe("462px");
    expect(content.style.left).toBe("30px");
  });

  it("uses the Popover API when available and hidden fallback otherwise", () => {
    const { content, root } = fixture();
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    Object.defineProperties(content, { showPopover: { configurable: true, value: showPopover }, hidePopover: { configurable: true, value: hidePopover } });
    root.open = true;
    expect(showPopover).toHaveBeenCalledOnce();
    root.open = false;
    expect(hidePopover).toHaveBeenCalledOnce();
    expect(content.hidden).toBe(true);
  });

  it("keeps force-mounted Content inert, removes an omitted arrow, and ignores clipped ancestors", () => {
    const { content, host: clippingHost, root, trigger } = fixture("open placement=bottom offset=8");
    clippingHost.style.overflow = "hidden";
    vi.spyOn(clippingHost, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 160, 80));
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 100, 40, 20));
    vi.spyOn(content, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 180, 120));
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 640 });
    content.setAttribute("arrow", "");
    root.syncPopoverTreeFromRoot();
    expect(content.dataset.side).toBe("bottom");
    expect(content.style.top).toBe("128px");
    expect(content.querySelectorAll("[data-popover-arrow]")).toHaveLength(1);
    content.removeAttribute("arrow");
    expect(content.querySelectorAll("[data-popover-arrow]")).toHaveLength(0);
    content.setAttribute("force-mount", "");
    root.open = false;
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.hasAttribute("inert")).toBe(true);
  });

  it("cleans up automatic position listeners when closed", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { root } = fixture();
    root.open = true;
    root.open = false;
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
