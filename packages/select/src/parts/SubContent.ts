import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "SubContent");

if (!partSpec) {
  throw new Error("Missing SubContent part spec for @ariaui-web/select.");
}

export const SubContent = createSelectWebComponent(partSpec);
export type SubContentElement = InstanceType<typeof SubContent>;
