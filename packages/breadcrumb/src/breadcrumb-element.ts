import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class BreadcrumbWebElement extends AriaWebElement {}

export function createBreadcrumbWebComponent(part: WebComponentPartSpec): typeof BreadcrumbWebElement {
  return class extends BreadcrumbWebElement {
    static override packageSlug = "breadcrumb";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
