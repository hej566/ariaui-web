import { AriaWebElement } from "@ariaui-web/utils";
import { syncAccordionTreeAround } from "./accordion-sync";

export class AccordionElement extends AriaWebElement {
  static override packageSlug = "accordion";

  override afterAriaWebContractApplied() {
    syncAccordionTreeAround(this);
  }
}
