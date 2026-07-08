import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class AvatarWebElement extends AriaWebElement {}

export function createAvatarWebComponent(part: WebComponentPartSpec): typeof AvatarWebElement {
  return class extends AvatarWebElement {
    static override packageSlug = "avatar";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
