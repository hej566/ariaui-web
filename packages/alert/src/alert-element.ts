import { AriaWebElement } from "@ariaui-web/utils";
import { syncAlertTreeAround } from "./alert-sync";

export class AlertElement extends AriaWebElement {
  static override packageSlug = "alert";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "dismissible", "native-composition"]));
  }

  override afterAriaWebContractApplied() {
    syncAlertTreeAround(this);
  }
}
