import { createKbdWebComponent } from "../kbd-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/kbd.");
}

export const Group = createKbdWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
