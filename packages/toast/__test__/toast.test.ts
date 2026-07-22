import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearToasts,
  createToast,
  defineToastElements,
  getToastSnapshot,
  registerToastLimit,
  retainToasts,
  subscribeToToasts,
} from "../src";

type ToastList = HTMLElement & {
  stack: boolean;
  stackOffset: number;
  stackScaleStep: number;
  trigger: HTMLElement | null;
  visibleToasts: number;
};

function template(label: string, duration = 60_000) {
  const item = document.createElement("aria-toast-item");
  item.setAttribute("duration", String(duration));
  item.innerHTML = `<span>${label}</span><aria-toast-close aria-label="Dismiss ${label}">x</aria-toast-close>`;
  return item;
}

function setupList(attributes: Record<string, string | boolean> = {}) {
  const list = document.createElement("aria-toast-list") as ToastList;
  for (const [name, value] of Object.entries(attributes)) {
    if (value === true) list.setAttribute(name, "");
    else if (value !== false) list.setAttribute(name, String(value));
  }
  document.body.append(list);
  return list;
}

function add(label: string, duration = 60_000) {
  return createToast({ id: label, duration, template: template(label, duration) });
}

function items(list: Element) {
  return Array.from(list.querySelectorAll<HTMLElement>("aria-toast-item"));
}

