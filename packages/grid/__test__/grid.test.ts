import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createGridElement, defineGridElements, getPartSpec, type ComponentPartName } from "../src";

type RuntimeElement = HTMLElement & {
  checked: boolean;
  defaultChecked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  open: boolean;
  pressed: boolean;
  selected: boolean;
  value: string;
};

type RuntimePartSpec = {
  readonly name: string;
  readonly tagName: string;
  readonly defaultRole: string | null;
  readonly defaultAttributes: Readonly<Record<string, string>>;
};

type RuntimeElementList = [RuntimeElement, RuntimeElement, RuntimeElement, RuntimeElement, ...RuntimeElement[]];

const checkableRoles = new Set(["checkbox", "menuitemcheckbox", "menuitemradio", "radio", "switch"]);
const buttonLikeRoles = new Set(["button", "checkbox", "link", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch", "tab"]);
const expandableRoles = new Set(["button", "combobox", "menuitem"]);
const selectableRoles = new Set(["option", "row", "tab", "treeitem"]);
const focusableRoles = new Set(["button", "checkbox", "link", "menuitemcheckbox", "menuitemradio", "option", "switch", "tab"]);

function documentedRequirementAttributes() {
  const attributes = new Set<string>();
  const tagNames: ReadonlySet<string> = new Set(componentSpec.parts.map((part) => part.tagName));
  const attributePattern = /\b(?:aria|data)-[a-z0-9-]+\b|\bnative-composition\b|\bdefault-open\b|\bdismissible\b|\btabIndex\b|\btabindex\b|\brole\b|\bid\b|\bdir\b|\borientation\b|\bdisabled\b|\brequired\b|\bvalue\b|\bopen\b|\bchecked\b|\bselected\b|\bpressed\b/g;

  for (const section of componentSpec.learnedRequirements.sections) {
    for (const requirement of section.requirements) {
      for (const match of requirement.matchAll(attributePattern)) {
        const attribute = match[0] === "tabIndex" ? "tabindex" : match[0];
        if (!tagNames.has(attribute)) {
          attributes.add(attribute);
        }
      }
    }
  }

  return Array.from(attributes).sort();
}

function kebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
}

function appendPart(tagName: string) {
  const element = document.createElement(tagName) as RuntimeElement;
  document.body.append(element);
  return element;
}

describe("@ariaui-web/grid", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/grid");
    expect(componentSpec.slug).toBe("grid");
    expect("sourcePackage" in componentSpec).toBe(false);
    expect(componentSpec.parts.length).toBeGreaterThan(0);
    expect(componentSpec.parts[0]?.name).toBe("Root");

    for (const part of componentSpec.parts) {
      expect(part.tagName).toMatch(/^aria-[a-z0-9-]+$/);
      expect("source" in part).toBe(false);
    }
  });

  it("maps documented spec attributes into runtime metadata", () => {
    const documentedAttributes = documentedRequirementAttributes();
    const specWithRequirements = componentSpec as typeof componentSpec & {
      requirementAttributes?: readonly string[];
      parts: readonly RuntimePartSpec[];
    };

    expect(specWithRequirements.requirementAttributes).toEqual(documentedAttributes);

    for (const part of specWithRequirements.parts) {
      expect(part.defaultAttributes).toBeDefined();

      for (const attribute of Object.keys(part.defaultAttributes)) {
        expect(documentedAttributes).toContain(attribute);
      }

      if (documentedAttributes.includes("aria-expanded") && part.defaultRole && expandableRoles.has(part.defaultRole)) {
        expect(part.defaultAttributes["aria-expanded"]).toBe("false");
      }


    }
  });

  it("exposes helpers that resolve and create every spec part", () => {
    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);

      const element = createGridElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/grid part");
  });

  it("defines all custom elements idempotently", () => {
    defineGridElements();
    defineGridElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineGridElements();
    const element = createGridElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("grid");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineGridElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("grid");
      expect(element.getAttribute("data-package")).toBe("grid");
      expect(element.getAttribute("data-part")).toBe(part.name);
      expect(element.getAttribute("part")).toBe(kebabCase(part.name));
      for (const [attribute, value] of Object.entries(runtimePart.defaultAttributes)) {
        expect(element.getAttribute(attribute)).toBe(value);
      }

      if (part.defaultRole) {
        expect(element.getAttribute("role")).toBe(part.defaultRole);
      } else {
        expect(element.hasAttribute("role")).toBe(false);
      }

      const roleOverride = document.createElement(part.tagName);
      roleOverride.setAttribute("role", "presentation");
      document.body.append(roleOverride);
      expect(roleOverride.getAttribute("role")).toBe("presentation");
    }
  });

  it("reflects shared state attributes required by the generated spec", () => {
    defineGridElements();
    const element = appendPart(componentSpec.parts[0]!.tagName);
    const rootPart = componentSpec.parts[0] as RuntimePartSpec;

    element.setAttribute("orientation", "vertical");
    element.value = "alpha";
    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.disabled = true;

    expect(element.getAttribute("data-orientation")).toBe("vertical");
    expect(element.getAttribute("data-value")).toBe("alpha");
    expect(element.getAttribute("data-state")).toBe("open");
    expect(element.getAttribute("aria-expanded")).toBe("true");
    expect(element.getAttribute("aria-pressed")).toBe("true");
    expect(element.getAttribute("aria-selected")).toBe("true");
    expect(element.getAttribute("aria-disabled")).toBe("true");
    expect(element.getAttribute("data-disabled")).toBe("");

    element.removeAttribute("orientation");
    element.removeAttribute("value");
    element.open = false;
    element.pressed = false;
    element.selected = false;
    element.disabled = false;

    if (rootPart.defaultAttributes.orientation) {
      expect(element.getAttribute("data-orientation")).toBe(rootPart.defaultAttributes.orientation);
    } else {
      expect(element.hasAttribute("data-orientation")).toBe(false);
    }
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    defineGridElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !checkableRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      const defaultElement = document.createElement(part.tagName) as RuntimeElement;
      defaultElement.defaultChecked = true;
      document.body.append(defaultElement);

      expect(element.getAttribute("role")).toBe(role);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }
      expect(element.checked).toBe(false);
      expect(element.getAttribute("aria-checked")).toBe("false");
      expect(element.getAttribute("data-state")).toBe("unchecked");
      expect(defaultElement.checked).toBe(true);
      expect(defaultElement.getAttribute("aria-checked")).toBe("true");
      expect(defaultElement.getAttribute("data-state")).toBe("checked");

      element.checked = false;
      element.setAttribute("name", "field");
      element.setAttribute("required", "");
      element.value = "on";
      element.click();

      const hiddenInput = element.querySelector("input[data-ariaui-web-hidden-input='true']");

      expect(element.checked).toBe(true);
      expect(element.getAttribute("aria-checked")).toBe("true");
      expect(element.getAttribute("data-state")).toBe("checked");
      expect(hiddenInput).toBeInstanceOf(HTMLInputElement);
      expect(hiddenInput).toMatchObject({
        name: "field",
        required: true,
        value: "on",
      });

      element.indeterminate = true;
      expect(element.getAttribute("aria-checked")).toBe("mixed");
      expect(element.getAttribute("data-state")).toBe("indeterminate");
      element.click();

      expect(element.indeterminate).toBe(false);
      expect(element.checked).toBe(true);
      expect(element.getAttribute("aria-checked")).toBe("true");

      let clickCount = 0;
      element.disabled = true;
      element.addEventListener("click", () => {
        clickCount += 1;
      });
      element.click();

      expect(element.checked).toBe(true);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("-1");
      }
      expect(clickCount).toBe(0);

      element.removeAttribute("name");
      expect(element.querySelector("input[data-ariaui-web-hidden-input='true']")).toBeNull();
    }
  });

  it("implements expandable and selectable role reflection from the generated spec", () => {
    defineGridElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const role = part.defaultRole as string | null;

      if (role && expandableRoles.has(role)) {
        expect(element.getAttribute("aria-expanded")).toBe("false");
        element.open = true;
        expect(element.getAttribute("aria-expanded")).toBe("true");
        element.open = false;
        expect(element.getAttribute("aria-expanded")).toBe("false");
      }


    }
  });

  it("implements keyboard activation and disabled guards for button-like roles", () => {
    defineGridElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role)) {
        expect(element.getAttribute("tabindex")).toBe("0");
      }

      if (role === "button") {
        element.pressed = true;
        element.click();
        expect(element.pressed).toBe(false);
      }

      let clickCount = 0;
      element.addEventListener("click", () => {
        clickCount += 1;
      });
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      const spaceKeyDown = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
      element.dispatchEvent(spaceKeyDown);
      element.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }));

      expect(spaceKeyDown.defaultPrevented).toBe(true);
      expect(clickCount).toBe(2);

      element.disabled = true;
      const disabledKeyDown = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
      element.dispatchEvent(disabledKeyDown);
      element.click();

      expect(disabledKeyDown.defaultPrevented).toBe(true);
      expect(element.getAttribute("aria-disabled")).toBe("true");
      expect(element.getAttribute("data-disabled")).toBe("");
      expect(clickCount).toBe(2);
    }
  });





  function dispatchGridKey(element: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  function createGridFixture(options: { defaultValue?: string; value?: string } = {}) {
    defineGridElements();
    const root = document.createElement("aria-grid") as RuntimeElement;
    const head = document.createElement("aria-grid-head") as RuntimeElement;
    const headRow = document.createElement("aria-grid-row") as RuntimeElement;
    const body = document.createElement("aria-grid-body") as RuntimeElement;
    const rows = [
      { id: "john", name: "John Doe", role: "Admin", status: "Active" },
      { id: "jane", name: "Jane Smith", role: "Member", status: "Active" },
      { id: "bob", name: "Bob Jones", role: "Viewer", status: "Inactive" },
    ];
    const fields = ["name", "role", "status"] as const;
    const headerCells: RuntimeElement[] = [];
    const rowElements: RuntimeElement[] = [];
    const cells: RuntimeElement[] = [];

    root.setAttribute("aria-label", "Team members");
    if (options.defaultValue !== undefined) {
      root.setAttribute("default-value", options.defaultValue);
    }
    if (options.value !== undefined) {
      root.value = options.value;
    }

    for (const label of ["Name", "Role", "Status"]) {
      const header = document.createElement("aria-grid-header") as RuntimeElement;
      header.textContent = label;
      headRow.append(header);
      headerCells.push(header);
    }
    head.append(headRow);

    rows.forEach((row) => {
      const rowElement = document.createElement("aria-grid-row") as RuntimeElement;
      fields.forEach((field) => {
        const cell = document.createElement("aria-grid-cell") as RuntimeElement;
        cell.value = row.id + ":" + field;
        cell.textContent = row[field];
        rowElement.append(cell);
        cells.push(cell);
      });
      body.append(rowElement);
      rowElements.push(rowElement);
    });

    root.append(head, body);
    document.body.append(root);

    return {
      root,
      head,
      body,
      headRow,
      headerCells: headerCells as RuntimeElementList,
      rowElements: rowElements as RuntimeElementList,
      cells: cells as RuntimeElementList,
    };
  }

  function selectedGridValues(cells: readonly RuntimeElement[]) {
    return cells.filter((cell) => cell.getAttribute("data-selected") === "true").map((cell) => cell.getAttribute("data-value"));
  }

  it("matches the source Grid part roles, coordinates, and default selected roving cell", () => {
    const { root, head, body, headRow, headerCells, rowElements, cells } = createGridFixture({
      defaultValue: "jane:role",
    });

    expect(componentSpec.parts.find((part) => part.name === "Cell")?.defaultRole).toBe("gridcell");
    expect(componentSpec.parts.find((part) => part.name === "Header")?.defaultRole).toBe("columnheader");
    expect(root.getAttribute("role")).toBe("grid");
    expect(root.getAttribute("aria-label")).toBe("Team members");
    expect(head.hasAttribute("role")).toBe(false);
    expect(body.hasAttribute("role")).toBe(false);
    expect(headRow.getAttribute("role")).toBe("row");
    expect(rowElements[0].getAttribute("role")).toBe("row");
    expect(rowElements[0].hasAttribute("aria-selected")).toBe(false);
    expect(headerCells.map((header) => header.getAttribute("role"))).toEqual(["columnheader", "columnheader", "columnheader"]);
    expect(headerCells.every((header) => !header.hasAttribute("tabindex"))).toBe(true);
    expect(cells.map((cell) => cell.getAttribute("role"))).toEqual(Array(9).fill("gridcell"));
    expect(cells[0].getAttribute("data-row")).toBe("0");
    expect(cells[0].getAttribute("data-col")).toBe("0");
    expect(cells[0].getAttribute("data-value")).toBe("john:name");
    expect(cells[4]!.getAttribute("data-row")).toBe("1");
    expect(cells[4]!.getAttribute("data-col")).toBe("1");
    expect(cells[4]!.getAttribute("data-value")).toBe("jane:role");
    expect(cells[4]!.getAttribute("tabindex")).toBe("0");
    expect(cells[4]!.getAttribute("data-focused")).toBe("true");
    expect(cells[4]!.getAttribute("aria-selected")).toBe("true");
    expect(cells[4]!.getAttribute("data-selected")).toBe("true");
    expect(cells[0].getAttribute("tabindex")).toBe("-1");
    expect(cells[0].hasAttribute("data-selected")).toBe(false);
    expect(root.value).toBe("jane:role");
  });

  it("moves roving focus with Grid keyboard navigation without changing selection", () => {
    const { cells } = createGridFixture();

    cells[0].click();
    expect(document.activeElement).toBe(cells[0]);
    expect(cells[0].getAttribute("tabindex")).toBe("0");
    expect(cells[0].getAttribute("data-selected")).toBe("true");

    dispatchGridKey(cells[0], "ArrowRight");
    expect(document.activeElement).toBe(cells[1]);
    expect(cells[0].getAttribute("data-selected")).toBe("true");
    expect(cells[1].hasAttribute("data-selected")).toBe(false);

    dispatchGridKey(cells[1], "ArrowLeft");
    expect(document.activeElement).toBe(cells[0]);
    dispatchGridKey(cells[0], "ArrowDown");
    expect(document.activeElement).toBe(cells[3]);
    dispatchGridKey(cells[3], "ArrowUp");
    expect(document.activeElement).toBe(cells[0]);
    dispatchGridKey(cells[0], "End");
    expect(document.activeElement).toBe(cells[2]);
    dispatchGridKey(cells[2], "Home");
    expect(document.activeElement).toBe(cells[0]);
    dispatchGridKey(cells[0], "End", { ctrlKey: true });
    expect(document.activeElement).toBe(cells[8]);
    dispatchGridKey(cells[8]!, "Home", { ctrlKey: true });
    expect(document.activeElement).toBe(cells[0]);
    expect(cells[0].getAttribute("tabindex")).toBe("0");
    expect(cells[8]!.getAttribute("tabindex")).toBe("-1");
  });

  it("selects clicked cells by value and emits source-equivalent value arrays", () => {
    const { root, cells } = createGridFixture();
    const onValueChange = vi.fn();
    root.addEventListener("valuechange", (event) => {
      onValueChange((event as CustomEvent).detail.value);
    });

    cells[4]!.click();

    expect(onValueChange).toHaveBeenLastCalledWith(["jane:role"]);
    expect(root.value).toBe("jane:role");
    expect(cells[4]!.getAttribute("data-selected")).toBe("true");
    expect(cells[0].hasAttribute("data-selected")).toBe(false);

    dispatchGridKey(cells[4]!, "ArrowRight");
    expect(document.activeElement).toBe(cells[5]);
    expect(cells[4]!.getAttribute("data-selected")).toBe("true");

    dispatchGridKey(cells[5]!, "Enter");
    expect(onValueChange).toHaveBeenLastCalledWith(["jane:role", "jane:status"]);
    expect(cells[4]!.getAttribute("data-selected")).toBe("true");
    expect(cells[5]!.getAttribute("data-selected")).toBe("true");

    dispatchGridKey(cells[5]!, " ");
    expect(onValueChange).toHaveBeenLastCalledWith(["jane:role"]);
    expect(cells[4]!.getAttribute("data-selected")).toBe("true");
    expect(cells[5]!.hasAttribute("data-selected")).toBe(false);
  });

  it("implements the source Grid multi-selection keyboard shortcuts", () => {
    const { root, cells } = createGridFixture();
    const values: unknown[] = [];
    root.addEventListener("valuechange", (event) => {
      values.push((event as CustomEvent).detail.value);
    });

    cells[0].click();
    dispatchGridKey(cells[0], "a", { ctrlKey: true });
    expect(selectedGridValues(cells)).toEqual([
      "john:name",
      "john:role",
      "john:status",
      "jane:name",
      "jane:role",
      "jane:status",
      "bob:name",
      "bob:role",
      "bob:status",
    ]);

    dispatchGridKey(cells[0], "Escape");
    expect(selectedGridValues(cells)).toEqual([]);
    expect(values.at(-1)).toEqual([]);

    cells[3].click();
    dispatchGridKey(cells[3], " ", { shiftKey: true });
    expect(values.at(-1)).toEqual(["jane:name", "jane:role", "jane:status"]);
    expect(selectedGridValues(cells)).toEqual(["jane:name", "jane:role", "jane:status"]);

    dispatchGridKey(cells[3], " ", { shiftKey: true });
    expect(values.at(-1)).toEqual([]);
    expect(selectedGridValues(cells)).toEqual([]);

    cells[1].click();
    dispatchGridKey(cells[1], " ", { ctrlKey: true });
    expect(values.at(-1)).toEqual(["john:role", "jane:role", "bob:role"]);
    expect(selectedGridValues(cells)).toEqual(["john:role", "jane:role", "bob:role"]);

    dispatchGridKey(cells[1], " ", { ctrlKey: true });
    expect(values.at(-1)).toEqual([]);
    expect(selectedGridValues(cells)).toEqual([]);

    cells[0].click();
    dispatchGridKey(cells[0], "ArrowRight", { shiftKey: true });
    expect(document.activeElement).toBe(cells[1]);
    expect(values.at(-1)).toEqual(["john:name", "john:role"]);
    expect(selectedGridValues(cells)).toEqual(["john:name", "john:role"]);

    dispatchGridKey(cells[1], "ArrowLeft", { shiftKey: true });
    expect(document.activeElement).toBe(cells[0]);
    expect(values.at(-1)).toEqual(["john:role"]);
    expect(selectedGridValues(cells)).toEqual(["john:role"]);
  });

});
