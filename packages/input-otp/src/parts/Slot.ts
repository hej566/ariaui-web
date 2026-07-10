import { InputOtpElement } from "../input-otp-element";
import { getInputOtpPartSpec } from "./part-spec";

const partSpec = getInputOtpPartSpec("Slot");

export class Slot extends InputOtpElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type SlotElement = InstanceType<typeof Slot>;
