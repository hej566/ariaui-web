import { AriaWebElement } from "@ariaui-web/utils";
import { syncAlertDialogTreeAround } from "./alert-dialog-sync";

export class AlertDialogElement extends AriaWebElement {
  static override packageSlug = "alert-dialog";

  static override get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "default-open", "defaultopen", "force-mount"]));
  }

  override afterAriaWebContractApplied() {
    syncAlertDialogTreeAround(this);
  }
}
