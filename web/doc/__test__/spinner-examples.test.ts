import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd(), "web/doc/docs");

function read(relativePath: string) {
  return readFileSync(join(docsRoot, relativePath), "utf8");
}

describe("Spinner examples", () => {
  it("matches the upstream page structure and example set", () => {
    const page = read("components/spinner.md");

    expect(page).toContain("## Features");
    expect(page).toContain("## Installation");
    expect(page).toContain("## Examples");
    expect(page).toContain("### Default");
    expect(page).not.toContain("### Button");
    expect(page).toContain("### Custom SVG");
    expect(page).toContain("### Heroicon");
    expect(page).toContain("### Framer Motion");
    expect(page).toContain("## Anatomy");
    expect(page).toContain("## API Reference");
    expect(page).toContain("## Accessibility");
  });

  it("uses native Spinner elements and provides a snippet for every example", () => {
    const page = read("components/spinner.md");
    const examples = page.slice(page.indexOf("## Examples"), page.indexOf("## Anatomy"));

    expect(page.match(/data-component="spinner"/g)).toHaveLength(4);
    expect(examples.match(/```html/g)).toHaveLength(4);
    expect(page.match(/<aria-spinner/g)?.length).toBeGreaterThanOrEqual(8);
    expect(page).toContain('aria-label="Loading workspace"');
    expect(page).not.toContain('data-example-variant="button"');
    expect(page).toContain("native-composition");
  });

  it("wires the Framer Motion example only through the docs theme", () => {
    const page = read("components/spinner.md");
    const theme = read(".vitepress/theme/index.ts");
    const behavior = read(".vitepress/theme/spinner-examples.ts");

    expect(page).toContain('data-example-variant="framer-motion"');
    expect(page).toContain("data-spinner-motion");
    expect(theme).toContain("installSpinnerExamples");
    expect(behavior).toContain('from "framer-motion/dom"');
    expect(behavior).toContain("repeat: Infinity");
  });
});
