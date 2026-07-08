import { AlertElement } from "../alert-element";
import { getAlertPartSpec } from "./part-spec";

const partSpec = getAlertPartSpec("Title");

export class Title extends AlertElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type TitleElement = InstanceType<typeof Title>;