describe("@ariaui-web/toast upstream parity", () => {
  beforeEach(() => {
    defineToastElements();
    clearToasts();
  });

  afterEach(() => {
    document.body.replaceChildren();
    clearToasts();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should be rendered", () => {
    expect(setupList()).toBeInstanceOf(HTMLElement);
  });

  it("should be accessible", async () => {
    const main = document.createElement("main");
    main.append(setupList());
    document.body.append(main);
    expect((await axe(main)).violations).toEqual([]);
  });

  it("should have click works", () => {
    const list = setupList();
    add("Default");
    list.querySelector<HTMLElement>("aria-toast-close")!.click();
    expect(items(list)).toHaveLength(0);
  });

  it("should have keyboard works", () => {
    const list = setupList();
    add("Default");
    const close = list.querySelector<HTMLElement>("aria-toast-close")!;
    close.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, code: "Enter", key: "Enter" }));
    expect(items(list)).toHaveLength(0);
  });

  it("should return a dismiss handler for the created toast", () => {
    const dismiss = add("dismissable-toast");
    expect(getToastSnapshot().map((toast) => toast.id)).toEqual(["dismissable-toast"]);
    dismiss();
    expect(getToastSnapshot()).toHaveLength(0);
  });

  it("should render toast list with live-region attributes", () => {
    const list = setupList();
    expect(list.getAttribute("role")).toBe("region");
    expect(list.getAttribute("aria-label")).toBe("Notifications");
    expect(list.getAttribute("aria-live")).toBe("polite");
    expect(list.getAttribute("tabindex")).toBe("0");
  });

  it("should render toast item with correct ARIA and data attributes", () => {
    const list = setupList();
    add("Default");
    const item = items(list)[0]!;
    expect(item.getAttribute("role")).toBe("status");
    expect(item.getAttribute("aria-live")).toBe("off");
    expect(item.getAttribute("aria-atomic")).toBe("true");
    expect(item.getAttribute("data-state")).toBe("open");
    expect(item.getAttribute("data-mounted")).toBe("true");
    expect(item.getAttribute("data-removed")).toBe("false");
    expect(item.getAttribute("data-index")).toBe("0");
    expect(item.getAttribute("tabindex")).toBe("0");
  });

  it("should clear the store snapshot and release the previous array when list unmounts", async () => {
    const list = setupList();
    add("Default");
    const snapshot = getToastSnapshot();
    list.remove();
    await Promise.resolve();
    expect(getToastSnapshot()).toHaveLength(0);
    expect(getToastSnapshot()).not.toBe(snapshot);
  });

  it("should not notify subscribers when retaining the current toast set", () => {
    add("retained-toast");
    const listener = vi.fn();
    const unsubscribe = subscribeToToasts(listener);
    retainToasts(["retained-toast"]);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("should reflect list-managed data-index in newest-first order", () => {
    const list = setupList();
    add("Older");
    add("Newest");
    expect(items(list).map((item) => [item.textContent?.trim(), item.dataset.index])).toEqual([
      ["Newestx", "0"],
      ["Olderx", "1"],
    ]);
  });

  it("should render standalone item lifecycle attributes without list index", () => {
    const item = template("Standalone");
    document.body.append(item);
    expect(item.getAttribute("data-mounted")).toBe("true");
    expect(item.getAttribute("data-removed")).toBe("false");
    expect(item.hasAttribute("data-index")).toBe(false);
    expect(item.hasAttribute("data-stack")).toBe(false);
  });

  it("should not add stack attributes when stack is omitted", () => {
    const list = setupList();
    add("Toast");
    expect(list.hasAttribute("data-stack")).toBe(false);
    expect(items(list)[0]!.hasAttribute("data-stack")).toBe(false);
  });

  it("should expose stack metadata on list and items", () => {
    const list = setupList({ stack: true, "visible-toasts": "4" });
    for (let index = 0; index < 4; index += 1) add(`Toast ${index}`);
    const toastItems = items(list);
    expect(list.dataset.stack).toBe("true");
    expect(list.dataset.expanded).toBe("false");
    expect(toastItems[0]!.dataset.front).toBe("true");
    expect(toastItems[1]!.dataset.front).toBe("false");
    expect(toastItems[0]!.style.getPropertyValue("--toast-offset")).toBe("0px");
    expect(toastItems[1]!.style.getPropertyValue("--toast-offset")).toBe("-14px");
    expect(toastItems[1]!.style.getPropertyValue("--toast-scale")).toBe("0.92");
    expect(toastItems[0]!.style.getPropertyValue("--toast-visible-toasts")).toBe("4");
  });

  it("should update data-index when a new toast is inserted at the front", () => {
    const list = setupList({ stack: true });
    add("Toast 0");
    add("Toast 1");
    expect(items(list).find((item) => item.textContent?.includes("Toast 1"))?.dataset.index).toBe("0");
    expect(items(list).find((item) => item.textContent?.includes("Toast 0"))?.dataset.index).toBe("1");
  });

  it("should force stacked item layout before switching mounted state", () => {
    const readLayout = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    setupList({ stack: true });
    add("Toast");
    expect(readLayout).toHaveBeenCalled();
    readLayout.mockRestore();
  });

  it("should show the newest toast before exiting the over-limit bottom toast in stack mode", () => {
    vi.useFakeTimers();
    const list = setupList({ stack: true });
    for (let index = 0; index < 4; index += 1) add(`Toast ${index}`);
    expect(items(list)).toHaveLength(4);
    expect(items(list)[0]!.textContent).toContain("Toast 3");
    vi.advanceTimersByTime(300);
    expect(items(list)[3]!.dataset.exitPhase).toBe("scale");
    vi.advanceTimersByTime(150);
    expect(items(list)[3]!.dataset.exitPhase).toBe("fade");
    vi.advanceTimersByTime(150);
    expect(items(list)).toHaveLength(3);
  });

  it("should trim older toasts by visibleToasts when stack is omitted", () => {
    const list = setupList({ "visible-toasts": "2" });
    add("Toast 0");
    add("Toast 1");
    add("Toast 2");
    expect(items(list).map((item) => item.textContent)).toEqual(["Toast 2x", "Toast 1x"]);
    expect(getToastSnapshot()).toHaveLength(2);
  });

  it("should expand stack on pointer hover and focus within", () => {
    const list = setupList({ stack: true });
    list.dispatchEvent(new Event("pointerenter", { bubbles: false }));
    expect(list.dataset.expanded).toBe("true");
    list.dispatchEvent(new Event("pointerleave", { bubbles: false }));
    expect(list.dataset.expanded).toBe("false");
    list.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(list.dataset.expanded).toBe("true");
  });

  it("should call external stack interaction handlers", () => {
    const list = setupList({ stack: true });
    const listener = vi.fn();
    list.addEventListener("pointerenter", listener);
    list.dispatchEvent(new Event("pointerenter"));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("should let each newest toast enter before the previous bottom toast exits in stack mode", () => {
    vi.useFakeTimers();
    const list = setupList({ stack: true });
    for (let index = 0; index < 4; index += 1) add(`Toast ${index}`);
    vi.advanceTimersByTime(600);
    add("Toast 4");
    expect(items(list)[0]!.textContent).toContain("Toast 4");
    expect(items(list)).toHaveLength(4);
  });

  it("should replace the pending bottom exit when another toast enters before exit starts", () => {
    vi.useFakeTimers();
    const list = setupList({ stack: true });
    for (let index = 0; index < 5; index += 1) add(`Toast ${index}`);
    expect(items(list).map((item) => item.textContent)).toEqual(["Toast 4x", "Toast 3x", "Toast 2x", "Toast 1x"]);
  });

  it("should collapse rapid overflow to the current bottom stack candidate", () => {
    vi.useFakeTimers();
    const list = setupList({ stack: true });
    for (let index = 0; index < 10; index += 1) add(`Toast ${index}`);
    expect(items(list)).toHaveLength(4);
    expect(getToastSnapshot()).toHaveLength(4);
  });

  it("should expose stack offset variables for both collapsed directions", () => {
    const list = setupList({ stack: true });
    add("A");
    add("B");
    const second = items(list)[1]!;
    expect(second.style.getPropertyValue("--toast-offset-up")).toBe("-14px");
    expect(second.style.getPropertyValue("--toast-offset-down")).toBe("14px");
  });

  it("should let consumers configure stack offset and scale step", () => {
    const list = setupList({ stack: true, "stack-offset": "20", "stack-scale-step": "0.1" });
    add("A");
    add("B");
    expect(items(list)[1]!.style.getPropertyValue("--toast-offset")).toBe("-20px");
    expect(items(list)[1]!.style.getPropertyValue("--toast-scale")).toBe("0.9");
  });

  it("should cap the store snapshot before notifying subscribers", () => {
    const unregister = registerToastLimit(2);
    const snapshots: string[][] = [];
    const unsubscribe = subscribeToToasts(() => snapshots.push(getToastSnapshot().map((toast) => toast.id)));
    add("1"); add("2"); add("3");
    expect(snapshots.at(-1)).toEqual(["3", "2"]);
    expect(snapshots.every((snapshot) => snapshot.length <= 2)).toBe(true);
    unsubscribe(); unregister();
  });

  it("should auto-dismiss after duration", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("Default", 1000);
    vi.advanceTimersByTime(1020);
    expect(items(list)).toHaveLength(0);
  });

  it("should not dismiss before duration elapses", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("Default", 3000);
    vi.advanceTimersByTime(2000);
    expect(items(list)).toHaveLength(1);
  });

  it("should pause dismiss timer on mouse enter", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("Default", 1000);
    items(list)[0]!.dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(2000);
    expect(items(list)).toHaveLength(1);
  });

  it("should remove the active dismiss timeout on mouse enter", () => {
    vi.useFakeTimers();
    const clear = vi.spyOn(globalThis, "clearTimeout");
    const item = template("Standalone", 1000) as HTMLElement & { onClose: (() => void) | null };
    item.onClose = () => undefined;
    document.body.append(item);
    item.dispatchEvent(new MouseEvent("mouseenter"));
    expect(clear).toHaveBeenCalled();
    clear.mockRestore();
  });

  it("should restart a full dismiss timeout on mouse leave after hover pause", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const item = template("Default", 1000) as HTMLElement & { onClose: (() => void) | null };
    item.onClose = onClose;
    document.body.append(item);
    vi.advanceTimersByTime(800);
    item.dispatchEvent(new MouseEvent("mouseenter"));
    item.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(999);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should resume dismiss timer on mouse leave", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("Default", 1000);
    const item = items(list)[0]!;
    item.dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(2000);
    item.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(1020);
    expect(items(list)).toHaveLength(0);
  });

  it("should reset dismiss cycle on repeated mouse leave", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("Default", 1000);
    const item = items(list)[0]!;
    item.dispatchEvent(new MouseEvent("mouseenter"));
    item.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(900);
    item.dispatchEvent(new MouseEvent("mouseenter"));
    item.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(900);
    expect(items(list)).toHaveLength(1);
  });

  it("should pause and reset all dismiss timers when the list is hovered", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("A", 1000); add("B", 1000);
    vi.advanceTimersByTime(800);
    list.dispatchEvent(new Event("pointerenter"));
    vi.advanceTimersByTime(2000);
    expect(items(list)).toHaveLength(2);
    list.dispatchEvent(new Event("pointerleave"));
    vi.advanceTimersByTime(1000);
    expect(items(list)).toHaveLength(0);
  });

  it("should keep toast open if it mounts while hovered and dismiss after leave", () => {
    vi.useFakeTimers();
    const originalMatches = HTMLElement.prototype.matches;
    const matches = vi.spyOn(HTMLElement.prototype, "matches").mockImplementation(function (selector) {
      if (selector === ":hover") return originalMatches.call(this, "aria-toast-item");
      return originalMatches.call(this, selector);
    });
    const list = setupList();
    add("Default", 1000);
    vi.advanceTimersByTime(1500);
    expect(items(list)).toHaveLength(1);
    matches.mockRestore();
    items(list)[0]!.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(1000);
    expect(items(list)).toHaveLength(0);
  });

  it("should pause dismiss timer on focus and resume on blur", () => {
    vi.useFakeTimers();
    const list = setupList();
    add("Default", 1000);
    const item = items(list)[0]!;
    item.dispatchEvent(new FocusEvent("focus"));
    vi.advanceTimersByTime(2000);
    expect(items(list)).toHaveLength(1);
    item.dispatchEvent(new FocusEvent("blur"));
    vi.advanceTimersByTime(1000);
    expect(items(list)).toHaveLength(0);
  });

  it("should move focus to the toast list when Tab is pressed on trigger", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const list = setupList();
    list.trigger = trigger;
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, code: "Tab", key: "Tab" }));
    expect(document.activeElement).toBe(list);
  });

  it("should restore focus to trigger when queue empties", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const list = setupList();
    list.trigger = trigger;
    trigger.click();
    add("Default");
    list.querySelector<HTMLElement>("aria-toast-close")!.click();
    expect(document.activeElement).toBe(trigger);
  });

  it("should restore focus to the trigger that opened the queue when multiple lists are mounted", () => {
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    const firstList = setupList();
    const secondList = setupList();
    firstList.trigger = first;
    secondList.trigger = second;
    first.click();
    add("First");
    firstList.querySelector<HTMLElement>("aria-toast-close")!.click();
    expect(document.activeElement).toBe(first);
    expect(document.activeElement).not.toBe(second);
  });
});
