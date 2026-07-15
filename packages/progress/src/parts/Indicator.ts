import { ProgressElement } from "../progress-element";
import { getProgressPartSpec } from "./part-spec";

const partSpec = getProgressPartSpec("Indicator");

export class Indicator extends ProgressElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type IndicatorElement = InstanceType<typeof Indicator>;
