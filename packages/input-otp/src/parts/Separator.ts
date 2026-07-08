import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Separator");

if (!partSpec) {
  throw new Error("Missing Separator part spec for @ariaui-web/input-otp.");
}

export const Separator = createInputOtpWebComponent(partSpec);
export type SeparatorElement = InstanceType<typeof Separator>;
