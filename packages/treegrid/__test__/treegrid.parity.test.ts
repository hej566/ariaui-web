import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineTreegridElements } from "../src";

type TreegridRoot = HTMLElement & {
  defaultExpanded: string[];
  defaultValue: string | string[];
  disabled: boolean;
  expanded: string[];
  multiSelect: boolean;
  onExpandedChange: ((value: string[]) => void) | null;
  onValueChange: ((value: string | string[]) => void) | null;
  value: string | string[];
};

function mount(markup = basicMarkup()) {
  const fixture = document.createElement("div");
  fixture.innerHTML = markup;
  document.body.append(fixture);
  return fixture.querySelector<TreegridRoot>("aria-treegrid")!;
}

function basicMarkup(rootAttributes = "") {
  return `
    <aria-treegrid aria-label="Files" ${rootAttributes}>
      <aria-treegrid-header>
        <div role="row">
          <aria-treegrid-column-header>Name</aria-treegrid-column-header>
          <aria-treegrid-column-header>Type</aria-treegrid-column-header>
        </div>
      </aria-treegrid-header>
      <aria-treegrid-body>
        <aria-treegrid-row value="src">
          <aria-treegrid-row-header>src</aria-treegrid-row-header>
          <aria-treegrid-cell>folder</aria-treegrid-cell>
        </aria-treegrid-row>
        <aria-treegrid-group>
          <aria-treegrid-row value="index">
            <aria-treegrid-row-header>index.ts</aria-treegrid-row-header>
            <aria-treegrid-cell>TypeScript</aria-treegrid-cell>
          </aria-treegrid-row>
          <aria-treegrid-row value="components">
            <aria-treegrid-row-header>components</aria-treegrid-row-header>
            <aria-treegrid-cell>folder</aria-treegrid-cell>
          </aria-treegrid-row>
          <aria-treegrid-group>
            <aria-treegrid-row value="button">
              <aria-treegrid-row-header>Button.ts</aria-treegrid-row-header>
              <aria-treegrid-cell>TypeScript</aria-treegrid-cell>
            </aria-treegrid-row>
          </aria-treegrid-group>
        </aria-treegrid-group>
        <aria-treegrid-row value="readme">
          <aria-treegrid-row-header>README.md</aria-treegrid-row-header>
          <aria-treegrid-cell>Markdown</aria-treegrid-cell>
        </aria-treegrid-row>
      </aria-treegrid-body>
    </aria-treegrid>`;
}

function row(root: HTMLElement, id: string) {
  return root.querySelector<HTMLElement>(`aria-treegrid-row[value="${id}"]`)!;
}

function cell(root: HTMLElement, id: string, col = 0) {
  return row(root, id).querySelectorAll<HTMLElement>("aria-treegrid-row-header, aria-treegrid-cell")[col]!;
}

function key(root: HTMLElement, value: string, options: KeyboardEventInit = {}) {
  root.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: value, ...options }));
}

function mouse(target: HTMLElement, options: MouseEventInit = {}) {
  target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, ...options }));
}

