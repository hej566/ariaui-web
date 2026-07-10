import { GridElement } from "../grid-element";
import { getGridPartSpec } from "./part-spec";

const partSpec = getGridPartSpec("Body");

export class Body extends GridElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type BodyElement = InstanceType<typeof Body>;
