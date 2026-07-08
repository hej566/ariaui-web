import { AvatarElement } from "../avatar-element";
import { getAvatarPartSpec } from "./part-spec";

const partSpec = getAvatarPartSpec("Image");

export class Image extends AvatarElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ImageElement = InstanceType<typeof Image>;
