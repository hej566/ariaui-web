import { KbdElement } from "../kbd-element";
import { getKbdPartSpec } from "./part-spec";

const partSpec = getKbdPartSpec("Group");

export class Group extends KbdElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type GroupElement = InstanceType<typeof Group>;
