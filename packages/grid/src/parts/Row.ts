import { GridElement } from "../grid-element";
import { getGridPartSpec } from "./part-spec";

const partSpec = getGridPartSpec("Row");

export class Row extends GridElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RowElement = InstanceType<typeof Row>;
