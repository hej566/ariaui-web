import { InputElement } from "../input-element";
import { getInputPartSpec } from "./part-spec";

const partSpec = getInputPartSpec("Root");

export class Root extends InputElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
