import { ArrowElement } from "../arrow-element";
import { getArrowPartSpec } from "./part-spec";

const partSpec = getArrowPartSpec("Root");

export class Root extends ArrowElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
