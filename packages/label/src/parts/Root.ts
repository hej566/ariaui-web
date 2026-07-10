import { LabelElement } from "../label-element";
import { getLabelPartSpec } from "./part-spec";

const partSpec = getLabelPartSpec("Root");

export class Root extends LabelElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