describe("@ariaui-web/treegrid source parity", () => {
  beforeAll(() => defineTreegridElements());

  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("applies the complete treegrid role structure", () => {
    const root = mount();
    expect(root.getAttribute("role")).toBe("treegrid");
    expect(root.getAttribute("tabindex")).toBe("-1");
    expect(root.querySelector("aria-treegrid-header")?.getAttribute("role")).toBe("rowgroup");
    expect(root.querySelector("aria-treegrid-body")?.getAttribute("role")).toBe("rowgroup");
    expect(root.querySelector("aria-treegrid-group")?.getAttribute("role")).toBe("rowgroup");
    expect(row(root, "src").getAttribute("role")).toBe("row");
    expect(cell(root, "src").getAttribute("role")).toBe("rowheader");
    expect(cell(root, "src", 1).getAttribute("role")).toBe("gridcell");
  });

  it("derives row ids, parents, levels, cells, and expandable state", () => {
    const root = mount();
    expect(row(root, "src").dataset.rowId).toBe("src");
    expect(row(root, "src").getAttribute("aria-level")).toBe("1");
    expect(row(root, "src").getAttribute("aria-expanded")).toBe("false");
    expect(row(root, "index").dataset.parentRowId).toBe("src");
    expect(row(root, "index").getAttribute("aria-level")).toBe("2");
    expect(row(root, "components").getAttribute("aria-expanded")).toBe("false");
    expect(row(root, "button").getAttribute("aria-level")).toBe("3");
    expect(row(root, "readme").hasAttribute("aria-expanded")).toBe(false);
    expect(cell(root, "src").dataset.col).toBe("0");
    expect(cell(root, "src", 1).dataset.col).toBe("1");
  });

  it("generates stable ids for rows without values", () => {
    const root = mount(`<aria-treegrid><aria-treegrid-body><aria-treegrid-row><aria-treegrid-row-header>Untitled</aria-treegrid-row-header></aria-treegrid-row></aria-treegrid-body></aria-treegrid>`);
    const generated = root.querySelector<HTMLElement>("aria-treegrid-row")!.dataset.rowId;
    root.setAttribute("aria-label", "Updated");
    expect(generated).toMatch(/^ariaui-treegrid-row-/);
    expect(root.querySelector<HTMLElement>("aria-treegrid-row")!.dataset.rowId).toBe(generated);
  });

  it("hides ordinary collapsed groups and reveals default-expanded branches", () => {
    const closed = mount();
    expect(closed.querySelector("aria-treegrid-group")?.hasAttribute("hidden")).toBe(true);
    document.body.replaceChildren();
    const open = mount(basicMarkup('default-expanded="src,components"'));
    expect(open.querySelector("aria-treegrid-group")?.hasAttribute("hidden")).toBe(false);
    expect(row(open, "button").hasAttribute("hidden")).toBe(false);
  });

  it("keeps native-composition groups measurable with collapsed metadata", () => {
    const root = mount(`
      <aria-treegrid><aria-treegrid-body>
        <aria-treegrid-row value="parent"><aria-treegrid-row-header>Parent</aria-treegrid-row-header></aria-treegrid-row>
        <aria-treegrid-group native-composition><section class="motion-group">
          <aria-treegrid-row value="child"><aria-treegrid-row-header>Child</aria-treegrid-row-header></aria-treegrid-row>
        </section></aria-treegrid-group>
      </aria-treegrid-body></aria-treegrid>`);
    const group = root.querySelector<HTMLElement>(".motion-group")!;
    expect(group.getAttribute("role")).toBe("rowgroup");
    expect(group.hasAttribute("hidden")).toBe(false);
    expect(group.getAttribute("aria-hidden")).toBe("true");
    expect(group.hasAttribute("data-treegrid-collapsed-branch")).toBe(true);
    expect(row(root, "child").getAttribute("aria-hidden")).toBe("true");
    expect(row(root, "child").hasAttribute("data-treegrid-collapsed-row")).toBe(true);
  });

  it("toggles expansion from row-header click and Arrow keys", () => {
    const root = mount();
    cell(root, "src").click();
    expect(row(root, "src").getAttribute("aria-expanded")).toBe("true");
    mouse(row(root, "src"));
    key(root, "ArrowLeft");
    expect(row(root, "src").getAttribute("aria-expanded")).toBe("false");
    key(root, "ArrowRight");
    expect(row(root, "src").getAttribute("aria-expanded")).toBe("true");
  });

  it("supports controlled expansion and expandedchange callbacks", () => {
    const root = mount(basicMarkup('expanded="src"'));
    const callback = vi.fn();
    root.onExpandedChange = callback;
    const event = vi.fn((raw: Event) => raw.preventDefault());
    root.addEventListener("expandedchange", event);
    cell(root, "src").click();
    expect(event).toHaveBeenCalledOnce();
    expect(callback).not.toHaveBeenCalled();
    expect(root.getAttribute("expanded")).toBe("src");
  });

  it("reflects multiselect and disabled root state", () => {
    const root = mount(basicMarkup("multi-select disabled"));
    expect(root.getAttribute("aria-multiselectable")).toBe("true");
    expect(root.getAttribute("aria-disabled")).toBe("true");
    cell(root, "src").click();
    expect(row(root, "src").getAttribute("aria-expanded")).toBe("false");
    mouse(row(root, "readme"));
    expect(row(root, "readme").getAttribute("aria-selected")).toBe("false");
  });

  it("selects one row and clears a prior cell selection in single mode", () => {
    const root = mount(basicMarkup('default-expanded="src"'));
    mouse(cell(root, "src", 1));
    expect(cell(root, "src", 1).getAttribute("aria-selected")).toBe("true");
    mouse(row(root, "readme"));
    expect(row(root, "readme").getAttribute("aria-selected")).toBe("true");
    expect(cell(root, "src", 1).getAttribute("aria-selected")).toBe("false");
    expect(root.value).toBe("readme");
  });

  it("toggles multiple rows with Ctrl+mouse and extends row ranges with Shift", () => {
    const root = mount(basicMarkup('default-expanded="src" multi-select'));
    mouse(row(root, "src"));
    mouse(row(root, "index"), { ctrlKey: true });
    mouse(row(root, "readme"), { shiftKey: true });
    expect(["src", "index", "components", "readme"].filter((id) => row(root, id).dataset.selected === "true")).toEqual(["index", "components", "readme"]);
  });

  it("selects a column with Ctrl+Space and all rows and cells with Ctrl+A", () => {
    const root = mount(basicMarkup('default-expanded="src" multi-select'));
    mouse(cell(root, "src", 1));
    key(root, " ", { ctrlKey: true });
    expect(cell(root, "src", 1).dataset.selected).toBe("true");
    expect(cell(root, "index", 1).dataset.selected).toBe("true");
    key(root, "a", { ctrlKey: true });
    expect(Array.from(root.querySelectorAll<HTMLElement>("aria-treegrid-row")).every((item) => item.dataset.selected === "true")).toBe(true);
    expect(Array.from(root.querySelectorAll<HTMLElement>("aria-treegrid-row-header, aria-treegrid-cell")).every((item) => item.dataset.selected === "true")).toBe(true);
  });

  it("dispatches valuechange and honors canceled controlled selection", () => {
    const root = mount(basicMarkup('value="src"'));
    const callback = vi.fn();
    root.onValueChange = callback;
    root.addEventListener("valuechange", (event) => event.preventDefault());
    mouse(row(root, "readme"));
    expect(root.getAttribute("value")).toBe("src");
    expect(callback).not.toHaveBeenCalled();
  });

  it("moves focus from the root to the first visible cell", () => {
    const root = mount();
    root.focus();
    expect(document.activeElement).toBe(cell(root, "src"));
    expect(cell(root, "src").tabIndex).toBe(0);
  });

  it("switches between row and cell focus modes", () => {
    const root = mount(basicMarkup('default-expanded="src"'));
    mouse(cell(root, "src"));
    key(root, "ArrowLeft");
    expect(document.activeElement).toBe(row(root, "src"));
    expect(row(root, "src").dataset.focused).toBe("true");
    key(root, "ArrowRight");
    expect(document.activeElement).toBe(cell(root, "src"));
  });

  it("navigates cells horizontally and visible rows vertically", () => {
    const root = mount(basicMarkup('default-expanded="src"'));
    mouse(cell(root, "src"));
    key(root, "ArrowRight");
    expect(document.activeElement).toBe(cell(root, "src", 1));
    key(root, "ArrowDown");
    expect(document.activeElement).toBe(cell(root, "index", 1));
    key(root, "ArrowUp");
    expect(document.activeElement).toBe(cell(root, "src", 1));
  });

  it("skips descendants hidden by a collapsed ancestor", () => {
    const root = mount();
    mouse(row(root, "src"));
    key(root, "ArrowDown");
    expect(document.activeElement).toBe(row(root, "readme"));
  });

  it("supports Home, End, Ctrl+Home, Ctrl+End, PageUp, and PageDown", () => {
    const rows = Array.from({ length: 8 }, (_, index) => `<aria-treegrid-row value="r${index}"><aria-treegrid-row-header>Row ${index}</aria-treegrid-row-header><aria-treegrid-cell>Value ${index}</aria-treegrid-cell></aria-treegrid-row>`).join("");
    const root = mount(`<aria-treegrid><aria-treegrid-body>${rows}</aria-treegrid-body></aria-treegrid>`);
    mouse(cell(root, "r3", 1));
    key(root, "Home");
    expect(document.activeElement).toBe(cell(root, "r3"));
    key(root, "End");
    expect(document.activeElement).toBe(cell(root, "r3", 1));
    key(root, "PageDown");
    expect(document.activeElement).toBe(cell(root, "r7", 1));
    key(root, "PageUp");
    expect(document.activeElement).toBe(cell(root, "r2", 1));
    key(root, "Home", { ctrlKey: true });
    expect(document.activeElement).toBe(cell(root, "r0"));
    key(root, "End", { ctrlKey: true });
    expect(document.activeElement).toBe(cell(root, "r7"));
  });

  it("buffers typeahead for 500ms and wraps through visible row labels", () => {
    vi.useFakeTimers();
    const root = mount(`<aria-treegrid><aria-treegrid-body>
      <aria-treegrid-row value="apple"><aria-treegrid-row-header>Apple</aria-treegrid-row-header></aria-treegrid-row>
      <aria-treegrid-row value="banana"><aria-treegrid-row-header>Banana</aria-treegrid-row-header></aria-treegrid-row>
      <aria-treegrid-row value="apricot"><aria-treegrid-row-header>Apricot</aria-treegrid-row-header></aria-treegrid-row>
    </aria-treegrid-body></aria-treegrid>`);
    mouse(row(root, "apple"));
    key(root, "b");
    expect(document.activeElement).toBe(row(root, "banana"));
    key(root, "a");
    expect(document.activeElement).toBe(row(root, "banana"));
    vi.advanceTimersByTime(600);
    key(root, "a");
    expect(document.activeElement).toBe(row(root, "apricot"));
    vi.advanceTimersByTime(600);
    key(root, "a");
    expect(document.activeElement).toBe(row(root, "apple"));
    vi.useRealTimers();
  });

  it("uses Enter to expand in row mode and Space to select", () => {
    const root = mount();
    mouse(row(root, "src"));
    key(root, "Enter");
    expect(row(root, "src").getAttribute("aria-expanded")).toBe("true");
    key(root, " ");
    expect(row(root, "src").getAttribute("aria-selected")).toBe("true");
  });

  it("forwards sortable column header activation", () => {
    const root = mount();
    const header = root.querySelector<HTMLElement>("aria-treegrid-column-header")! as HTMLElement & { onSort: (() => void) | null; sortDirection: string };
    const callback = vi.fn();
    header.setAttribute("sortable", "");
    header.sortDirection = "ascending";
    header.onSort = callback;
    header.click();
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(callback).toHaveBeenCalledOnce();
    expect(header.dispatchEvent(new CustomEvent("sort", { cancelable: true }))).toBe(true);
  });
});
