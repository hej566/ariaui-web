import { AlertDialogElement } from "../alert-dialog-element";
import { requestAlertDialogCloseFromPart } from "../alert-dialog-actions";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Cancel");

export class Cancel extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogCloseBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDialogCloseEvents();
  }

  bindAlertDialogCloseEvents() {
    if (this.#alertDialogCloseBound) {
      return;
    }

    this.addEventListener("click", this.handleAlertDialogCloseClick);
    this.#alertDialogCloseBound = true;
  }

  handleAlertDialogCloseClick = (event: MouseEvent) => {
    requestAlertDialogCloseFromPart(this, event);
  };
}

export type CancelElement = InstanceType<typeof Cancel>;
