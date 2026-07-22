import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { clearToasts, defineToastElements } from "@ariaui-web/toast";
import { definePortalElements } from "@ariaui-web/portal";
import { installToastExamples } from "../docs/.vitepress/theme/toast-examples";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), "web/doc/docs", relativePath), "utf8");

describe("Toast examples", () => {
  afterEach(() => {
    document.body.replaceChildren();
    clearToasts();
  });

  it("matches the upstream page structure and single List example", () => {
    const page = read("components/toast.md");
    for (const heading of ["## Features", "## Usage", "## Installation", "## Examples", "### List", "## Anatomy", "## API Reference", "## Keyboard", "## Accessibility"]) {
      expect(page).toContain(heading);
    }
    expect(page.match(/data-component="toast"/g)).toHaveLength(1);
    expect(page.slice(page.indexOf("## Examples"), page.indexOf("## Anatomy")).match(/```html/g)).toHaveLength(1);
  });

  it("keeps all six positions and upstream Tailwind composition", () => {
    const page = read("components/toast.md");
    for (const label of ["Top left", "Top center", "Top right", "Bottom left", "Bottom center", "Bottom right"]) {
      expect(page).toContain(label);
    }
    expect(page).toContain("grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3");
    expect(page).toContain("pointer-events-none fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4");
    expect(page).toContain("inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm");
    expect(page).toContain("stack-offset=\"14\"");
    expect(page).toContain("stack-scale-step=\"0.08\"");
    expect(page).toContain("visible-toasts=\"3\"");
    expect(page).toContain("<aria-portal>");
  });

  it("opens, repositions, stacks, and dismisses native toast items", () => {
    defineToastElements();
    definePortalElements();
    document.body.innerHTML = `
      <div class="ariaui-web-preview" data-component="toast" data-toast-example="positions">
        <button data-toast-position="top-left">Top left</button>
        <button data-toast-position="bottom-right">Bottom right</button>
      </div>
      <aria-toast-list stack visible-toasts="3" data-toast-example-list></aria-toast-list>
    `;
    installToastExamples(document);
    const topLeft = document.querySelector<HTMLElement>("[data-toast-position='top-left']")!;
    const bottomRight = document.querySelector<HTMLElement>("[data-toast-position='bottom-right']")!;
    const list = document.querySelector<HTMLElement>("[data-toast-example-list]")!;

    topLeft.click();
    expect(list.dataset.position).toBe("top-left");
    expect(list.querySelector("aria-toast-item")?.textContent).toContain("Top left toast");
    topLeft.click();
    expect(list.querySelectorAll("aria-toast-item")).toHaveLength(2);

    bottomRight.click();
    expect(list.dataset.position).toBe("bottom-right");
    expect(list.querySelectorAll("aria-toast-item")).toHaveLength(1);
    expect(list.querySelector("aria-toast-item")?.textContent).toContain("Bottom right toast");
    list.querySelector<HTMLElement>("aria-toast-close")!.click();
    expect(list.querySelectorAll("aria-toast-item")).toHaveLength(0);
  });

  it("wires the installer into the VitePress theme", () => {
    const theme = read(".vitepress/theme/index.ts");
    const behavior = read(".vitepress/theme/toast-examples.ts");
    expect(theme).toContain("installToastExamples");
    expect(behavior).toContain("createToast");
    expect(behavior).toContain("aria-toast-item");
    expect(behavior).toContain("Dismiss notification");
  });
});
