import { AlertDialogElement } from "../alert-dialog-element";
import { requestAlertDialogOpenFromPart } from "../alert-dialog-actions";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Trigger");

export class Trigger extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogTriggerBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDialogTriggerEvents();
  }

  bindAlertDialogTriggerEvents() {
    if (this.#alertDialogTriggerBound) {
      return;
    }

    this.addEventListener("click", this.handleAlertDialogTriggerClick);
    this.#alertDialogTriggerBound = true;
  }

  handleAlertDialogTriggerClick = (event: MouseEvent) => {
    requestAlertDialogOpenFromPart(this, event);
  };
}

export type TriggerElement = InstanceType<typeof Trigger>;
