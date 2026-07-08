import { AvatarElement } from "../avatar-element";
import { getAvatarPartSpec } from "./part-spec";

const partSpec = getAvatarPartSpec("Fallback");

export class Fallback extends AvatarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type FallbackElement = InstanceType<typeof Fallback>;
