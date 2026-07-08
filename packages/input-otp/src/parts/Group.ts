import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/input-otp.");
}

export const Group = createInputOtpWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
