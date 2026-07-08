import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class TableWebElement extends AriaWebElement {}

export function createTableWebComponent(part: WebComponentPartSpec): typeof TableWebElement {
  return class extends TableWebElement {
    static override packageSlug = "table";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
