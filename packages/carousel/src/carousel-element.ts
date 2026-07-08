import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class CarouselWebElement extends AriaWebElement {}

export function createCarouselWebComponent(part: WebComponentPartSpec): typeof CarouselWebElement {
  return class extends CarouselWebElement {
    static override packageSlug = "carousel";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
