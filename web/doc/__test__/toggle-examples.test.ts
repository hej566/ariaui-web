import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd(), "web", "doc", "docs");
const page = readFileSync(join(docsRoot, "components", "toggle.md"), "utf8");
const style = readFileSync(join(docsRoot, ".vitepress", "theme", "style.css"), "utf8");

describe("Toggle documentation examples", () => {
  it("matches the upstream page structure and six variants", () => {
    for (const heading of ["Features", "Installation", "Examples", "Anatomy", "API Reference", "Keyboard", "Accessibility"]) {
      expect(page).toContain(`## ${heading}`);
    }

    for (const variant of ["default", "outline", "with-text", "small", "large", "disabled"]) {
      expect(page).toContain(`data-example-variant="${variant}"`);
    }

    expect(page.match(/data-component="toggle"/g)).toHaveLength(6);
    expect(page.match(/data-example-part="Root"/g)).toHaveLength(6);
    expect(page.match(/```html/g)).toHaveLength(7);
  });

  it("uses matching labels, icons, state hooks, and Tailwind token classes", () => {
    expect(page).toContain('aria-label="Toggle bold"');
    expect(page).toContain('aria-label="Toggle italic with text"');
    expect(page).toContain('aria-label="Toggle underline disabled"');
    expect(page).toContain("group-data-[state=on]:text-accent-foreground");
    expect(style).toContain('.ariaui-web-preview[data-component="toggle"]');
    expect(style).toContain('.ariaui-web-toggle-button[data-state="on"]');
  });
});
