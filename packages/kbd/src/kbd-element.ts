import { AriaWebElement } from "@ariaui-web/utils";

const kbdStateReflectionAttributes = [
  "aria-checked",
  "aria-disabled",
  "aria-expanded",
  "aria-pressed",
  "aria-selected",
  "data-disabled",
  "data-orientation",
  "data-state",
  "data-value",
] as const;

const kbdMetadataAttributes = new Set([
  "data-ariaui-web",
  "data-package",
  "data-part",
  "native-composition",
  "part",
]);

export class KbdElement extends AriaWebElement {
  static override packageSlug = "kbd";

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "aria-label",
      "class",
      "native-composition",
      "style",
      "title",
    ]));
  }

  override bindAriaWebEvents() {
    // Kbd is display-only. Source Kbd forwards consumer events but does not add
    // disabled guards, activation behavior, or button-like keyboard semantics.
  }

  override afterAriaWebContractApplied() {
    removeKbdStateReflection(this);
    syncKbdNativeComposition(this);
  }
}

function removeKbdStateReflection(element: HTMLElement) {
  for (const attribute of kbdStateReflectionAttributes) {
    element.removeAttribute(attribute);
  }

  element.querySelector("input[data-ariaui-web-hidden-input='true']")?.remove();
}

function syncKbdNativeComposition(element: HTMLElement) {
  if (!element.hasAttribute("native-composition")) {
    return;
  }

  const child = element.firstElementChild;
  if (!(child instanceof HTMLElement)) {
    return;
  }

  for (const token of Array.from(element.classList)) {
    child.classList.add(token);
  }

  for (let index = 0; index < element.style.length; index += 1) {
    const property = element.style.item(index);
    child.style.setProperty(property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property));
  }

  for (const attribute of Array.from(element.attributes)) {
    if (attribute.name === "class" || attribute.name === "style" || kbdMetadataAttributes.has(attribute.name)) {
      continue;
    }

    if (!child.hasAttribute(attribute.name)) {
      child.setAttribute(attribute.name, attribute.value);
    }
  }
}
