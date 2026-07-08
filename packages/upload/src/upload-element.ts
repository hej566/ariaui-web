import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class UploadWebElement extends AriaWebElement {}

export function createUploadWebComponent(part: WebComponentPartSpec): typeof UploadWebElement {
  return class extends UploadWebElement {
    static override packageSlug = "upload";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
