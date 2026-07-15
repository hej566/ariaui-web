import { ProgressElement } from "../progress-element";
import { getProgressPartSpec } from "./part-spec";

const partSpec = getProgressPartSpec("Root");

export class Root extends ProgressElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
