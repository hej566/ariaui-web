import { createToastWebComponent } from "../toast-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Close");

if (!partSpec) {
  throw new Error("Missing Close part spec for @ariaui-web/toast.");
}

export const Close = createToastWebComponent(partSpec);
export type CloseElement = InstanceType<typeof Close>;
