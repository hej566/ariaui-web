import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd(), "web", "doc", "docs");
const page = readFileSync(join(docsRoot, "components", "toggle-group.md"), "utf8");
const style = readFileSync(join(docsRoot, ".vitepress", "theme", "style.css"), "utf8");

describe("Toggle Group documentation examples", () => {
  it("matches the upstream page structure and seven variants", () => {
    for (const heading of ["Features", "Installation", "Examples", "Anatomy", "API Reference", "Keyboard", "Accessibility"]) {
      expect(page).toContain(`## ${heading}`);
    }
    for (const variant of ["group-outline", "group-default", "group-small", "group-large", "group-disabled", "group-fill-outline", "group-fill-default"]) {
      expect(page).toContain(`data-example-variant="${variant}"`);
    }
    expect(page.match(/data-component="toggle-group"/g)).toHaveLength(7);
    expect(page.match(/data-example-part="Root"/g)).toHaveLength(7);
    expect(page.match(/data-example-part="Item"/g)).toHaveLength(19);
    expect(page.match(/```html/g)).toHaveLength(8);
  });

  it("keeps the upstream icon, state, size, and fill Tailwind tokens", () => {
    for (const label of ["Toggle bold", "Toggle italic", "Toggle underline"]) expect(page).toContain(`aria-label="${label}"`);
    expect(page).toContain("data-[active=true]:bg-accent");
    expect(page).toContain("group-data-[active=true]:text-accent-foreground");
    expect(page).toContain("first:rounded-l-md last:rounded-r-md");
    expect(page).toContain("[&:not(:first-child)]:border-l-0");
    expect(page).toContain("inline-flex w-full max-w-xs items-center");
    expect(style).toContain('.ariaui-web-preview[data-component="toggle-group"]');
    expect(style).toContain('.ariaui-web-toggle-group-item[data-active="true"]');
  });
});
