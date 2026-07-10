import { AriaWebElement } from "@ariaui-web/utils";

const nativeLabelControlSelector = "button, input, select, textarea";

const labelStateReflectionAttributes = [
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

const labelMetadataAttributes = new Set([
  "data-ariaui-web",
  "data-package",
  "data-part",
  "native-composition",
  "part",
]);

export class LabelElement extends AriaWebElement {
  static override packageSlug = "label";
  #labelEventsBound = false;

  static override get observedAttributes() {
    return Array.from(new Set([
      ...super.observedAttributes,
      "class",
      "for",
      "htmlfor",
      "native-composition",
      "style",
      "title",
    ]));
  }

  get htmlFor() {
    return this.getAttribute("for") ?? "";
  }

  set htmlFor(value: string | null | undefined) {
    if (value == null || value === "") {
      this.removeAttribute("for");
    } else {
      this.setAttribute("for", String(value));
    }
  }

  override bindAriaWebEvents() {
    if (this.#labelEventsBound) {
      return;
    }

    this.addEventListener("mousedown", handleLabelMouseDown);
    this.addEventListener("click", handleLabelClick);
    this.#labelEventsBound = true;
  }

  override afterAriaWebContractApplied() {
    syncLabelForAlias(this);
    removeLabelStateReflection(this);
    syncLabelNativeComposition(this);
  }
}

function syncLabelForAlias(element: HTMLElement) {
  const htmlFor = element.getAttribute("htmlfor");
  if (htmlFor == null) {
    return;
  }

  if (!element.hasAttribute("for")) {
    element.setAttribute("for", htmlFor);
  }

  element.removeAttribute("htmlfor");
}

function removeLabelStateReflection(element: HTMLElement) {
  for (const attribute of labelStateReflectionAttributes) {
    element.removeAttribute(attribute);
  }

  element.querySelector("input[data-ariaui-web-hidden-input='true']")?.remove();
}

function handleLabelMouseDown(event: Event) {
  if (!(event instanceof MouseEvent) || !(event.currentTarget instanceof HTMLElement)) {
    return;
  }

  if (labelEventStartedInsideNativeControl(event)) {
    return;
  }

  if (!event.defaultPrevented && event.detail > 1) {
    event.preventDefault();
  }
}

function handleLabelClick(event: Event) {
  if (event.defaultPrevented || !(event.currentTarget instanceof HTMLElement)) {
    return;
  }

  if (labelEventStartedInsideNativeControl(event)) {
    return;
  }

  labelControl(event.currentTarget)?.click();
}

function labelEventStartedInsideNativeControl(event: Event) {
  return event.target instanceof Element && Boolean(event.target.closest(nativeLabelControlSelector));
}

function labelControl(element: HTMLElement) {
  const forId = element.getAttribute("for");
  if (forId) {
    const control = element.ownerDocument.getElementById(forId);
    if (control instanceof HTMLElement && isNativeLabelControl(control)) {
      return control;
    }
  }

  return Array.from(element.querySelectorAll(nativeLabelControlSelector)).find((candidate): candidate is HTMLElement => {
    return candidate instanceof HTMLElement && isNativeLabelControl(candidate);
  }) ?? null;
}

function isNativeLabelControl(element: HTMLElement) {
  return element.matches(nativeLabelControlSelector);
}

function syncLabelNativeComposition(element: HTMLElement) {
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
    if (attribute.name === "class" || attribute.name === "style" || labelMetadataAttributes.has(attribute.name)) {
      continue;
    }

    if (!child.hasAttribute(attribute.name)) {
      child.setAttribute(attribute.name, attribute.value);
    }
  }
}
