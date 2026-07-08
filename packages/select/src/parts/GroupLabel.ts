import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "GroupLabel");

if (!partSpec) {
  throw new Error("Missing GroupLabel part spec for @ariaui-web/select.");
}

export const GroupLabel = createSelectWebComponent(partSpec);
export type GroupLabelElement = InstanceType<typeof GroupLabel>;
