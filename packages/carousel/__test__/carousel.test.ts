import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createCarouselElement, defineCarouselElements, getPartSpec, type ComponentPartName } from "../src";

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

function carouselTransitionEnd(container: HTMLElement) {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  container.dispatchEvent(event);
}

function createCarousel({
  loop = false,
  orientation,
  slidesPerView,
  defaultIndex,
  slideCount = 3,
  label = "Featured stories",
}: {
  loop?: boolean;
  orientation?: "horizontal" | "vertical";
  slidesPerView?: number;
  defaultIndex?: number;
  slideCount?: number;
  label?: string;
} = {}) {
  defineCarouselElements();

  const root = document.createElement("aria-carousel") as RuntimeElement;
  const previous = document.createElement("aria-carousel-previous-button") as RuntimeElement;
  const viewport = document.createElement("aria-carousel-viewport") as RuntimeElement;
  const container = document.createElement("aria-carousel-container") as RuntimeElement;
  const next = document.createElement("aria-carousel-next-button") as RuntimeElement;

  root.setAttribute("aria-label", label);
  if (loop) root.setAttribute("loop", "");
  if (orientation) root.setAttribute("orientation", orientation);
  if (slidesPerView !== undefined) root.setAttribute("slides-per-view", String(slidesPerView));
  if (defaultIndex !== undefined) root.setAttribute("default-index", String(defaultIndex));
  previous.textContent = "Previous";
  next.textContent = "Next";

  for (let index = 0; index < slideCount; index += 1) {
    const slide = document.createElement("aria-carousel-slide") as RuntimeElement;
    slide.textContent = "Slide " + String(index + 1);
    container.append(slide);
  }

  viewport.append(container);
  root.append(previous, viewport, next);
  document.body.append(root);

  return {
    root,
    previous,
    viewport,
    container,
    next,
    slides: () => Array.from(container.querySelectorAll<RuntimeElement>("aria-carousel-slide:not([data-clone='true'])")),
  };
}

function mockCarouselLayout(container: HTMLElement, {
  orientation = "horizontal",
  slideSize = 120,
}: {
  orientation?: "horizontal" | "vertical";
  slideSize?: number;
} = {}) {
  const slides = Array.from(container.querySelectorAll<HTMLElement>("aria-carousel-slide"));

  container.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    width: orientation === "vertical" ? slideSize : slideSize * slides.length,
    height: orientation === "vertical" ? slideSize * slides.length : slideSize,
    top: 0,
    right: orientation === "vertical" ? slideSize : slideSize * slides.length,
    bottom: orientation === "vertical" ? slideSize * slides.length : slideSize,
    left: 0,
    toJSON: () => ({}),
  } as DOMRect);

  slides.forEach((slide, index) => {
    slide.getBoundingClientRect = () => ({
      x: orientation === "vertical" ? 0 : index * slideSize,
      y: orientation === "vertical" ? index * slideSize : 0,
      width: slideSize,
      height: slideSize,
      top: orientation === "vertical" ? index * slideSize : 0,
      right: orientation === "vertical" ? slideSize : (index + 1) * slideSize,
      bottom: orientation === "vertical" ? (index + 1) * slideSize : slideSize,
      left: orientation === "vertical" ? 0 : index * slideSize,
      toJSON: () => ({}),
    } as DOMRect);
  });
}

function mockDynamicCarouselLayout(container: HTMLElement, {
  orientation = "horizontal",
  slideSize = 120,
}: {
  orientation?: "horizontal" | "vertical";
  slideSize?: number;
} = {}) {
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const renderedSlides = Array.from(container.children).filter((child): child is HTMLElement => (
      child instanceof HTMLElement && child.matches("aria-carousel-slide")
    ));

    if (this === container) {
      return {
        x: 0,
        y: 0,
        width: orientation === "vertical" ? slideSize : slideSize * renderedSlides.length,
        height: orientation === "vertical" ? slideSize * renderedSlides.length : slideSize,
        top: 0,
        right: orientation === "vertical" ? slideSize : slideSize * renderedSlides.length,
        bottom: orientation === "vertical" ? slideSize * renderedSlides.length : slideSize,
        left: 0,
        toJSON: () => ({}),
      } as DOMRect;
    }

    if (this.parentElement === container && this.matches("aria-carousel-slide")) {
      const index = renderedSlides.indexOf(this);

      return {
        x: orientation === "vertical" ? 0 : index * slideSize,
        y: orientation === "vertical" ? index * slideSize : 0,
        width: slideSize,
        height: slideSize,
        top: orientation === "vertical" ? index * slideSize : 0,
        right: orientation === "vertical" ? slideSize : (index + 1) * slideSize,
        bottom: orientation === "vertical" ? (index + 1) * slideSize : slideSize,
        left: orientation === "vertical" ? 0 : index * slideSize,
        toJSON: () => ({}),
      } as DOMRect;
    }

    return originalGetBoundingClientRect.call(this);
  });
}


