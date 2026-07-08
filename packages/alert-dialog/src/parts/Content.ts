import { AlertDialogElement } from "../alert-dialog-element";
import { handleAlertDialogContentKeyDown } from "../alert-dialog-actions";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Content");

export class Content extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #alertDialogContentBound = false;

  override afterAriaWebContractApplied() {
    super.afterAriaWebContractApplied();
    this.bindAlertDialogContentEvents();
  }

  bindAlertDialogContentEvents() {
    if (this.#alertDialogContentBound) {
      return;
    }

    this.addEventListener("keydown", this.handleAlertDialogContentKeyDown);
    this.#alertDialogContentBound = true;
  }

  handleAlertDialogContentKeyDown = (event: KeyboardEvent) => {
    handleAlertDialogContentKeyDown(this, event);
  };
}

export type ContentElement = InstanceType<typeof Content>;
