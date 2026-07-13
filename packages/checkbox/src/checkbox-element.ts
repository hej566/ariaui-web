import { AriaWebElement } from "@ariaui-web/utils";
import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { handleCheckboxClick } from "./checkbox-actions";
import { syncCheckboxTreeAround } from "./checkbox-sync";

export class CheckboxWebElement extends AriaWebElement {
  override afterAriaWebContractApplied() {
    syncCheckboxTreeAround(this);
  }

  override handleAriaWebClick = (event: Event) => {
    handleCheckboxClick(this, event);
  };
}

export function createCheckboxWebComponent(part: WebComponentPartSpec): typeof CheckboxWebElement {
  return class extends CheckboxWebElement {
    static override packageSlug = "checkbox";
    static override partName = part.name;
    static override defaultRole = part.defaultRole;
    static override defaultAttributes = part.defaultAttributes;
  };
}
