import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SplitterWebElement extends AriaWebElement {}

export function createSplitterWebComponent(part: WebComponentPartSpec): typeof SplitterWebElement {
  return class extends SplitterWebElement {
    static override packageSlug = "splitter";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