describe("@ariaui-web/carousel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/carousel");
    expect(componentSpec.slug).toBe("carousel");
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

      const element = createCarouselElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/carousel part");
  });

  it("defines all custom elements idempotently", () => {
    defineCarouselElements();
    defineCarouselElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineCarouselElements();
    const element = createCarouselElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("carousel");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineCarouselElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("carousel");
      expect(element.getAttribute("data-package")).toBe("carousel");
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
    defineCarouselElements();
    const element = appendPart(componentSpec.parts[0]!.tagName);
    const rootPart = componentSpec.parts[0] as RuntimePartSpec;

    element.setAttribute("orientation", "vertical");
    element.value = "alpha";
    element.open = true;
    element.pressed = true;
    element.selected = true;
    element.disabled = true;

    expect(element.getAttribute("data-orientation")).toBe("vertical");
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("data-state")).toBe(false);
    expect(element.hasAttribute("aria-expanded")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-selected")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);

    element.removeAttribute("orientation");
    element.removeAttribute("value");
    element.open = false;
    element.pressed = false;
    element.selected = false;
    element.disabled = false;

    expect(element.getAttribute("data-orientation")).toBe("horizontal");
    expect(element.hasAttribute("data-value")).toBe(false);
    expect(element.hasAttribute("aria-pressed")).toBe(false);
    expect(element.hasAttribute("aria-disabled")).toBe(false);
    expect(element.hasAttribute("data-disabled")).toBe(false);
  });

  it("implements checkable role requirements from the generated spec", () => {
    defineCarouselElements();

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
    defineCarouselElements();

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
    defineCarouselElements();

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



  it("matches APG carousel source part inventory and default semantics", () => {
    expect(componentSpec.parts.map((part) => part.name)).toEqual([
      "Root",
      "Container",
      "NextButton",
      "PreviousButton",
      "Slide",
      "Viewport",
    ]);
    expect(getPartSpec("Root").defaultRole).toBe("region");
    expect(getPartSpec("Root").defaultAttributes).toMatchObject({ "aria-roledescription": "carousel" });
    expect(getPartSpec("Viewport").defaultRole).toBeNull();
    expect(getPartSpec("Viewport").defaultAttributes).toMatchObject({ "aria-live": "polite", "aria-atomic": "false" });
    expect(getPartSpec("Slide").defaultRole).toBe("group");
    expect(getPartSpec("Slide").defaultAttributes).toMatchObject({ "aria-roledescription": "slide" });
    expect(getPartSpec("PreviousButton").defaultRole).toBe("button");
    expect(getPartSpec("NextButton").defaultRole).toBe("button");
  });

  it("renders source-equivalent root, viewport, slide, and button semantics", () => {
    const { root, previous, viewport, next, slides } = createCarousel();
    const canonicalSlides = slides();

    expect(root.getAttribute("role")).toBe("region");
    expect(root.getAttribute("aria-roledescription")).toBe("carousel");
    expect(root.getAttribute("aria-label")).toBe("Featured stories");
    expect(root.getAttribute("data-axis")).toBe("x");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(viewport.hasAttribute("role")).toBe(false);
    expect(viewport.getAttribute("aria-live")).toBe("polite");
    expect(viewport.getAttribute("aria-atomic")).toBe("false");
    expect(previous.getAttribute("role")).toBe("button");
    expect(next.getAttribute("role")).toBe("button");
    expect(previous.getAttribute("aria-disabled")).toBe("true");
    expect(next.hasAttribute("aria-disabled")).toBe(false);

    expect(canonicalSlides).toHaveLength(3);
    canonicalSlides.forEach((slide, index) => {
      expect(slide.getAttribute("role")).toBe("group");
      expect(slide.getAttribute("aria-roledescription")).toBe("slide");
      expect(slide.getAttribute("aria-label")).toBe(String(index + 1) + " of 3");
    });
    expect(canonicalSlides[0]?.getAttribute("data-active")).toBe("true");
    expect(canonicalSlides[1]?.hasAttribute("data-active")).toBe(false);
  });

  it("navigates finite carousels and disables buttons at source boundaries", () => {
    const { previous, container, next, slides } = createCarousel({ slidesPerView: 2, slideCount: 4 });
    mockCarouselLayout(container);

    expect(previous.getAttribute("aria-disabled")).toBe("true");
    expect(next.hasAttribute("aria-disabled")).toBe(false);

    next.click();
    carouselTransitionEnd(container);
    next.click();

    const canonicalSlides = slides();
    expect(canonicalSlides[2]?.getAttribute("data-active")).toBe("true");
    expect(previous.hasAttribute("aria-disabled")).toBe(false);
    expect(next.getAttribute("aria-disabled")).toBe("true");
    expect(container.style.transform).toBe("translate3d(-240px, 0px, 0px)");
  });

  it("supports loop clones and wraps navigation through source-equivalent canonical slides", () => {
    const { previous, container, next, slides } = createCarousel({ loop: true, slideCount: 3 });
    mockCarouselLayout(container);

    const renderedSlides = Array.from(container.querySelectorAll<RuntimeElement>("aria-carousel-slide"));
    expect(renderedSlides).toHaveLength(5);
    expect(renderedSlides[0]?.getAttribute("data-clone")).toBe("true");
    expect(renderedSlides[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(renderedSlides[0]?.textContent).toBe("Slide 3");
    expect(renderedSlides[4]?.getAttribute("data-clone")).toBe("true");
    expect(renderedSlides[4]?.textContent).toBe("Slide 1");
    expect(previous.hasAttribute("aria-disabled")).toBe(false);
    expect(next.hasAttribute("aria-disabled")).toBe(false);

    previous.click();
    expect(slides()[2]?.getAttribute("data-active")).toBe("true");
    carouselTransitionEnd(container);
    next.click();
    expect(slides()[0]?.getAttribute("data-active")).toBe("true");
  });

  it("rebases multiple-slide loop clones without animating the snap back to canonical slides", () => {
    const requestAnimationFrameCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
      requestAnimationFrameCallbacks.push(callback);
      return requestAnimationFrameCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    const { container, next, slides } = createCarousel({ loop: true, slidesPerView: 3, slideCount: 5 });
    mockDynamicCarouselLayout(container);

    for (let step = 0; step < 4; step += 1) {
      next.click();
      carouselTransitionEnd(container);
    }

    expect(slides()[4]?.getAttribute("data-active")).toBe("true");

    next.click();
    expect(slides()[0]?.getAttribute("data-active")).toBe("true");
    expect(container.style.transitionProperty).toBe("transform");
    expect(container.style.transform).toBe("translate3d(-960px, 0px, 0px)");

    carouselTransitionEnd(container);

    expect(container.style.transitionProperty).toBe("none");
    expect(container.style.transitionDuration).toBe("0ms");
    expect(container.style.transform).toBe("translate3d(-360px, 0px, 0px)");

    requestAnimationFrameCallbacks.shift()?.(0);
    expect(container.style.transitionProperty).toBe("none");

    requestAnimationFrameCallbacks.shift()?.(16);
    expect(container.style.transitionProperty).toBe("transform");
    expect(container.style.transitionDuration).toBe("");
  });

  it("supports vertical orientation through root and container attributes and transforms", () => {
    const { root, container, next, slides } = createCarousel({ orientation: "vertical", slideCount: 3 });
    mockCarouselLayout(container, { orientation: "vertical" });

    expect(root.getAttribute("data-axis")).toBe("y");
    expect(root.getAttribute("data-orientation")).toBe("vertical");
    expect(container.getAttribute("data-axis")).toBe("y");
    expect(container.getAttribute("data-orientation")).toBe("vertical");

    next.click();
    expect(slides()[1]?.getAttribute("data-active")).toBe("true");
    expect(container.style.transform).toBe("translate3d(0px, -120px, 0px)");
  });

  it("ignores rapid navigation until the transform transition ends", () => {
    const { container, next, slides } = createCarousel({ slideCount: 4 });
    mockCarouselLayout(container);

    next.click();
    next.click();
    next.click();

    expect(slides()[1]?.getAttribute("data-active")).toBe("true");

    carouselTransitionEnd(container);
    next.click();

    expect(slides()[2]?.getAttribute("data-active")).toBe("true");
  });



});
