import { ButtonElement } from "../button-element";
import { getButtonPartSpec } from "./part-spec";

const partSpec = getButtonPartSpec("Item");

export class Item extends ButtonElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ItemElement = InstanceType<typeof Item>;
