import { AvatarElement } from "../avatar-element";
import { getAvatarPartSpec } from "./part-spec";

const partSpec = getAvatarPartSpec("Group");

export class Group extends AvatarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type GroupElement = InstanceType<typeof Group>;
