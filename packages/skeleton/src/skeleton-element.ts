import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SkeletonWebElement extends AriaWebElement {}

export function createSkeletonWebComponent(part: WebComponentPartSpec): typeof SkeletonWebElement {
  return class extends SkeletonWebElement {
    static override packageSlug = "skeleton";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
