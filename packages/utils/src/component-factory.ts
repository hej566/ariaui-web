import { AriaWebElement } from "./aria-web-element";
import type { WebComponentPartSpec } from "./types";

export function createAriaWebComponent(part: WebComponentPartSpec, packageSlug: string): typeof AriaWebElement {
  return class extends AriaWebElement {
    static override packageSlug = packageSlug;
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
