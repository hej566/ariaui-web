import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineSplitterElements } from "@ariaui-web/splitter";
import { afterEach, describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), "web/doc/docs", relativePath), "utf8");

function previewMarkup() {
  const page = read("components/splitter.md");
  const match = page.match(
    /<div class="[^"]*ariaui-web-preview[^"]*" data-component="splitter" data-example-variant="default">\n([\s\S]*?)\n<\/div>\n\n```html/,
  );
  return match?.[1] ?? "";
}

describe("Splitter examples", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("matches the upstream page structure and single example", () => {
    const page = read("components/splitter.md");

    expect(page).toContain("## Features");
    expect(page).toContain("## Installation");
    expect(page).toContain("## Examples");
    expect(page).toContain("### Default");
    expect(page).toContain("## Anatomy");
    expect(page).toContain("## API Reference");
    expect(page).toContain("## Keyboard");
    expect(page).toContain("## Accessibility");
    expect(page.match(/data-component="splitter"/g)).toHaveLength(1);
    expect(page.match(/```html/g)).toHaveLength(2);
  });

  it("uses the same nested three-pane layout and Tailwind composition", () => {
    const page = read("components/splitter.md");
    const markup = previewMarkup();

    expect(markup).toContain('default-layout="40,60"');
    expect(markup).toContain('default-layout="50,50"');
    expect(markup).toContain('orientation="vertical"');
    expect(markup).toContain('orientation="horizontal"');
    expect(markup).toContain(">One<");
    expect(markup).toContain(">Two<");
    expect(markup).toContain(">Three<");
    expect(page).toContain("h-[320px] w-full overflow-hidden rounded-xl");
  });

  it("keeps the rendered example keyboard-resizable", () => {
    defineSplitterElements();
    document.body.innerHTML = previewMarkup();
    const outer = document.querySelector<HTMLElement>('aria-splitter[orientation="vertical"]')!;
    const first = outer.querySelector<HTMLElement>(":scope > aria-splitter-panel")!;
    const separator = outer.querySelector<HTMLElement>(":scope > aria-splitter-separator")!;

    separator.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "ArrowRight",
    }));

    expect(first.style.width).toBe("45%");
    expect(separator.getAttribute("aria-valuenow")).toBe("45");
  });
});
