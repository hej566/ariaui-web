import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubTrigger");

if (!partSpec) {
  throw new Error("Missing SubTrigger part spec for @ariaui-web/select.");
}

export const SubTrigger = createSelectWebComponent(partSpec);
export type SubTriggerElement = InstanceType<typeof SubTrigger>;
