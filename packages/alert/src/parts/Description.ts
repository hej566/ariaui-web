import { AlertElement } from "../alert-element";
import { getAlertPartSpec } from "./part-spec";

const partSpec = getAlertPartSpec("Description");

export class Description extends AlertElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type DescriptionElement = InstanceType<typeof Description>;
