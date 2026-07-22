import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd(), "web", "doc", "docs");
const page = readFileSync(join(docsRoot, "components", "tooltip.md"), "utf8");
const style = readFileSync(join(docsRoot, ".vitepress", "theme", "style.css"), "utf8");
const theme = readFileSync(join(docsRoot, ".vitepress", "theme", "index.ts"), "utf8");
const examples = readFileSync(join(docsRoot, ".vitepress", "theme", "tooltip-examples.ts"), "utf8");

describe("Tooltip documentation examples", () => {
  it("matches the upstream page structure and three examples", () => {
    for (const heading of ["Features", "Installation", "Examples", "Anatomy", "API Reference", "Keyboard", "Accessibility"]) {
      expect(page).toContain(`## ${heading}`);
    }
    for (const variant of ["uncontrolled", "controlled", "framer-motion"]) {
      expect(page).toContain(`data-example-variant="${variant}"`);
    }
    expect(page.match(/data-component="tooltip"/g)).toHaveLength(3);
    expect(page.match(/data-example-part="Root"/g)).toHaveLength(3);
    expect(page.match(/data-example-part="Trigger"/g)).toHaveLength(3);
    expect(page.match(/data-example-part="Content"/g)).toHaveLength(3);
  });

  it("keeps upstream Tailwind tokens and docs-only Framer Motion behavior", () => {
    expect(page).toContain("inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium");
    expect(page).toContain("z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md");
    expect(page).toContain("Animated with Framer Motion");
    expect(style).toContain('.ariaui-web-preview[data-component="tooltip"]');
    expect(style).toContain("[data-tooltip-arrow]");
    expect(examples).toContain('from "framer-motion/dom"');
    expect(examples).toContain("event.preventDefault()");
    expect(theme).toContain("installTooltipExamples");
  });
});
