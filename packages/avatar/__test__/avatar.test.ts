import { afterEach, describe, expect, it, vi } from "vitest";
import { componentSpec, createAvatarElement, defineAvatarElements, getPartSpec, type ComponentPartName } from "../src";

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

describe("@ariaui-web/avatar", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("declares a native web component spec for every separated package part", () => {
    expect(componentSpec.kind).toBe("component");
    expect(componentSpec.packageName).toBe("@ariaui-web/avatar");
    expect(componentSpec.slug).toBe("avatar");
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

      const element = createAvatarElement(part.name);
      expect(element.tagName.toLowerCase()).toBe(part.tagName);
    }

    expect(() => getPartSpec("__missing__" as ComponentPartName)).toThrow("Unknown @ariaui-web/avatar part");
  });

  it("defines all custom elements idempotently", () => {
    defineAvatarElements();
    defineAvatarElements();

    for (const part of componentSpec.parts) {
      expect(customElements.get(part.tagName)).toBeTruthy();
    }
  });

  it("creates elements that reflect the common Aria UI Web contract", () => {
    defineAvatarElements();
    const element = createAvatarElement();
    element.setAttribute("orientation", "horizontal");
    document.body.append(element);

    expect(element.tagName.toLowerCase()).toBe(componentSpec.parts[0]?.tagName);
    expect(element.getAttribute("data-ariaui-web")).toBe("avatar");
    expect(element.getAttribute("data-part")).toBe("Root");
    expect(element.getAttribute("data-orientation")).toBe("horizontal");

    element.remove();
  });

  it("connects every custom element to its spec part metadata", () => {
    defineAvatarElements();

    for (const part of componentSpec.parts) {
      const element = appendPart(part.tagName);
      const runtimePart = part as RuntimePartSpec;

      expect(element.getAttribute("data-ariaui-web")).toBe("avatar");
      expect(element.getAttribute("data-package")).toBe("avatar");
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
    defineAvatarElements();
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
    defineAvatarElements();

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
    defineAvatarElements();

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
    defineAvatarElements();

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


  function createAvatarFixture(options: {
    alt?: string;
    delayMs?: string;
    fallback?: string;
    role?: string;
    ariaLabel?: string;
    src?: string;
  } = {}) {
    defineAvatarElements();
    const root = document.createElement("aria-avatar") as RuntimeElement;
    const image = document.createElement("aria-avatar-image") as RuntimeElement;
    const fallback = document.createElement("aria-avatar-fallback") as RuntimeElement;

    image.setAttribute("src", options.src ?? "/avatar.png");
    image.setAttribute("alt", options.alt ?? "User avatar");
    fallback.textContent = options.fallback ?? "CT";

    if (options.delayMs) {
      fallback.setAttribute("delay-ms", options.delayMs);
    }

    if (options.role) {
      root.setAttribute("role", options.role);
    }

    if (options.ariaLabel) {
      root.setAttribute("aria-label", options.ariaLabel);
    }

    root.append(image, fallback);
    document.body.append(root);
    return { root, image, fallback, img: image.querySelector("img") as HTMLImageElement | null };
  }

  function dispatchImageLoad(image: HTMLElement) {
    const img = image.querySelector("img") as HTMLImageElement | null;
    expect(img).not.toBeNull();
    img?.dispatchEvent(new Event("load", { bubbles: false }));
    return img;
  }

  function dispatchImageError(image: HTMLElement) {
    const img = image.querySelector("img") as HTMLImageElement | null;
    expect(img).not.toBeNull();
    img?.dispatchEvent(new Event("error", { bubbles: false }));
    return img;
  }

  it("matches source Root, Image, and Fallback semantics while image is loading", () => {
    const { root, image, fallback, img } = createAvatarFixture();

    expect(root.tagName.toLowerCase()).toBe("aria-avatar");
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("avatar");
    expect(fallback.hidden).toBe(false);
    expect(fallback.textContent).toBe("CT");
    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(img?.getAttribute("alt")).toBe("User avatar");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");
    expect(image.getAttribute("data-loading-status")).toBe("loading");
  });

  it("hides fallback and removes default root image semantics when image loads", () => {
    const { root, image, fallback } = createAvatarFixture();
    const loadEvents: string[] = [];
    const statusEvents: string[] = [];
    image.addEventListener("load", () => loadEvents.push("load"));
    root.addEventListener("loadingstatuschange", (event) => {
      statusEvents.push((event as CustomEvent<{ status: string }>).detail.status);
    });

    const img = dispatchImageLoad(image);

    expect(loadEvents).toEqual(["load"]);
    expect(statusEvents).toContain("loaded");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.hasAttribute("aria-label")).toBe(false);
    expect(fallback.hidden).toBe(true);
    expect(img?.hasAttribute("aria-hidden")).toBe(false);
    expect(img?.style.visibility).toBe("");
    expect(image.getAttribute("data-loading-status")).toBe("loaded");
  });

  it("keeps fallback visible and default semantics when image errors", () => {
    const { root, image, fallback } = createAvatarFixture({ src: "/broken.png" });
    const errorEvents: string[] = [];
    image.addEventListener("error", () => errorEvents.push("error"));

    const img = dispatchImageError(image);

    expect(errorEvents).toEqual(["error"]);
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("avatar");
    expect(fallback.hidden).toBe(false);
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");
    expect(image.getAttribute("data-loading-status")).toBe("error");
  });

  it("allows consumers to override root role and aria-label", () => {
    const { root, image } = createAvatarFixture({ role: "presentation", ariaLabel: "Profile photo" });

    expect(root.getAttribute("role")).toBe("presentation");
    expect(root.getAttribute("aria-label")).toBe("Profile photo");
    dispatchImageLoad(image);
    expect(root.getAttribute("role")).toBe("presentation");
    expect(root.getAttribute("aria-label")).toBe("Profile photo");
  });

  it("resets fallback visibility when image src changes after loading", () => {
    const { root, image, fallback } = createAvatarFixture();
    dispatchImageLoad(image);
    expect(root.hasAttribute("role")).toBe(false);
    expect(fallback.hidden).toBe(true);

    image.setAttribute("src", "/avatar-2.png");
    const img = image.querySelector("img") as HTMLImageElement | null;

    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("avatar");
    expect(fallback.hidden).toBe(false);
    expect(img?.getAttribute("src")).toBe("/avatar-2.png");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.style.visibility).toBe("hidden");
  });

  it("supports delayed fallback rendering and suppresses it if image loads first", () => {
    vi.useFakeTimers();
    try {
      const first = createAvatarFixture({ delayMs: "300" });
      expect(first.fallback.hidden).toBe(true);
      vi.advanceTimersByTime(299);
      expect(first.fallback.hidden).toBe(true);
      vi.advanceTimersByTime(1);
      expect(first.fallback.hidden).toBe(false);

      document.body.replaceChildren();
      const second = createAvatarFixture({ delayMs: "300" });
      dispatchImageLoad(second.image);
      vi.advanceTimersByTime(300);
      expect(second.fallback.hidden).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("forwards image attributes to the rendered img", () => {
    defineAvatarElements();
    const image = document.createElement("aria-avatar-image") as RuntimeElement;
    image.setAttribute("src", "/avatar.png");
    image.setAttribute("alt", "User avatar");
    image.setAttribute("srcset", "/avatar@2x.png 2x");
    image.setAttribute("sizes", "48px");
    image.setAttribute("crossorigin", "anonymous");
    image.setAttribute("referrerpolicy", "no-referrer");
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
    document.body.append(image);
    const img = image.querySelector("img") as HTMLImageElement | null;

    expect(img?.getAttribute("src")).toBe("/avatar.png");
    expect(img?.getAttribute("alt")).toBe("User avatar");
    expect(img?.getAttribute("srcset")).toBe("/avatar@2x.png 2x");
    expect(img?.getAttribute("sizes")).toBe("48px");
    expect(img?.getAttribute("crossorigin")).toBe("anonymous");
    expect(img?.getAttribute("referrerpolicy")).toBe("no-referrer");
    expect(img?.getAttribute("loading")).toBe("lazy");
    expect(img?.getAttribute("decoding")).toBe("async");
  });

  it("supports Root convenience src alt fallback and fallback-delay-ms attributes", () => {
    vi.useFakeTimers();
    try {
      defineAvatarElements();
      const root = document.createElement("aria-avatar") as RuntimeElement;
      root.setAttribute("src", "/avatar.png");
      root.setAttribute("alt", "Profile photo");
      root.setAttribute("fallback", "SC");
      root.setAttribute("fallback-delay-ms", "200");
      document.body.append(root);

      const image = root.querySelector("aria-avatar-image") as HTMLElement | null;
      const fallback = root.querySelector("aria-avatar-fallback") as HTMLElement | null;
      const img = image?.querySelector("img") as HTMLImageElement | null;

      expect(image).not.toBeNull();
      expect(fallback).not.toBeNull();
      expect(img?.getAttribute("src")).toBe("/avatar.png");
      expect(img?.getAttribute("alt")).toBe("Profile photo");
      expect(fallback?.textContent).toBe("SC");
      expect(fallback?.hidden).toBe(true);
      vi.advanceTimersByTime(200);
      expect(fallback?.hidden).toBe(false);
      dispatchImageLoad(image as HTMLElement);
      expect(fallback?.hidden).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not render an internal img when Image has no src", () => {
    defineAvatarElements();
    const image = document.createElement("aria-avatar-image") as RuntimeElement;
    document.body.append(image);

    expect(image.querySelector("img")).toBeNull();
    expect(image.getAttribute("data-loading-status")).toBe("error");
  });

  it("keeps Group role behavior aligned with the source package", () => {
    defineAvatarElements();
    const group = document.createElement("aria-avatar-group") as RuntimeElement;
    document.body.append(group);
    expect(group.getAttribute("role")).toBe("group");

    const presentation = document.createElement("aria-avatar-group") as RuntimeElement;
    presentation.setAttribute("role", "presentation");
    document.body.append(presentation);
    expect(presentation.getAttribute("role")).toBe("presentation");
  });




});
