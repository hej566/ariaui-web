import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "InputOTPSlot");

if (!partSpec) {
  throw new Error("Missing InputOTPSlot part spec for @ariaui-web/input-otp.");
}

export const InputOTPSlot = createInputOtpWebComponent(partSpec);
export type InputOTPSlotElement = InstanceType<typeof InputOTPSlot>;
