import { AvatarElement } from "../avatar-element";
import { getAvatarPartSpec } from "./part-spec";

const partSpec = getAvatarPartSpec("Root");

export class Root extends AvatarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
