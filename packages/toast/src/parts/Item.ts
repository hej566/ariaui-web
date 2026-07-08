import { createToastWebComponent } from "../toast-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/toast.");
}

export const Item = createToastWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
