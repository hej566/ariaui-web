import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { defineTableElements } from "@ariaui-web/table";
import { installTableExamples } from "../docs/.vitepress/theme/table-examples";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), "web/doc/docs", relativePath), "utf8");

describe("Table examples", () => {
  afterEach(() => document.body.replaceChildren());

  it("matches the upstream page structure and example set", () => {
    const page = read("components/table.md");

    expect(page).toContain("## Features");
    expect(page).toContain("## Installation");
    expect(page).toContain("## Examples");
    expect(page).toContain("### Invoice table");
    expect(page).toContain("### Data table");
    expect(page).toContain("## Anatomy");
    expect(page).toContain("## API Reference");
    expect(page).toContain("## Accessibility");
    expect(page.match(/data-component="table"/g)).toHaveLength(2);
    expect(page.slice(page.indexOf("## Examples"), page.indexOf("## Anatomy")).match(/```html/g)).toHaveLength(2);
  });

  it("uses the exact upstream table content and Tailwind composition", () => {
    const page = read("components/table.md");

    expect(page).toContain("INV001");
    expect(page).toContain("$1,300.00");
    expect(page).toContain("A list of your recent invoices.");
    expect(page).toContain("michael.mitc@example.com");
    expect(page).toContain("0 of 5 row(s) selected.");
    expect(page).toContain("overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm");
    expect(page).toContain("h-10 px-4 text-left align-middle font-medium text-foreground");
    expect(page).toContain("h-[52px] px-4 align-middle text-foreground");
    expect(page).toContain("border-b border-border hover:bg-muted/40");
  });

  it("filters rows and keeps row selection consumer-owned", () => {
    defineTableElements();
    document.body.innerHTML = `
      <div data-component="table" data-example-variant="data-table">
        <input data-table-filter />
        <button data-table-select-all aria-pressed="false"></button>
        <aria-table-body>
          <aria-table-row data-table-data-row data-email="one@example.com"><button data-table-select-row aria-pressed="false"></button></aria-table-row>
          <aria-table-row data-table-data-row data-email="two@example.com"><button data-table-select-row aria-pressed="false"></button></aria-table-row>
        </aria-table-body>
        <span data-table-selection-summary></span>
      </div>
    `;
    installTableExamples(document);
    const filter = document.querySelector<HTMLInputElement>("[data-table-filter]")!;
    const rows = document.querySelectorAll<HTMLElement>("[data-table-data-row]");

    filter.value = "two";
    filter.dispatchEvent(new Event("input", { bubbles: true }));
    expect(rows[0]!.hidden).toBe(true);
    expect(rows[1]!.hidden).toBe(false);

    rows[1]!.querySelector<HTMLElement>("[data-table-select-row]")!.click();
    expect(rows[1]!.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector("[data-table-selection-summary]")?.textContent).toBe("1 of 1 row(s) selected.");
  });
});
