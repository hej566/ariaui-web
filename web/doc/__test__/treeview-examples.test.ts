import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd(), "web", "doc", "docs");
const page = readFileSync(join(docsRoot, "components", "treeview.md"), "utf8");
const style = readFileSync(join(docsRoot, ".vitepress", "theme", "style.css"), "utf8");
const theme = readFileSync(join(docsRoot, ".vitepress", "theme", "index.ts"), "utf8");
const examples = readFileSync(join(docsRoot, ".vitepress", "theme", "treeview-examples.ts"), "utf8");

describe("Treeview documentation examples", () => {
  it("matches the upstream page structure and example set", () => {
    for (const heading of ["Features", "Installation", "Examples", "Anatomy", "API Reference", "Keyboard Interactions", "Accessibility"]) {
      expect(page).toContain(`## ${heading}`);
    }
    for (const variant of ["base", "advanced-multi-select", "advanced-controlled", "framer-motion"]) {
      expect(page).toContain(`data-example-variant="${variant}"`);
    }
    expect(page.match(/data-component="treeview"/g)).toHaveLength(4);
  });

  it("keeps upstream Tailwind tokens and docs-only Framer Motion", () => {
    expect(page).toContain("flex w-full max-w-[260px] flex-col gap-0.5 rounded-md bg-card");
    expect(page).toContain("hover:bg-secondary-hover");
    expect(page).toContain("native-composition");
    expect(style).toContain('.ariaui-web-preview[data-component="treeview"]');
    expect(examples).toContain('from "framer-motion/dom"');
    expect(theme).toContain("installTreeviewExamples");
  });

  it("provides a code snippet for every live example and anatomy", () => {
    expect(page.match(/```html/g)).toHaveLength(5);
  });

  it("highlights only the directly hovered label and selected items", () => {
    expect(style).toContain('[data-component="treeview"] .ariaui-treeview-label:hover');
    expect(style).not.toContain('aria-treeview-checkbox-item):hover > .ariaui-treeview-label');
    expect(style).toContain('[data-selected="true"] > .ariaui-treeview-label');
  });
});
