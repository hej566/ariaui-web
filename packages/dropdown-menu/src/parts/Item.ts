import { DropdownMenuElement } from "../dropdown-menu-element";
import { getDropdownMenuPartSpec } from "./part-spec";

const partSpec = getDropdownMenuPartSpec("Item");

export class Item extends DropdownMenuElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ItemElement = InstanceType<typeof Item>;
