import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineMenubarElements } from "@ariaui-web/menubar";
import { afterEach, describe, expect, it, vi } from "vitest";

const { animateMock } = vi.hoisted(() => ({ animateMock: vi.fn() }));
vi.mock("framer-motion/dom", () => ({ animate: animateMock }));

import { installMenubarExamples } from "../docs/.vitepress/theme/menubar-examples";

function animationControl() {
  return { stop: vi.fn(), then: vi.fn(() => new Promise<void>(() => undefined)) };
}

async function flush() {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Promise.resolve();
}

afterEach(() => {
  animateMock.mockReset();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("Menubar docs examples", () => {
  it("matches the upstream page structure, examples, and Tailwind tokens", () => {
    const markdown = readFileSync(resolve(process.cwd(), "web/doc/docs/components/menubar.md"), "utf8");
    const styles = readFileSync(resolve(process.cwd(), "web/doc/docs/.vitepress/theme/style.css"), "utf8");
    const headings = Array.from(markdown.matchAll(/^## (.+)$/gm), (match) => match[1]);

    expect(headings).toEqual([
      "Features",
      "Installation",
      "Examples",
      "Anatomy",
      "API Reference",
      "Keyboard",
      "Accessibility",
    ]);
    expect(markdown.match(/data-example-variant="(?:default|framer-motion)"/g)).toEqual([
      'data-example-variant="default"',
      'data-example-variant="framer-motion"',
    ]);
    expect(markdown).toContain("flex h-9 w-[245px] items-center gap-1 rounded-md border border-border bg-background p-1 text-foreground shadow-xs");
    expect(markdown).toContain("relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5");
    expect(markdown).toContain("Always Show Bookmarks");
    expect(markdown).toContain("People");
    expect(markdown.match(/Menubar Item Text/g)?.length).toBeGreaterThanOrEqual(4);
    expect(markdown).toContain("### Framer Motion");
    expect(markdown.match(/```html/g)?.length).toBeGreaterThanOrEqual(2);
    expect(styles).toContain("--ariaui-menubar-accent-hover: oklch(70.8% 0 0 / 1)");
    expect(styles).toContain("--ariaui-menubar-border: oklch(92.2% 0 0 / 1)");
    expect(styles).toContain("0 4px 6px -1px oklch(0% 0 0 / 10.2%)");
    expect(styles).toContain('.ariaui-web-preview[data-component="menubar"] aria-menubar-content[native-composition]');
    expect(styles).toContain("display: contents;");
  });

  it("animates the composed Framer Motion panel when it opens and closes", async () => {
    animateMock.mockImplementation(animationControl);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    defineMenubarElements();
    document.body.innerHTML = `<div class="ariaui-web-preview" data-component="menubar" data-example-variant="framer-motion">
      <aria-menubar>
        <aria-menubar-menu>
          <aria-menubar-trigger>File</aria-menubar-trigger>
          <aria-menubar-content native-composition>
            <div data-menubar-motion-content><aria-menubar-item>New Tab</aria-menubar-item></div>
          </aria-menubar-content>
        </aria-menubar-menu>
      </aria-menubar>
    </div>`;

    installMenubarExamples(document);
    const trigger = document.querySelector<HTMLElement>("aria-menubar-trigger")!;
    const panel = document.querySelector<HTMLElement>("[data-menubar-motion-content]")!;

    trigger.click();
    await flush();
    expect(animateMock).toHaveBeenLastCalledWith(
      panel,
      { opacity: [0, 1], y: [8, 0], scale: [0.98, 1] },
      { duration: 0.18, ease: "easeOut" },
    );

    trigger.click();
    await flush();
    expect(panel.hidden).toBe(false);
    expect(animateMock).toHaveBeenLastCalledWith(
      panel,
      { opacity: [1, 0], y: [0, 8], scale: [1, 0.98] },
      { duration: 0.18, ease: "easeOut" },
    );
  });
});
