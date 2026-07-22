import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), "web/doc/docs", relativePath), "utf8");

describe("Switch examples", () => {
  it("matches the upstream page structure and example set", () => {
    const page = read("components/switch.md");

    expect(page).toContain("## Features");
    expect(page).toContain("## Installation");
    expect(page).toContain("## Examples");
    expect(page).toContain("### Uncontrolled");
    expect(page).toContain("### Controlled");
    expect(page).toContain("### Disabled");
    expect(page).toContain("### Framer Motion");
    expect(page).toContain("## Anatomy");
    expect(page).toContain("## API Reference");
    expect(page).toContain("## Keyboard");
    expect(page).toContain("## Accessibility");
    expect(page.match(/data-component="switch"/g)).toHaveLength(4);
  });

  it("uses the upstream content, Tailwind composition, and a snippet per example", () => {
    const page = read("components/switch.md");
    const examples = page.slice(page.indexOf("## Examples"), page.indexOf("## Anatomy"));

    expect(examples.match(/```html/g)).toHaveLength(4);
    expect(page.match(/Remember me/g)?.length).toBeGreaterThanOrEqual(8);
    expect(page).toContain("relative box-border h-5 w-9 cursor-pointer rounded-full bg-muted p-0.5");
    expect(page).toContain("group-has-[:checked]:bg-primary");
    expect(page).toContain("pointer-events-none absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-background shadow-sm");
    expect(page).toContain("group-has-[:checked]:translate-x-4");
    expect(page).toContain("text-sm font-medium text-foreground");
    expect(page).toContain("text-sm font-normal text-muted-foreground");
  });

  it("keeps Framer Motion in the documentation layer", () => {
    const page = read("components/switch.md");
    const theme = read(".vitepress/theme/index.ts");
    const behavior = read(".vitepress/theme/switch-examples.ts");

    expect(page).toContain('data-example-variant="framer-motion"');
    expect(page).toContain("data-switch-motion-thumb");
    expect(theme).toContain("installSwitchExamples");
    expect(behavior).toContain('from "framer-motion/dom"');
    expect(behavior).toContain("stiffness: 500");
    expect(behavior).toContain("damping: 32");
  });
});
