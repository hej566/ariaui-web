import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";

export class SliderWebElement extends AriaWebElement {}

export function createSliderWebComponent(part: WebComponentPartSpec): typeof SliderWebElement {
  return class extends SliderWebElement {
    static override packageSlug = "slider";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
