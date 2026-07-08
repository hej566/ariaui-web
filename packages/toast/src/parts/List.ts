import { createToastWebComponent } from "../toast-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "List");

if (!partSpec) {
  throw new Error("Missing List part spec for @ariaui-web/toast.");
}

export const List = createToastWebComponent(partSpec);
export type ListElement = InstanceType<typeof List>;
