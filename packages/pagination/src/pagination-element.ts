import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class PaginationWebElement extends AriaWebElement {}

export function createPaginationWebComponent(part: WebComponentPartSpec): typeof PaginationWebElement {
  return class extends PaginationWebElement {
    static override packageSlug = "pagination";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
