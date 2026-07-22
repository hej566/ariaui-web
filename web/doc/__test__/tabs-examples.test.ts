import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { defineTabsElements } from "@ariaui-web/tabs";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), "web/doc/docs", relativePath), "utf8");

describe("Tabs examples", () => {
  afterEach(() => document.body.replaceChildren());

  it("matches the upstream page structure and example set", () => {
    const page = read("components/tabs.md");
    expect(page).toContain("## Features");
    expect(page).toContain("## Installation");
    expect(page).toContain("## Examples");
    expect(page).toContain("### Default");
    expect(page).toContain("### Framer Motion");
    expect(page).toContain("## Anatomy");
    expect(page).toContain("## API Reference");
    expect(page).toContain("## Keyboard");
    expect(page).toContain("## Accessibility");
    expect(page.match(/data-component="tabs"/g)).toHaveLength(2);
    expect(page.slice(page.indexOf("## Examples"), page.indexOf("## Anatomy")).match(/```html/g)).toHaveLength(2);
  });

  it("uses the upstream content and Tailwind composition", () => {
    const page = read("components/tabs.md");
    expect(page).toContain("Log in to your account");
    expect(page).toContain("Start your 30-day free trial.");
    expect(page).toContain("Must be at least 8 characters.");
    expect(page).toContain("relative flex w-full items-center justify-around rounded-lg bg-muted p-1");
    expect(page).toContain("mt-4 flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm");
    expect(page).toContain("relative grid h-10 grid-cols-3 items-center rounded-lg bg-muted p-1");
    expect(page).toContain("Review product metrics, release readiness, and the ownership notes for the next milestone.");
  });

  it("keeps Framer Motion in the documentation layer", () => {
    const page = read("components/tabs.md");
    const theme = read(".vitepress/theme/index.ts");
    const behavior = read(".vitepress/theme/tabs-examples.ts");
    const packageJson = readFileSync(join(process.cwd(), "packages/tabs/package.json"), "utf8");
    expect(page).toContain('data-example-variant="framer-motion"');
    expect(page).toContain("data-tabs-motion-indicator");
    expect(theme).toContain("installTabsExamples");
    expect(behavior).toContain('from "framer-motion/dom"');
    expect(behavior).toContain("stiffness: 520");
    expect(behavior).toContain("damping: 38");
    expect(packageJson).not.toContain("framer-motion");
  });

  it("keeps the live default example interactive", () => {
    defineTabsElements();
    document.body.innerHTML = `
      <aria-tabs default-value="signin">
        <aria-tabs-list>
          <aria-tabs-trigger value="signin">Sign in</aria-tabs-trigger>
          <aria-tabs-trigger value="signup">Sign up</aria-tabs-trigger>
        </aria-tabs-list>
        <aria-tabs-panel>
          <aria-tabs-content value="signin">Sign in form</aria-tabs-content>
          <aria-tabs-content value="signup">Sign up form</aria-tabs-content>
        </aria-tabs-panel>
      </aria-tabs>
    `;
    const triggers = document.querySelectorAll<HTMLElement>("aria-tabs-trigger");
    const contents = document.querySelectorAll<HTMLElement>("aria-tabs-content");
    triggers[1]!.click();
    expect(triggers[1]!.getAttribute("aria-selected")).toBe("true");
    expect(contents[0]!.hidden).toBe(true);
    expect(contents[1]!.hidden).toBe(false);
  });
});
