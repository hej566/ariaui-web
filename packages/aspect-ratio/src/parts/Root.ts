import { AspectRatioElement } from "../aspect-ratio-element";
import { getAspectRatioPartSpec } from "./part-spec";

const partSpec = getAspectRatioPartSpec("Root");

export class Root extends AspectRatioElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
