import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

const cardStateReflectionAttributes = [
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

export class CardWebElement extends AriaWebElement {
  override bindAriaWebEvents() {
    // Card is structural. Source Card forwards authored DOM behavior without
    // disabled guards, activation behavior, or button-like keyboard semantics.
  }

  override afterAriaWebContractApplied() {
    removeCardStateReflection(this);
  }
}

function removeCardStateReflection(element: HTMLElement) {
  for (const attribute of cardStateReflectionAttributes) {
    element.removeAttribute(attribute);
  }

  element.querySelector("input[data-ariaui-web-hidden-input='true']")?.remove();
}

export function createCardWebComponent(part: WebComponentPartSpec): typeof CardWebElement {
  return class extends CardWebElement {
    static override packageSlug = "card";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
