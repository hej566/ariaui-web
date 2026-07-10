import { GridElement } from "../grid-element";
import { getGridPartSpec } from "./part-spec";

const partSpec = getGridPartSpec("Root");

export class Root extends GridElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
