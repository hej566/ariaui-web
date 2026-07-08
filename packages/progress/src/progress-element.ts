import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class ProgressWebElement extends AriaWebElement {}

export function createProgressWebComponent(part: WebComponentPartSpec): typeof ProgressWebElement {
  return class extends ProgressWebElement {
    static override packageSlug = "progress";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
