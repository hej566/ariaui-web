import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { defineTextareaElements } from "@ariaui-web/textarea";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), "web/doc/docs", relativePath), "utf8");

describe("Textarea examples", () => {
  afterEach(() => document.body.replaceChildren());

  it("matches the upstream page structure and example set", () => {
    const page = read("components/textarea.md");
    expect(page).toContain("## Features");
    expect(page).toContain("## Installation");
    expect(page).toContain("## Examples");
    expect(page).toContain("### Uncontrolled");
    expect(page).toContain("### Controlled");
    expect(page).toContain("### Disabled");
    expect(page).toContain("## Anatomy");
    expect(page).toContain("## API Reference");
    expect(page).toContain("## Accessibility");
    expect(page.match(/data-component="textarea"/g)).toHaveLength(3);
    expect(page.slice(page.indexOf("## Examples"), page.indexOf("## Anatomy")).match(/```html/g)).toHaveLength(3);
  });

  it("uses the exact upstream content and Tailwind composition", () => {
    const page = read("components/textarea.md");
    expect(page.match(/Type your message here/g)?.length).toBeGreaterThanOrEqual(6);
    expect(page.match(/This is a hint text to help user\./g)?.length).toBeGreaterThanOrEqual(6);
    expect(page).toContain("mx-auto flex w-full max-w-md flex-col");
    expect(page).toContain("mb-1.5 block text-sm font-medium text-foreground");
    expect(page).toContain("h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm placeholder:text-muted-foreground");
    expect(page).toContain("min-h-20 h-auto resize-y py-2 shadow-xs disabled:cursor-not-allowed disabled:opacity-50");
    expect(page).toContain("mt-1.5 text-xs text-muted-foreground");
  });

  it("wires the controlled example through the docs theme", () => {
    const page = read("components/textarea.md");
    const theme = read(".vitepress/theme/index.ts");
    const behavior = read(".vitepress/theme/textarea-examples.ts");
    expect(page).toContain('data-textarea-controlled');
    expect(theme).toContain("installTextareaExamples");
    expect(behavior).toContain("valuechange");
    expect(behavior).toContain("root.value = value");
  });

  it("keeps native typing and disabled state functional", async () => {
    defineTextareaElements();
    document.body.innerHTML = `
      <aria-textarea default-value="hello"></aria-textarea>
      <aria-textarea disabled></aria-textarea>
    `;
    const roots = document.querySelectorAll<HTMLElement & { control: HTMLTextAreaElement; value: string }>("aria-textarea");
    const event = new InputEvent("input", { bubbles: true });
    roots[0]!.control.value = "hello world";
    roots[0]!.control.dispatchEvent(event);
    await Promise.resolve();
    expect(roots[0]!.value).toBe("hello world");
    expect(roots[1]!.control.disabled).toBe(true);
  });
});
