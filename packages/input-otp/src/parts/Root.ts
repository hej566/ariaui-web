import { createInputOtpWebComponent } from "../input-otp-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/input-otp.");
}

export const Root = createInputOtpWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
