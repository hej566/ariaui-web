import { ButtonElement } from "../button-element";
import { getButtonPartSpec } from "./part-spec";

const partSpec = getButtonPartSpec("Root");

export class Root extends ButtonElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
