import { afterEach, describe, expect, it } from "vitest";
import {
  componentSpec,
  createSpinnerElement,
  defineSpinnerElements,
  getPartSpec,
} from "../src";

type SpinnerElement = HTMLElement & {
  nativeComposition: boolean;
};

function render(attributes = "", content = "") {
  defineSpinnerElements();
  document.body.innerHTML = `<aria-spinner ${attributes}>${content}</aria-spinner>`;
  return document.querySelector<SpinnerElement>("aria-spinner")!;
}

describe("@ariaui-web/spinner", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps the native package identity and Root part contract", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/spinner");
    expect(componentSpec.slug).toBe("spinner");
    expect(componentSpec.parts).toEqual([
      expect.objectContaining({
        name: "Root",
        tagName: "aria-spinner",
        defaultRole: "status",
        defaultAttributes: { "aria-label": "Loading" },
      }),
    ]);
  });

  it("defines and creates the Root element idempotently", () => {
    defineSpinnerElements();
    defineSpinnerElements();
    const root = createSpinnerElement();
    document.body.append(root);

    expect(customElements.get("aria-spinner")).toBeTruthy();
    expect(getPartSpec("Root")).toBe(componentSpec.parts[0]);
    expect(root.tagName).toBe("ARIA-SPINNER");
  });

  it("renders an accessible inline SVG status by default", () => {
    const root = render('data-testid="spinner"');
    const glyph = root.querySelector<SVGSVGElement>("svg[data-spinner-glyph]")!;

    expect(root.dataset.ariauiWeb).toBe("spinner");
    expect(root.dataset.package).toBe("spinner");
    expect(root.dataset.part).toBe("Root");
    expect(root.getAttribute("part")).toBe("root");
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-label")).toBe("Loading");
    expect(glyph).toBeInstanceOf(SVGSVGElement);
    expect(glyph.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(glyph.getAttribute("width")).toBe("1em");
    expect(glyph.getAttribute("height")).toBe("1em");
    expect(glyph.querySelector("circle")).toBeTruthy();
    expect(glyph.querySelector("path animateTransform")).toBeTruthy();
  });

  it("allows consumers to override the accessible label and role", () => {
    const root = render('aria-label="Saving" role="progressbar"');

    expect(root.getAttribute("role")).toBe("progressbar");
    expect(root.getAttribute("aria-label")).toBe("Saving");
  });

  it("removes only default status semantics when aria-hidden", () => {
    const decorative = render('aria-hidden="true"');

    expect(decorative.getAttribute("aria-hidden")).toBe("true");
    expect(decorative.hasAttribute("role")).toBe(false);
    expect(decorative.hasAttribute("aria-label")).toBe(false);

    decorative.remove();
    const explicit = render(
      'aria-hidden="true" role="img" aria-label="Decorative loading mark"',
    );
    expect(explicit.getAttribute("role")).toBe("img");
    expect(explicit.getAttribute("aria-label")).toBe("Decorative loading mark");
  });

  it("preserves custom SVG children instead of injecting the fallback glyph", () => {
    const root = render(
      'aria-label="Syncing workspace"',
      '<svg data-custom viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle></svg>',
    );

    expect(root.querySelector("svg[data-custom]")).toBeTruthy();
    expect(root.querySelector("svg[data-spinner-glyph]")).toBeNull();
  });

  it("composes classes, styles, attributes, and semantics onto a custom SVG", () => {
    const root = render(
      'native-composition class="size-6 text-foreground" style="color: rgb(1, 2, 3)" aria-label="Refreshing data" title="Refresh"',
      '<svg class="child-class" data-custom viewBox="0 0 24 24"></svg>',
    );
    const svg = root.firstElementChild as SVGSVGElement;

    expect(root.nativeComposition).toBe(true);
    expect(root.style.display).toBe("contents");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("aria-label")).toBe(false);
    expect(svg.getAttribute("role")).toBe("status");
    expect(svg.getAttribute("aria-label")).toBe("Refreshing data");
    expect(svg.getAttribute("title")).toBe("Refresh");
    expect(svg.classList.contains("child-class")).toBe(true);
    expect(svg.classList.contains("size-6")).toBe(true);
    expect(svg.style.color).toBe("rgb(1, 2, 3)");

    root.setAttribute("title", "Refreshing");
    expect(svg.getAttribute("role")).toBe("status");
    expect(svg.getAttribute("aria-label")).toBe("Refreshing data");
    expect(svg.getAttribute("title")).toBe("Refreshing");

    root.remove();
    document.body.append(root);
    expect(svg.getAttribute("role")).toBe("status");
    expect(svg.getAttribute("aria-label")).toBe("Refreshing data");
    expect(svg.getAttribute("title")).toBe("Refreshing");
  });

  it("supports decorative native composition", () => {
    const root = render(
      'native-composition aria-hidden="true"',
      '<svg data-custom viewBox="0 0 24 24"></svg>',
    );
    const svg = root.firstElementChild as SVGSVGElement;

    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.hasAttribute("role")).toBe(false);
    expect(svg.hasAttribute("aria-label")).toBe(false);

    root.remove();
    const announced = render(
      'native-composition aria-hidden="false" aria-label="Refreshing data"',
      '<svg aria-hidden="true" viewBox="0 0 24 24"></svg>',
    );
    const announcedSvg = announced.firstElementChild as SVGSVGElement;
    expect(announcedSvg.getAttribute("aria-hidden")).toBe("false");
    expect(announcedSvg.getAttribute("role")).toBe("status");
    expect(announcedSvg.getAttribute("aria-label")).toBe("Refreshing data");
  });

  it("updates default and decorative semantics when attributes change", () => {
    const root = render();

    root.setAttribute("aria-hidden", "true");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("aria-label")).toBe(false);

    root.setAttribute("aria-hidden", "false");
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-label")).toBe("Loading");

    root.setAttribute("aria-label", "Loading messages");
    expect(root.getAttribute("aria-label")).toBe("Loading messages");
  });
});
