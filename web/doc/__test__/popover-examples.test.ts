import { readFileSync } from "node:fs";
import { join } from "node:path";
import { definePopoverElements } from "@ariaui-web/popover";
import { afterEach, describe, expect, it, vi } from "vitest";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn(() => ({})) }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

import { installPopoverExamples } from "../docs/.vitepress/theme/popover-examples";

type RuntimePopoverElement = HTMLElement & { open: boolean };

function popoverPreviews() {
  const doc = readFileSync(join(process.cwd(), "web/doc/docs/components/popover.md"), "utf8");
  const previews: Array<{ className: string; variant: string; markup: string }> = [];
  for (const match of doc.matchAll(/<div class="([^"]*\bariaui-web-preview\b[^"]*)" data-component="popover" data-example-variant="([^"]+)">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);
    previews.push({ className: match[1] ?? "", variant: match[2] ?? "", markup: doc.slice(start, end).trim() });
  }
  return previews;
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  animateMock.mockClear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("Popover live examples", () => {
  it("opens, edits, dismisses, restores focus, and animates with the source values", async () => {
    definePopoverElements();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: false })),
    });
    document.body.innerHTML = popoverPreviews()
      .map((preview) => `<div class="${preview.className}" data-component="popover" data-example-variant="${preview.variant}">\n${preview.markup}\n</div>`)
      .join("\n");
    installPopoverExamples(document);

    const roots = Array.from(document.querySelectorAll("aria-popover")) as RuntimePopoverElement[];
    expect(roots).toHaveLength(2);

    const defaultRoot = roots[0]!;
    const defaultTrigger = defaultRoot.querySelector<HTMLElement>("aria-popover-trigger")!;
    const defaultContent = defaultRoot.querySelector<HTMLElement>("aria-popover-content")!;
    defaultTrigger.click();
    await flush();
    expect(defaultRoot.open).toBe(true);
    expect(defaultTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(defaultContent.getAttribute("role")).toBe("dialog");
    const width = defaultContent.querySelector<HTMLInputElement>("#popover-width")!;
    expect(document.activeElement).toBe(width);
    width.value = "80%";
    expect(width.value).toBe("80%");
    defaultContent.querySelector<HTMLElement>("aria-popover-close")!.click();
    await flush();
    expect(defaultRoot.open).toBe(false);
    expect(document.activeElement).toBe(defaultTrigger);

    defaultTrigger.click();
    await flush();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();
    expect(defaultRoot.open).toBe(false);

    defaultTrigger.click();
    await flush();
    defaultContent.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await flush();
    expect(defaultRoot.open).toBe(false);
    expect(document.activeElement).toBe(defaultTrigger);

    const motionRoot = roots[1]!;
    const motionTrigger = motionRoot.querySelector<HTMLElement>("aria-popover-trigger")!;
    const motionContent = motionRoot.querySelector<HTMLElement>("aria-popover-content")!;
    motionTrigger.click();
    await flush();
    expect(motionRoot.open).toBe(true);
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [0, 1], y: [8, 0], scale: [0.96, 1] },
      { duration: 0.18, ease: "easeOut" },
    );
    motionContent.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    await flush();
    expect(motionRoot.open).toBe(false);
    expect(motionContent.hidden).toBe(false);
    expect(motionContent.getAttribute("aria-hidden")).toBe("true");
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [1, 0], y: [0, 8], scale: [1, 0.96] },
      { duration: 0.18, ease: "easeOut" },
    );

    animateMock.mockClear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    });
    motionTrigger.click();
    await flush();
    expect(animateMock).toHaveBeenLastCalledWith(
      motionContent,
      { opacity: [0, 1] },
      { duration: 0, ease: "easeOut" },
    );
  });
});
