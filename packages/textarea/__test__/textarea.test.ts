import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  componentSpec,
  createTextareaElement,
  defineTextareaElements,
  getPartSpec,
} from "../src";

type TextareaRoot = HTMLElement & {
  control: HTMLTextAreaElement;
  defaultValue: string;
  disabled: boolean;
  focus(options?: FocusOptions): void;
  required: boolean;
  select(): void;
  selectionEnd: number | null;
  selectionStart: number | null;
  setSelectionRange(start: number | null, end: number | null): void;
  value: string;
};

function setupTextarea(attributes: Record<string, string | boolean> = {}) {
  defineTextareaElements();
  const root = document.createElement("aria-textarea") as TextareaRoot;
  for (const [name, value] of Object.entries(attributes)) {
    if (value === true) root.setAttribute(name, "");
    else if (value !== false) root.setAttribute(name, value);
  }
  document.body.append(root);
  return { control: root.control, root };
}

function input(control: HTMLTextAreaElement, value: string) {
  control.value = value;
  control.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
}

describe("@ariaui-web/textarea", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("defines and creates its source-equivalent Root idempotently", () => {
    defineTextareaElements();
    defineTextareaElements();
    expect(componentSpec.packageName).toBe("@ariaui-web/textarea");
    expect(componentSpec.parts.map((part) => part.name)).toEqual(["Root"]);
    expect(getPartSpec("Root")).toBe(componentSpec.parts[0]);
    expect(createTextareaElement("Root").tagName).toBe("ARIA-TEXTAREA");
    expect(customElements.get("aria-textarea")).toBeTruthy();
  });

  it("owns a real native textarea with browser textbox semantics", () => {
    const { control, root } = setupTextarea();
    expect(root.getAttribute("data-ariaui-web")).toBe("textarea");
    expect(root.getAttribute("data-part")).toBe("Root");
    expect(control).toBeInstanceOf(HTMLTextAreaElement);
    expect(control.matches("textarea[data-ariaui-web-textarea='true']")).toBe(true);
    expect(control.getAttribute("role")).toBeNull();
  });

  it("forwards id and standard labelling attributes to the native control", () => {
    const label = document.createElement("label");
    label.htmlFor = "description";
    label.textContent = "Description";
    document.body.append(label);
    const { control, root } = setupTextarea({
      id: "description",
      "aria-describedby": "description-hint",
      "aria-label": "Custom description",
    });
    expect(root.hasAttribute("id")).toBe(false);
    expect(control.id).toBe("description");
    expect(control.getAttribute("aria-describedby")).toBe("description-hint");
    expect(control.getAttribute("aria-label")).toBe("Custom description");
    expect(control.labels?.[0]).toBe(label);
  });

  it("emits a string valuechange for every native input", async () => {
    const { control, root } = setupTextarea();
    const listener = vi.fn();
    root.addEventListener("valuechange", listener);
    input(control, "a");
    input(control, "aa");
    await Promise.resolve();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls.map(([event]) => (event as CustomEvent).detail)).toEqual([
      { value: "a" },
      { value: "aa" },
    ]);
    expect(root.value).toBe("aa");
  });

  it("lets native input listeners run before valuechange", async () => {
    const { control, root } = setupTextarea();
    const calls: string[] = [];
    root.addEventListener("input", () => calls.push("input"));
    root.addEventListener("valuechange", () => calls.push("value"));
    input(control, "a");
    expect(calls).toEqual(["input"]);
    await Promise.resolve();
    expect(calls).toEqual(["input", "value"]);
  });

  it("maps disabled and required directly to the native textarea", () => {
    const { control, root } = setupTextarea({ disabled: true, required: true });
    expect(control.disabled).toBe(true);
    expect(control.required).toBe(true);
    expect(root.hasAttribute("aria-disabled")).toBe(false);
    expect(root.hasAttribute("data-disabled")).toBe(false);
    root.disabled = false;
    root.required = false;
    expect(control.disabled).toBe(false);
    expect(control.required).toBe(false);
  });

  it("initializes an uncontrolled value from default-value", () => {
    const { control, root } = setupTextarea({ "default-value": "hello" });
    expect(root.defaultValue).toBe("hello");
    expect(root.value).toBe("hello");
    expect(control.defaultValue).toBe("hello");
    input(control, "hello world");
    expect(root.value).toBe("hello world");
  });

  it("accepts controlled-style value attributes and property updates", () => {
    const { control, root } = setupTextarea({ value: "controlled" });
    expect(control.value).toBe("controlled");
    root.setAttribute("value", "attribute update");
    expect(control.value).toBe("attribute update");
    root.value = "property update";
    expect(control.value).toBe("property update");
  });

  it("forwards native textarea and arbitrary consumer attributes", () => {
    const { control } = setupTextarea({
      "aria-invalid": "true",
      autocomplete: "off",
      "data-testid": "custom",
      maxlength: "120",
      minlength: "5",
      name: "description",
      placeholder: "Type here...",
      readonly: true,
      rows: "6",
      wrap: "hard",
    });
    expect(control.dataset.testid).toBe("custom");
    expect(control.placeholder).toBe("Type here...");
    expect(control.name).toBe("description");
    expect(control.rows).toBe(6);
    expect(control.maxLength).toBe(120);
    expect(control.minLength).toBe(5);
    expect(control.readOnly).toBe(true);
    expect(control.wrap).toBe("hard");
    expect(control.getAttribute("aria-invalid")).toBe("true");
  });

  it("forwards consumer classes while preserving native child classes", () => {
    defineTextareaElements();
    const root = document.createElement("aria-textarea") as TextareaRoot;
    root.className = "field-prop";
    const textarea = document.createElement("textarea");
    textarea.dataset.ariauiWebTextarea = "true";
    textarea.className = "field-child";
    root.append(textarea);
    document.body.append(root);
    expect(root.control.classList.contains("field-prop")).toBe(true);
    expect(root.control.classList.contains("field-child")).toBe(true);
  });

  it("delegates focus and selection APIs to the native textarea", () => {
    const { control, root } = setupTextarea({ "default-value": "hello" });
    root.focus();
    expect(document.activeElement).toBe(control);
    root.setSelectionRange(1, 4);
    expect(root.selectionStart).toBe(1);
    expect(root.selectionEnd).toBe(4);
    root.select();
    expect(root.selectionStart).toBe(0);
    expect(root.selectionEnd).toBe(5);
  });

  it("does not duplicate its native control after reconnecting", () => {
    const { root } = setupTextarea();
    root.remove();
    document.body.append(root);
    expect(root.querySelectorAll("textarea[data-ariaui-web-textarea='true']")).toHaveLength(1);
  });

  it("has no baseline accessibility violations when visibly labelled", async () => {
    defineTextareaElements();
    const container = document.createElement("main");
    container.innerHTML = `
      <label for="accessible-textarea">Description</label>
      <aria-textarea id="accessible-textarea" required aria-describedby="accessible-hint"></aria-textarea>
      <p id="accessible-hint">Add a short project description.</p>
    `;
    document.body.append(container);
    const result = await axe(container);
    expect(result.violations).toEqual([]);
  });
});
