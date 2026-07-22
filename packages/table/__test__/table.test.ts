import { afterEach, describe, expect, it, vi } from "vitest";
import {
  componentSpec,
  createTableElement,
  defineTableElements,
  getPartSpec,
  type ComponentPartName,
} from "../src";

const expectedParts = [
  ["Root", "aria-table", "table"],
  ["Body", "aria-table-body", "rowgroup"],
  ["Caption", "aria-table-caption", "caption"],
  ["Cell", "aria-table-cell", "cell"],
  ["ColumnHeader", "aria-table-column-header", "columnheader"],
  ["Footer", "aria-table-footer", "rowgroup"],
  ["Header", "aria-table-header", "rowgroup"],
  ["Row", "aria-table-row", "row"],
  ["RowHeader", "aria-table-row-header", "rowheader"],
] as const;

function renderTable() {
  defineTableElements();
  document.body.innerHTML = `
    <aria-table id="invoices" class="custom-table" style="font-size: 14px" aria-label="Invoices">
      <aria-table-caption>A list of invoices</aria-table-caption>
      <aria-table-header>
        <aria-table-row id="header-row">
          <aria-table-column-header scope="col">Invoice</aria-table-column-header>
          <aria-table-column-header scope="col">Status</aria-table-column-header>
        </aria-table-row>
      </aria-table-header>
      <aria-table-body>
        <aria-table-row id="invoice-row" data-invoice="INV001">
          <aria-table-row-header>INV001</aria-table-row-header>
          <aria-table-cell>Paid</aria-table-cell>
        </aria-table-row>
      </aria-table-body>
      <aria-table-footer>
        <aria-table-row><aria-table-cell>Total</aria-table-cell></aria-table-row>
      </aria-table-footer>
    </aria-table>
  `;
  return document.querySelector<HTMLElement>("aria-table")!;
}

describe("@ariaui-web/table", () => {
  afterEach(() => document.body.replaceChildren());

  it("publishes every upstream part and defines elements idempotently", () => {
    expect(componentSpec.packageName).toBe("@ariaui-web/table");
    expect(componentSpec.parts.map((part) => [part.name, part.tagName, part.defaultRole])).toEqual(expectedParts);

    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);
      expect(createTableElement(part.name).localName).toBe(part.tagName);
    }
    expect(() => getPartSpec("Missing" as ComponentPartName)).toThrow("Unknown @ariaui-web/table part");

    defineTableElements();
    defineTableElements();
    for (const [, tagName] of expectedParts) expect(customElements.get(tagName)).toBeTruthy();
  });

  it("composes the equivalent semantic table structure", () => {
    const root = renderTable();

    expect(root.getAttribute("role")).toBe("table");
    expect(root.querySelector('[role="caption"]')?.textContent).toBe("A list of invoices");
    expect(root.querySelectorAll('[role="rowgroup"]')).toHaveLength(3);
    expect(root.querySelectorAll('[role="row"]')).toHaveLength(3);
    expect(root.querySelector('[role="columnheader"]')?.textContent).toBe("Invoice");
    expect(root.querySelector('[role="rowheader"]')?.textContent).toBe("INV001");
    expect(root.querySelector('[role="cell"]')?.textContent).toBe("Paid");
  });

  it("uses Caption as the accessible name without overriding a consumer name", async () => {
    defineTableElements();
    document.body.innerHTML = `
      <aria-table><aria-table-caption>Quarterly revenue</aria-table-caption></aria-table>
      <aria-table aria-label="Custom name"><aria-table-caption>Ignored caption</aria-table-caption></aria-table>
    `;
    const roots = document.querySelectorAll<HTMLElement>("aria-table");
    const caption = roots[0]!.querySelector<HTMLElement>("aria-table-caption")!;

    expect(caption.id).toMatch(/^aria-table-caption-/);
    expect(roots[0]!.getAttribute("aria-labelledby")).toBe(caption.id);
    expect(roots[1]!.getAttribute("aria-label")).toBe("Custom name");
    expect(roots[1]!.hasAttribute("aria-labelledby")).toBe(false);

    caption.remove();
    await new Promise((resolve) => setTimeout(resolve));
    expect(roots[0]!.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("defaults RowHeader scope to row and preserves an explicit override", () => {
    defineTableElements();
    document.body.innerHTML = `
      <aria-table-row-header>Default</aria-table-row-header>
      <aria-table-row-header scope="col">Override</aria-table-row-header>
    `;
    const headers = document.querySelectorAll<HTMLElement>("aria-table-row-header");

    expect(headers[0]!.getAttribute("scope")).toBe("row");
    expect(headers[1]!.getAttribute("scope")).toBe("col");
    headers[0]!.removeAttribute("scope");
    expect(headers[0]!.getAttribute("scope")).toBe("row");
  });

  it("applies only the Root overflow-wrapper layout", () => {
    const root = renderTable();
    const row = root.querySelector<HTMLElement>("aria-table-row")!;

    expect(root.style.position).toBe("relative");
    expect(root.style.width).toBe("100%");
    expect(root.style.overflow).toBe("auto");
    expect(row.getAttribute("style")).toBeNull();
  });

  it("preserves consumer classes, styles, attributes, and handlers", () => {
    const root = renderTable();
    const row = root.querySelector<HTMLElement>("#invoice-row")!;
    const onRootClick = vi.fn();
    const onRowClick = vi.fn((event: Event) => event.stopPropagation());
    root.addEventListener("click", onRootClick);
    row.addEventListener("click", onRowClick);

    expect(root.id).toBe("invoices");
    expect(root.className).toBe("custom-table");
    expect(root.style.fontSize).toBe("14px");
    expect(root.getAttribute("aria-label")).toBe("Invoices");
    expect(row.dataset.invoice).toBe("INV001");

    row.click();
    expect(onRowClick).toHaveBeenCalledOnce();
    expect(onRootClick).not.toHaveBeenCalled();
    root.click();
    expect(onRootClick).toHaveBeenCalledOnce();
  });

  it("does not own selection, sorting, pointer, or keyboard state", () => {
    const root = renderTable();
    const row = root.querySelector<HTMLElement>("#invoice-row")!;
    const header = root.querySelector<HTMLElement>("aria-table-column-header")!;

    expect(row.hasAttribute("aria-selected")).toBe(false);
    expect(row.hasAttribute("data-state")).toBe(false);
    row.click();
    row.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(row.hasAttribute("aria-selected")).toBe(false);

    row.setAttribute("aria-selected", "true");
    header.setAttribute("aria-sort", "ascending");
    expect(row.getAttribute("aria-selected")).toBe("true");
    expect(header.getAttribute("aria-sort")).toBe("ascending");
  });

  it("keeps every part available as a separated custom element", () => {
    defineTableElements();
    for (const [name, tagName, role] of expectedParts) {
      const element = document.createElement(tagName);
      document.body.append(element);
      expect(element.getAttribute("data-part")).toBe(name);
      expect(element.getAttribute("part")).toBe(name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());
      expect(element.getAttribute("role")).toBe(role);
    }
  });
});
