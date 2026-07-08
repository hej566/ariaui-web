import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "InputOTP");

if (!partSpec) {
  throw new Error("Missing InputOTP part spec for @ariaui-web/input-otp.");
}

export const InputOTP = createInputOtpWebComponent(partSpec);
export type InputOTPElement = InstanceType<typeof InputOTP>;
