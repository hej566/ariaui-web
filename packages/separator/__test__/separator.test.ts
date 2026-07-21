import { afterEach, describe, expect, it } from "vitest";
import { createSeparatorElement, defineSeparatorElements } from "../src";

type SeparatorElement = HTMLElement & {
  decorative: boolean;
  nativeComposition: boolean;
  orientation: "horizontal" | "vertical";
};

function render(attributes = "", content = "") {
  defineSeparatorElements();
  document.body.innerHTML = `<aria-separator ${attributes}>${content}</aria-separator>`;
  return document.querySelector<SeparatorElement>("aria-separator")!;
}

describe("@ariaui-web/separator", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders a semantic horizontal separator by default", () => {
    const separator = render('data-testid="separator"');

    expect(separator).toBe(document.querySelector('[data-testid="separator"]'));
    expect(separator.tagName).toBe("ARIA-SEPARATOR");
    expect(separator.getAttribute("role")).toBe("separator");
    expect(separator.dataset.orientation).toBe("horizontal");
    expect(separator.hasAttribute("aria-orientation")).toBe(false);
  });

  it("sets vertical orientation semantics", () => {
    const separator = render('orientation="vertical"');

    expect(separator.orientation).toBe("vertical");
    expect(separator.dataset.orientation).toBe("vertical");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("removes separator semantics when decorative", () => {
    const separator = render('decorative orientation="vertical"');

    expect(separator.decorative).toBe(true);
    expect(separator.getAttribute("role")).toBe("none");
    expect(separator.dataset.orientation).toBe("vertical");
    expect(separator.hasAttribute("aria-orientation")).toBe(false);
  });

  it("passes through consumer attributes and styles", () => {
    const separator = render('class="separator" id="account-divider" style="margin-top: 8px"');

    expect(separator.classList.contains("separator")).toBe(true);
    expect(separator.id).toBe("account-divider");
    expect(separator.style.marginTop).toBe("8px");
  });

  it("returns the created custom element as the rendered element", () => {
    defineSeparatorElements();
    const separator = createSeparatorElement() as SeparatorElement;
    document.body.append(separator);

    expect(document.querySelector("aria-separator")).toBe(separator);
  });

  it("composes separator behavior onto its first child", () => {
    const separator = render(
      'native-composition class="slot-class" style="margin-top: 8px"',
      '<hr class="child-class" data-testid="separator">',
    );
    const host = separator.firstElementChild as HTMLElement;

    expect(separator.nativeComposition).toBe(true);
    expect(separator.style.display).toBe("contents");
    expect(host.tagName).toBe("HR");
    expect(host.classList.contains("slot-class")).toBe(true);
    expect(host.classList.contains("child-class")).toBe(true);
    expect(host.style.marginTop).toBe("8px");
    expect(host.getAttribute("role")).toBe("separator");
    expect(host.dataset.orientation).toBe("horizontal");
  });

  it("falls back to horizontal orientation for invalid runtime values", () => {
    const separator = render('orientation="diagonal"');

    expect(separator.orientation).toBe("horizontal");
    expect(separator.dataset.orientation).toBe("horizontal");
    expect(separator.hasAttribute("aria-orientation")).toBe(false);
  });

  it("keeps semantic and decorative examples accessibility-neutral", () => {
    const semantic = render();
    const decorative = document.createElement("aria-separator") as SeparatorElement;
    decorative.setAttribute("decorative", "");
    decorative.setAttribute("orientation", "vertical");
    document.body.append(decorative);

    expect(semantic.matches('[role="separator"][data-orientation="horizontal"]')).toBe(true);
    expect(decorative.matches('[role="none"][data-orientation="vertical"]')).toBe(true);
    expect(decorative.hasAttribute("aria-orientation")).toBe(false);
  });
});
