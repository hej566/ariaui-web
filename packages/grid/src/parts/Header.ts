import { GridElement } from "../grid-element";
import { getGridPartSpec } from "./part-spec";

const partSpec = getGridPartSpec("Header");

export class Header extends GridElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeaderElement = InstanceType<typeof Header>;
