import { GridElement } from "../grid-element";
import { getGridPartSpec } from "./part-spec";

const partSpec = getGridPartSpec("Head");

export class Head extends GridElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeadElement = InstanceType<typeof Head>;
