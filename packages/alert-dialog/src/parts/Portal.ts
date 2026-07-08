import { AlertDialogElement } from "../alert-dialog-element";
import { getAlertDialogPartSpec } from "./part-spec";

const partSpec = getAlertDialogPartSpec("Portal");

export class Portal extends AlertDialogElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type PortalElement = InstanceType<typeof Portal>;
