import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineComboboxElements } from "@ariaui-web/combobox";
import { afterEach, describe, expect, it } from "vitest";

type RuntimeComboboxElement = HTMLElement & {
  open: boolean;
};

function comboboxExampleMarkups() {
  const doc = readFileSync(join(process.cwd(), "web", "doc", "docs", "components", "combobox.md"), "utf8");
  const markups: string[] = [];

  for (const match of doc.matchAll(/<div class="[^"]*\bariaui-web-preview\b[^"]*" data-component="combobox" data-example-variant="[^"]+">\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = doc.indexOf("\n</div>\n\n```html", start);
    if (end === -1) {
      throw new Error("Missing closing markup for a combobox documentation example.");
    }
    markups.push(doc.slice(start, end).trim());
  }

  return markups;
}

function mouseActivate(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("combobox documentation focus behavior", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps each live example input focused when its arrow button opens and closes", () => {
    defineComboboxElements();
    const markups = comboboxExampleMarkups();
    document.body.innerHTML = markups
      .map((markup, index) => `<button data-outside="${index}">Outside</button><div data-focus-example="${index}">${markup}</div>`)
      .join("\n");

    const examples = Array.from(document.querySelectorAll<HTMLElement>("[data-focus-example]"));
    expect(examples).toHaveLength(5);

    examples.forEach((example, index) => {
      const outside = document.querySelector(`[data-outside="${index}"]`) as HTMLButtonElement;
      const root = example.querySelector("aria-combobox") as RuntimeComboboxElement;
      const input = root.querySelector("aria-combobox-input") as HTMLElement;
      const button = root.querySelector("aria-combobox-button") as HTMLElement;

      outside.focus();
      mouseActivate(button);
      expect(root.open).toBe(true);
      expect(document.activeElement).toBe(input);

      outside.focus();
      mouseActivate(button);
      expect(root.open).toBe(false);
      expect(document.activeElement).toBe(input);
    });
  });
});
