import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "InputOTPSeparator");

if (!partSpec) {
  throw new Error("Missing InputOTPSeparator part spec for @ariaui-web/input-otp.");
}

export const InputOTPSeparator = createInputOtpWebComponent(partSpec);
export type InputOTPSeparatorElement = InstanceType<typeof InputOTPSeparator>;
