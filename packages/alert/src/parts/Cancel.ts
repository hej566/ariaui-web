import { AlertElement } from "../alert-element";
import { requestAlertDismissFromPart } from "../alert-actions";
import { getAlertPartSpec } from "./part-spec";

const partSpec = getAlertPartSpec("Cancel");

export class Cancel extends AlertElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDismissBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDismissEvents();
  }

  bindAlertDismissEvents() {
    if (this.#alertDismissBound) {
      return;
    }

    this.addEventListener("click", this.handleAlertDismissClick);
    this.#alertDismissBound = true;
  }

  handleAlertDismissClick = (event: MouseEvent) => {
    requestAlertDismissFromPart(this, event);
  };
}

export type CancelElement = InstanceType<typeof Cancel>;
