import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createCommandElement, defineCommandElements, getPartSpec, type ComponentPartName } from "../src";

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

type CommandRootElement = HTMLElement & {
  filter?: (value: string, search: string, keywords?: string[]) => boolean | number;
  onSearchValueChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  searchValue: string;
  syncCommandTreeFromRoot?: () => void;
  value: string;
};

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
  for (const attribute of ["aria-valuemax", "aria-valuemin", "default-search-value", "disable-pointer-selection", "force-mount", "search-value", "should-filter"]) {
    attributes.add(attribute);
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

function setupBasicCommand() {
  defineCommandElements();
  document.body.innerHTML = `
    <aria-command label="Command menu">
      <aria-command-input placeholder="Search commands"></aria-command-input>
      <aria-command-content>
        <aria-command-empty>No commands found.</aria-command-empty>
        <aria-command-group heading="Fruits">
          <aria-command-option value="Apple">Apple</aria-command-option>
          <aria-command-option value="Banana" keywords="yellow,fruit">Banana</aria-command-option>
          <aria-command-option value="Cherry">Cherry</aria-command-option>
        </aria-command-group>
      </aria-command-content>
    </aria-command>
  `;

  return {
    root: document.querySelector("aria-command") as CommandRootElement,
    input: document.querySelector("aria-command-input") as HTMLElement & { value: string },
    content: document.querySelector("aria-command-content") as HTMLElement,
    options: Array.from(document.querySelectorAll("aria-command-option")) as HTMLElement[],
    empty: document.querySelector("aria-command-empty") as HTMLElement,
    group: document.querySelector("aria-command-group") as HTMLElement,
  };
}

describe("@ariaui-web/command", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/command");
    expect(componentSpec.slug).toBe("command");
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
        const expectedExpanded = part.name === "Input" ? "true" : "false";
        expect(part.defaultAttributes["aria-expanded"]).toBe(expectedExpanded);
      }

      if (documentedAttributes.includes("aria-selected") && part.defaultRole && selectableRoles.has(part.defaultRole)) {
        expect(part.defaultAttributes["aria-selected"]).toBe("false");
      }
    }
  });

  it("exposes helpers that resolve and create every spec part", () => {
    for (const part of componentSpec.parts) {
      expect(getPartSpec(part.name)).toBe(part);

      const element = createCommandElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/command part");
  });

  it("defines all custom elements idempotently", () => {
    defineCommandElements();
    defineCommandElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineCommandElements();
    const element = createCommandElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("command");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineCommandElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("command");
      expect(element.getAttribute("data-package")).toBe("command");
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
    defineCommandElements();
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
    defineCommandElements();

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
    defineCommandElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const role = part.defaultRole as string | null;

      if (role && expandableRoles.has(role)) {
        const expectedExpanded = part.name === "Input" ? "true" : "false";
        expect(element.getAttribute("aria-expanded")).toBe(expectedExpanded);
        element.open = true;
        expect(element.getAttribute("aria-expanded")).toBe("true");
        element.open = false;
        expect(element.getAttribute("aria-expanded")).toBe(expectedExpanded);
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
    defineCommandElements();

    for (const part of componentSpec.parts) {
      const role = part.defaultRole as string | null;

      if (!role || !buttonLikeRoles.has(role)) {
        continue;
      }

      const element = appendPart(part.tagName);
      if (focusableRoles.has(role)) {
        const expectedTabIndex = part.name === "Option" ? "-1" : "0";
        expect(element.getAttribute("tabindex")).toBe(expectedTabIndex);
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




});

describe("@ariaui-web/command source parity", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders combobox/listbox anatomy and keeps selected value separate from search value", () => {
    const { root, input, content, options, empty, group } = setupBasicCommand();

    expect(root.getAttribute("tabindex")).toBe("-1");
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(content.id);
    expect(input.getAttribute("contenteditable")).toBe("plaintext-only");
    expect(content.getAttribute("role")).toBe("listbox");
    expect(content.getAttribute("aria-label")).toBe("Suggestions");
    expect(group.getAttribute("role")).toBe("group");
    expect(empty.hidden).toBe(true);

    root.value = "Apple";
    input.textContent = "ban";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "n" }));

    expect(root.value).toBe("Apple");
    expect(root.searchValue).toBe("ban");
    expect(input.value).toBe("ban");
    expect(options.map((option) => [option.textContent?.trim(), option.hidden])).toEqual([
      ["Apple", true],
      ["Banana", false],
      ["Cherry", true],
    ]);
  });

  it("supports default values, controlled search attributes, custom filters, and keywords", () => {
    defineCommandElements();
    document.body.innerHTML = `
      <aria-command default-value="Cherry" default-search-value="fruit">
        <aria-command-input placeholder="Search commands"></aria-command-input>
        <aria-command-content>
          <aria-command-option value="Apple">Apple</aria-command-option>
          <aria-command-option value="Banana" keywords="yellow,fruit">Banana</aria-command-option>
          <aria-command-option value="Cherry">Cherry</aria-command-option>
        </aria-command-content>
      </aria-command>
    `;

    const root = document.querySelector("aria-command") as CommandRootElement;
    const input = document.querySelector("aria-command-input") as HTMLElement & { value: string };
    const options = Array.from(document.querySelectorAll("aria-command-option")) as HTMLElement[];
    const filterCalls: Array<[string, string, string[]]> = [];

    root.filter = (value, search, keywords = []) => {
      filterCalls.push([value, search, keywords]);
      return [value, ...keywords].join(" ").toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
    };
    root.syncCommandTreeFromRoot?.();

    expect(root.value).toBe("Cherry");
    expect(root.searchValue).toBe("fruit");
    expect(input.value).toBe("fruit");
    expect(options.find((option) => option.getAttribute("value") === "Banana")?.hidden).toBe(false);
    expect(filterCalls).toContainEqual(["Banana", "fruit", ["yellow", "fruit"]]);

    root.setAttribute("should-filter", "false");
    root.searchValue = "zzz";
    expect(options.every((option) => option.hidden === false)).toBe(true);
  });

  it("selects with Enter, click, and option onSelect while dispatching native events", () => {
    const { root, input, options } = setupBasicCommand();
    const values: string[] = [];
    const searches: string[] = [];
    const selected: string[] = [];

    root.onValueChange = (value) => values.push(value);
    root.onSearchValueChange = (value) => searches.push(value);
    (options[1]! as HTMLElement & { onSelect?: (value: string) => void }).onSelect = (value) => selected.push(value);
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent).detail.value));
    root.addEventListener("searchvaluechange", (event) => searches.push((event as CustomEvent).detail.value));
    root.addEventListener("commandselect", (event) => selected.push((event as CustomEvent).detail.value));

    input.textContent = "ban";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "n" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));

    expect(root.value).toBe("Banana");
    expect(values).toEqual(["Banana", "Banana"]);
    expect(searches).toEqual(["ban", "ban"]);
    expect(selected).toEqual(["Banana", "Banana"]);

    options[0]!.click();
    expect(root.value).toBe("Apple");
  });

  it("navigates visible enabled options with arrows, Home, End, vim keys, and loop", () => {
    const { root, input, options } = setupBasicCommand();
    options[1]!.setAttribute("disabled", "");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(options[0]!.getAttribute("aria-selected")).toBe("true");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]!.id);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(options[2]!.getAttribute("aria-selected")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    expect(options[0]!.getAttribute("aria-selected")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    expect(options[2]!.getAttribute("aria-selected")).toBe("true");

    root.setAttribute("loop", "");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "j", ctrlKey: true, bubbles: true, cancelable: true }));
    expect(options[0]!.getAttribute("aria-selected")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true }));
    expect(options[2]!.getAttribute("aria-selected")).toBe("true");
  });

  it("honors disabled, prevented events, pointer gating, and composition guards", async () => {
    const { root, input, options } = setupBasicCommand();
    const values: string[] = [];
    root.addEventListener("valuechange", (event) => values.push((event as CustomEvent).detail.value));

    options[0]!.addEventListener("click", (event) => event.preventDefault());
    const preventedClick = new MouseEvent("click", { bubbles: true, cancelable: true });
    options[0]!.dispatchEvent(preventedClick);
    await Promise.resolve();

    expect(preventedClick.defaultPrevented).toBe(true);
    expect(root.value).toBe("");
    expect(options[0]!.getAttribute("aria-selected")).toBe("false");
    expect(values).toEqual([]);

    options[1]!.setAttribute("disabled", "");
    options[1]!.click();
    expect(values).toEqual([]);

    root.setAttribute("disable-pointer-selection", "");
    options[2]!.dispatchEvent(new MouseEvent("pointermove", { bubbles: true }));
    expect(options[2]!.getAttribute("aria-selected")).toBe("false");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", keyCode: 229, bubbles: true, cancelable: true }));
    expect(options.every((option) => option.getAttribute("aria-selected") === "false")).toBe(true);
  });

  it("hides groups and separators while preserving forced content", () => {
    defineCommandElements();
    document.body.innerHTML = `
      <aria-command>
        <aria-command-input></aria-command-input>
        <aria-command-content>
          <aria-command-group heading="Actions" data-testid="actions">
            <aria-command-option value="Apple">Apple</aria-command-option>
          </aria-command-group>
          <aria-command-separator data-testid="separator"></aria-command-separator>
          <aria-command-separator always-render data-testid="forced-separator"></aria-command-separator>
          <aria-command-group heading="Forced" force-mount data-testid="forced">
            <aria-command-option value="Hidden" force-mount>Hidden</aria-command-option>
          </aria-command-group>
        </aria-command-content>
      </aria-command>
    `;

    const root = document.querySelector("aria-command") as HTMLElement & { searchValue: string };
    const actions = document.querySelector('[data-testid="actions"]') as HTMLElement;
    const separator = document.querySelector('[data-testid="separator"]') as HTMLElement;
    const forcedSeparator = document.querySelector('[data-testid="forced-separator"]') as HTMLElement;
    const forced = document.querySelector('[data-testid="forced"]') as HTMLElement;

    root.searchValue = "zzz";

    expect(actions.hidden).toBe(true);
    expect(separator.hidden).toBe(true);
    expect(forcedSeparator.hidden).toBe(false);
    expect(forced.hidden).toBe(false);
  });

  it("syncs Empty and Loading native presentation states", () => {
    defineCommandElements();
    document.body.innerHTML = `
      <aria-command>
        <aria-command-input></aria-command-input>
        <aria-command-content>
          <aria-command-empty>No commands found.</aria-command-empty>
          <aria-command-loading label="Loading commands" progress="42">Loading</aria-command-loading>
          <aria-command-option value="Apple">Apple</aria-command-option>
        </aria-command-content>
      </aria-command>
    `;

    const root = document.querySelector("aria-command") as HTMLElement & { searchValue: string };
    const empty = document.querySelector("aria-command-empty") as HTMLElement;
    const loading = document.querySelector("aria-command-loading") as HTMLElement;

    expect(empty.hidden).toBe(true);
    root.searchValue = "zzz";
    expect(empty.hidden).toBe(false);
    expect(empty.getAttribute("role")).toBe("presentation");

    expect(loading.getAttribute("role")).toBe("progressbar");
    expect(loading.getAttribute("aria-label")).toBe("Loading commands");
    expect(loading.getAttribute("aria-valuemin")).toBe("0");
    expect(loading.getAttribute("aria-valuemax")).toBe("100");
    expect(loading.getAttribute("aria-valuenow")).toBe("42");
  });
});
