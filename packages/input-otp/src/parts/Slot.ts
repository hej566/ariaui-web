import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Slot");

if (!partSpec) {
  throw new Error("Missing Slot part spec for @ariaui-web/input-otp.");
}

export const Slot = createInputOtpWebComponent(partSpec);
export type SlotElement = InstanceType<typeof Slot>;
