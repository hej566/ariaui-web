import { DropdownMenuElement } from "../dropdown-menu-element";
import { getDropdownMenuPartSpec } from "./part-spec";

const partSpec = getDropdownMenuPartSpec("SubContent");

export class SubContent extends DropdownMenuElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type SubContentElement = InstanceType<typeof SubContent>;
