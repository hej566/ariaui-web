import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createPaginationElement, definePaginationElements, getPartSpec, type ComponentPartName } from "../src";

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

function renderPagination(attributes = 'total-pages="8" max-visible-pages="6" default-page="1"') {
  definePaginationElements();
  document.body.innerHTML = `
    <aria-pagination ${attributes}>
      <aria-pagination-content>
        <aria-pagination-item>
          <aria-pagination-previous>Previous</aria-pagination-previous>
        </aria-pagination-item>
        <aria-pagination-pages>
          <aria-pagination-item>
            <aria-pagination-link class="page-link" active-class="page-link active"></aria-pagination-link>
            <aria-pagination-ellipsis>...</aria-pagination-ellipsis>
          </aria-pagination-item>
        </aria-pagination-pages>
        <aria-pagination-item>
          <aria-pagination-next>Next</aria-pagination-next>
        </aria-pagination-item>
      </aria-pagination-content>
    </aria-pagination>
  `;

  return document.querySelector("aria-pagination") as RuntimeElement;
}

function paginationControls(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-pagination-previous, aria-pagination-link, aria-pagination-next"));
}

function paginationControlTexts(root: Element) {
  return paginationControls(root).map((control) => control.textContent?.trim() ?? "");
}

function paginationControlByText(root: Element, text: string) {
  return paginationControls(root).find((control) => control.textContent?.trim() === text) ?? null;
}

function visibleEllipses(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>("aria-pagination-ellipsis")).filter((ellipsis) => !ellipsis.hidden);
}

describe("@ariaui-web/pagination", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/pagination");
    expect(componentSpec.slug).toBe("pagination");
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

      if (documentedAttributes.includes("aria-selected") && part.defaultRole && selectableRoles.has(part.defaultRole)) {
        expect(part.defaultAttributes["aria-selected"]).toBe("false");
      }
    }
  });

  it("exposes helpers that resolve and create every spec part", () => {
    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);

      const element = createPaginationElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/pagination part");
  });

  it("defines all custom elements idempotently", () => {
    definePaginationElements();
    definePaginationElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    definePaginationElements();
    const element = createPaginationElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("pagination");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    definePaginationElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("pagination");
      expect(element.getAttribute("data-package")).toBe("pagination");
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
    definePaginationElements();
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
    definePaginationElements();

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
    definePaginationElements();

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

      if (role && selectableRoles.has(role)) {
        expect(element.getAttribute("aria-selected")).toBe("false");
        element.selected = true;
        expect(element.getAttribute("aria-selected")).toBe("true");
        expect(element.getAttribute("data-state")).toBe("checked");
      }
    }
  });

  it("implements keyboard activation and disabled guards for button-like roles", () => {
    definePaginationElements();

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

  it("renders root-managed navigation semantics and the initial generated page window", () => {
    const root = renderPagination();
    const content = root.querySelector("aria-pagination-content");
    const previous = root.querySelector("aria-pagination-previous");
    const next = root.querySelector("aria-pagination-next");
    const pageOne = paginationControlByText(root, "1");

    expect(root.getAttribute("role")).toBe("navigation");
    expect(root.getAttribute("aria-label")).toBe("pagination");
    expect(root.getAttribute("data-page")).toBe("1");
    expect(content?.getAttribute("role")).toBe("list");
    expect(paginationControlTexts(root)).toEqual(["Previous", "1", "2", "3", "4", "5", "8", "Next"]);
    expect(visibleEllipses(root)).toHaveLength(1);
    expect(pageOne?.getAttribute("aria-current")).toBe("page");
    expect(pageOne?.className).toBe("page-link active");
    expect(previous?.getAttribute("aria-label")).toBe("Go to previous page");
    expect(previous?.getAttribute("aria-disabled")).toBe("true");
    expect(previous?.getAttribute("tabindex")).toBe("-1");
    expect(next?.getAttribute("aria-label")).toBe("Go to next page");
    expect(next?.hasAttribute("aria-disabled")).toBe(false);
    expect(next?.getAttribute("tabindex")).toBe("0");
  });

  it("updates uncontrolled page state and generated items when controls are activated", () => {
    const root = renderPagination();
    const onPageChange = vi.fn();
    root.addEventListener("pagechange", onPageChange);

    paginationControlByText(root, "5")?.click();

    expect(onPageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        page: 5,
      },
    }));
    expect(root.getAttribute("data-page")).toBe("5");
    expect(paginationControlTexts(root)).toEqual(["Previous", "1", "4", "5", "6", "8", "Next"]);
    expect(visibleEllipses(root)).toHaveLength(2);
    expect(paginationControlByText(root, "5")?.getAttribute("aria-current")).toBe("page");

    root.querySelector<HTMLElement>("aria-pagination-previous")?.click();

    expect(onPageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        page: 4,
      },
    }));
    expect(root.getAttribute("data-page")).toBe("4");
    expect(paginationControlByText(root, "4")?.getAttribute("aria-current")).toBe("page");
  });

  it("keeps controlled page state stable while emitting requested page changes", () => {
    const root = renderPagination('total-pages="3" page="2"');
    const onPageChange = vi.fn();
    root.addEventListener("pagechange", onPageChange);

    root.querySelector<HTMLElement>("aria-pagination-next")?.click();

    expect(onPageChange).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        page: 3,
      },
    }));
    expect(root.getAttribute("page")).toBe("2");
    expect(root.getAttribute("data-page")).toBe("2");
    expect(paginationControlByText(root, "2")?.getAttribute("aria-current")).toBe("page");
    expect(paginationControlByText(root, "3")?.hasAttribute("aria-current")).toBe(false);
  });

  it("clamps small max-visible-page windows while preserving boundary pages", () => {
    const root = renderPagination('total-pages="8" max-visible-pages="2" default-page="4"');

    expect(root.getAttribute("data-page")).toBe("4");
    expect(paginationControlTexts(root)).toEqual(["Previous", "1", "4", "8", "Next"]);
    expect(visibleEllipses(root)).toHaveLength(2);
    expect(paginationControlByText(root, "4")?.getAttribute("aria-current")).toBe("page");
  });




});
