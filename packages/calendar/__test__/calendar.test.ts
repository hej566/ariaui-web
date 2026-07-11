import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createCalendarElement, defineCalendarElements, getPartSpec, type ComponentPartName } from "../src";

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

describe("@ariaui-web/calendar", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/calendar");
    expect(componentSpec.slug).toBe("calendar");
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

      const element = createCalendarElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/calendar part");
  });

  it("defines all custom elements idempotently", () => {
    defineCalendarElements();
    defineCalendarElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineCalendarElements();
    const element = createCalendarElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("calendar");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineCalendarElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("calendar");
      expect(element.getAttribute("data-package")).toBe("calendar");
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
    defineCalendarElements();
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
    defineCalendarElements();

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
    defineCalendarElements();

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
    defineCalendarElements();

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





  type RuntimeCalendarElement = RuntimeElement & {
    mode: string;
    visibleMonth: string;
  };

  function dispatchCalendarKey(element: Element, key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    element.dispatchEvent(event);
    return event;
  }

  function createCalendarFixture(options: { defaultDates?: string; mode?: string; visibleMonth?: string; withSelectors?: boolean } = {}) {
    defineCalendarElements();
    const root = document.createElement("aria-calendar") as RuntimeCalendarElement;
    const header = document.createElement("aria-calendar-header") as RuntimeElement;
    const previous = document.createElement("aria-calendar-header-previous") as RuntimeElement;
    const next = document.createElement("aria-calendar-header-next") as RuntimeElement;
    const body = document.createElement("aria-calendar-body") as RuntimeElement;

    root.setAttribute("aria-label", "Travel date");
    root.setAttribute("mode", options.mode ?? "single");
    root.setAttribute("default-dates", options.defaultDates ?? "2025-01-10");
    root.setAttribute("visible-month", options.visibleMonth ?? "2025-01-10");
    previous.textContent = "Previous";
    next.textContent = "Next";

    if (options.withSelectors) {
      header.append(previous, document.createElement("aria-calendar-month-select"), document.createElement("aria-calendar-year-select"), next);
    } else {
      header.append(previous, document.createElement("aria-calendar-header-month"), document.createElement("aria-calendar-header-year"), next);
    }

    root.append(header, body);
    document.body.append(root);

    return {
      body,
      header,
      next,
      previous,
      root,
    };
  }

  function calendarCells(root: Element) {
    return Array.from(root.querySelectorAll<HTMLElement>("aria-calendar-cell"));
  }

  function calendarCellByDate(root: Element, date: string) {
    const matches = calendarCells(root).filter((cell) => cell.getAttribute("date") === date || cell.getAttribute("data-date") === date);
    return matches.find((cell) => cell.getAttribute("aria-disabled") !== "true") ?? matches[0] ?? null;
  }

  it("matches source Calendar single-date rendering and default selected focus", () => {
    const { root } = createCalendarFixture();
    const cells = calendarCells(root);
    const selectedCell = calendarCellByDate(root, "2025-01-10");
    const outsideCell = cells.find((cell) => cell.getAttribute("data-outside-month") === "true");

    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Header",
      "HeaderPrevious",
      "HeaderMonth",
      "HeaderYear",
      "HeaderNext",
      "Body",
      "Head",
      "Row",
      "DayHeader",
      "Rows",
      "Cell",
      "MonthSelect",
      "YearSelect",
    ]);
    expect(root.mode).toBe("single");
    expect(root.value).toBe("2025-01-10");
    expect(root.visibleMonth).toBe("2025-01-10");
    expect(cells).toHaveLength(42);
    expect(selectedCell?.getAttribute("aria-selected")).toBe("true");
    expect(selectedCell?.getAttribute("data-selected")).toBe("true");
    expect(selectedCell?.getAttribute("tabindex")).toBe("0");
    expect(selectedCell?.querySelector("[data-slot='calendar-cell-inner']")).toBeTruthy();
    expect(outsideCell?.getAttribute("aria-disabled")).toBe("true");
  });

  it("selects clicked dates and emits source-equivalent Calendar value details", () => {
    const { root } = createCalendarFixture();
    const onValueChange = vi.fn();
    root.addEventListener("valuechange", (event) => {
      onValueChange((event as CustomEvent).detail.values);
    });
    const fifteenth = calendarCellByDate(root, "2025-01-15");

    fifteenth?.click();

    expect(root.value).toBe("2025-01-15");
    expect(fifteenth?.getAttribute("aria-selected")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith(["2025-01-15"]);
  });

  it("matches source Calendar range state and first-click range restart", () => {
    const { root } = createCalendarFixture({
      defaultDates: "2025-01-10,2025-01-20",
      mode: "range",
    });
    const tenth = calendarCellByDate(root, "2025-01-10");
    const twentieth = calendarCellByDate(root, "2025-01-20");
    const fifteenth = calendarCellByDate(root, "2025-01-15");

    expect(tenth?.getAttribute("data-range-start")).toBe("true");
    expect(twentieth?.getAttribute("data-range-end")).toBe("true");
    expect(fifteenth?.getAttribute("data-in-range")).toBe("true");

    fifteenth?.click();

    expect(root.value).toBe("2025-01-15");
    expect(fifteenth?.getAttribute("data-range-start")).toBe("true");
    expect(fifteenth?.getAttribute("data-in-range")).toBe("true");
    expect(twentieth?.hasAttribute("data-range-end")).toBe(false);
  });

  it("renders source Calendar dual-range consecutive panes", () => {
    const { root } = createCalendarFixture({
      defaultDates: "2025-01-12,2025-02-08",
      mode: "dual-range",
      visibleMonth: "2025-01-12",
    });
    const februaryEighth = calendarCellByDate(root, "2025-02-08");

    expect(root.querySelectorAll("[role='grid']")).toHaveLength(2);
    expect(root.textContent).toContain("January");
    expect(root.textContent).toContain("February");
    expect(februaryEighth?.getAttribute("data-range-end")).toBe("true");
    expect(februaryEighth?.getAttribute("data-in-range")).toBe("true");
  });

  it("implements source Calendar keyboard navigation and month selectors", () => {
    const { root } = createCalendarFixture({ withSelectors: true });
    const tenth = calendarCellByDate(root, "2025-01-10");
    const monthSelect = root.querySelector("aria-calendar-month-select") as HTMLElement | null;

    tenth?.focus();
    dispatchCalendarKey(tenth!, "ArrowRight");
    expect(document.activeElement).toBe(calendarCellByDate(root, "2025-01-11"));

    dispatchCalendarKey(document.activeElement!, "PageDown");
    expect(root.visibleMonth).toBe("2025-02-11");

    monthSelect?.click();
    expect(monthSelect?.getAttribute("aria-expanded")).toBe("true");
    const marchOption = Array.from(monthSelect?.querySelectorAll<HTMLElement>("[role='option']") ?? [])
      .find((option) => option.textContent?.trim() === "March");
    marchOption?.click();

    expect(root.visibleMonth).toBe("2025-03-11");
    expect(monthSelect?.getAttribute("aria-expanded")).toBe("false");
  });

});
