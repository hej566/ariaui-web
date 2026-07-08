import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class AspectRatioWebElement extends AriaWebElement {}

export function createAspectRatioWebComponent(part: WebComponentPartSpec): typeof AspectRatioWebElement {
  return class extends AspectRatioWebElement {
    static override packageSlug = "aspect-ratio";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
