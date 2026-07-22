import { afterEach, describe, expect, it } from "vitest";
import { componentSpec, createSkeletonElement, defineSkeletonElements, getPartSpec } from "../src";

type SkeletonElement = HTMLElement & {
  loading: boolean;
  nativeComposition: boolean;
  width: string;
  minWidth: string;
  maxWidth: string;
  height: string | number;
  minHeight: string | number;
  maxHeight: string | number;
};

function render(attributes = "", content = "Loading profile") {
  defineSkeletonElements();
  document.body.innerHTML = `<aria-skeleton ${attributes}>${content}</aria-skeleton>`;
  return document.querySelector<SkeletonElement>("aria-skeleton")!;
}

describe("@ariaui-web/skeleton", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps the native package identity and Root part contract", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/skeleton");
    expect(componentSpec.slug).toBe("skeleton");
    expect(componentSpec.parts).toEqual([
      expect.objectContaining({ name: "Root", tagName: "aria-skeleton", defaultRole: null }),
    ]);
  });

  it("defines and creates the Root element idempotently", () => {
    defineSkeletonElements();
    defineSkeletonElements();
    const root = createSkeletonElement();
    document.body.append(root);

    expect(customElements.get("aria-skeleton")).toBeTruthy();
    expect(getPartSpec("Root")).toBe(componentSpec.parts[0]);
    expect(root.tagName).toBe("ARIA-SKELETON");
  });

  it("connects Root to shared package and part metadata", () => {
    const root = render();

    expect(root.dataset.ariauiWeb).toBe("skeleton");
    expect(root.dataset.package).toBe("skeleton");
    expect(root.dataset.part).toBe("Root");
    expect(root.getAttribute("part")).toBe("root");
    expect(root.hasAttribute("role")).toBe(false);
  });

  it("renders an inline loading placeholder by default", () => {
    const root = render('class="animate-pulse" data-testid="skeleton"');

    expect(root.tagName).toBe("ARIA-SKELETON");
    expect(root.loading).toBe(true);
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.hasAttribute("inert")).toBe(true);
    expect(root.getAttribute("tabindex")).toBe("-1");
    expect(root.dataset.state).toBe("loading");
    expect(root.hasAttribute("data-inline-skeleton")).toBe(true);
    expect(root.classList.contains("animate-pulse")).toBe(true);
    expect(root.textContent).toContain("Loading profile");
  });

  it("exposes children without loading semantics when loading is false", () => {
    const root = render('loading="false"', '<button type="button" data-testid="loaded-button">Edit profile</button>');
    const button = root.querySelector("button")!;

    expect(root.loading).toBe(false);
    expect(root.style.display).toBe("contents");
    expect(root.hasAttribute("aria-hidden")).toBe(false);
    expect(root.hasAttribute("inert")).toBe(false);
    expect(root.hasAttribute("tabindex")).toBe(false);
    expect(root.hasAttribute("data-state")).toBe(false);
    expect(button.hasAttribute("aria-hidden")).toBe(false);
    expect(button.hasAttribute("inert")).toBe(false);
  });

  it("composes a valid element child into the loading placeholder host", () => {
    const root = render(
      'native-composition class="bg-muted" data-testid="skeleton"',
      '<button type="button" class="rounded-md">Save</button>',
    );
    const child = root.firstElementChild as HTMLButtonElement;

    expect(root.nativeComposition).toBe(true);
    expect(root.style.display).toBe("contents");
    expect(child.getAttribute("data-testid")).toBe("skeleton");
    expect(child.getAttribute("aria-hidden")).toBe("true");
    expect(child.hasAttribute("inert")).toBe(true);
    expect(child.getAttribute("tabindex")).toBe("-1");
    expect(child.dataset.state).toBe("loading");
    expect(child.hasAttribute("data-inline-skeleton")).toBe(false);
    expect(child.classList.contains("rounded-md")).toBe(true);
    expect(child.classList.contains("bg-muted")).toBe(true);
  });

  it("applies size properties as inline styles", () => {
    defineSkeletonElements();
    const root = createSkeletonElement() as SkeletonElement;
    root.width = "12rem";
    root.minWidth = "8rem";
    root.maxWidth = "16rem";
    root.height = 24;
    root.minHeight = 16;
    root.maxHeight = 32;
    root.style.borderRadius = "8px";
    document.body.append(root);

    expect(root.style.width).toBe("12rem");
    expect(root.style.minWidth).toBe("8rem");
    expect(root.style.maxWidth).toBe("16rem");
    expect(root.style.height).toBe("24px");
    expect(root.style.minHeight).toBe("16px");
    expect(root.style.maxHeight).toBe("32px");
    expect(root.style.borderRadius).toBe("8px");
  });

  it("merges child and skeleton styles during native composition", () => {
    const root = render(
      'native-composition style="background-color: rgb(1, 2, 3)"',
      '<span style="height: 20px">Label</span>',
    );
    const child = root.firstElementChild as HTMLElement;
    root.width = "10rem";

    expect(child.style.width).toBe("10rem");
    expect(child.style.height).toBe("20px");
    expect(child.style.backgroundColor).toBe("rgb(1, 2, 3)");
  });

  it("updates loading state without leaving pending content interactive", () => {
    const root = render('native-composition class="bg-muted"', '<button type="button" class="rounded-md">Save</button>');
    const child = root.firstElementChild as HTMLButtonElement;

    root.loading = false;
    expect(child.hasAttribute("aria-hidden")).toBe(false);
    expect(child.hasAttribute("inert")).toBe(false);
    expect(child.hasAttribute("tabindex")).toBe(false);
    expect(child.hasAttribute("data-state")).toBe(false);
    expect(child.classList.contains("rounded-md")).toBe(true);
    expect(child.classList.contains("bg-muted")).toBe(false);

    root.loading = true;
    expect(child.getAttribute("aria-hidden")).toBe("true");
    expect(child.hasAttribute("inert")).toBe(true);
    expect(child.getAttribute("tabindex")).toBe("-1");
    expect(child.dataset.state).toBe("loading");
  });
});
