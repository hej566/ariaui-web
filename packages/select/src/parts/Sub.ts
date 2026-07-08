import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Sub");

if (!partSpec) {
  throw new Error("Missing Sub part spec for @ariaui-web/select.");
}

export const Sub = createSelectWebComponent(partSpec);
export type SubElement = InstanceType<typeof Sub>;
