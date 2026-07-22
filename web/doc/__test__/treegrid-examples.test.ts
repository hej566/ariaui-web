import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd(), "web", "doc", "docs");
const page = readFileSync(join(docsRoot, "components", "treegrid.md"), "utf8");
const style = readFileSync(join(docsRoot, ".vitepress", "theme", "style.css"), "utf8");
const theme = readFileSync(join(docsRoot, ".vitepress", "theme", "index.ts"), "utf8");
const examples = readFileSync(join(docsRoot, ".vitepress", "theme", "treegrid-examples.ts"), "utf8");

describe("Treegrid documentation examples", () => {
  it("matches the upstream page structure and example set", () => {
    for (const heading of ["Features", "Installation", "Examples", "Anatomy", "API Reference", "Keyboard Interactions", "Accessibility"]) {
      expect(page).toContain(`## ${heading}`);
    }
    for (const variant of ["file-tree", "multi-select-tasks", "framer-motion"]) {
      expect(page).toContain(`data-example-variant="${variant}"`);
    }
    expect(page.match(/data-component="treegrid"/g)).toHaveLength(3);
  });

  it("keeps upstream Tailwind tokens and docs-only motion behavior", () => {
    expect(page).toContain("w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm");
    expect(page).toContain("group grid [grid-template-columns:var(--treegrid-columns)] hover:bg-secondary-hover");
    expect(page).toContain("flex h-[52px] items-center border-b border-border-secondary px-4 text-left text-sm text-foreground");
    expect(page).toContain("native-composition");
    expect(style).toContain('.ariaui-web-preview[data-component="treegrid"]');
    expect(examples).toContain('from "framer-motion/dom"');
    expect(examples).toContain("data-treegrid-motion-group");
    expect(theme).toContain("installTreegridExamples");
  });

  it("provides a code snippet for every live example", () => {
    expect(page.match(/```html/g)).toHaveLength(4);
  });
});
