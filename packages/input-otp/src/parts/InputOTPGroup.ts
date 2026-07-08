import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "InputOTPGroup");

if (!partSpec) {
  throw new Error("Missing InputOTPGroup part spec for @ariaui-web/input-otp.");
}

export const InputOTPGroup = createInputOtpWebComponent(partSpec);
export type InputOTPGroupElement = InstanceType<typeof InputOTPGroup>;
