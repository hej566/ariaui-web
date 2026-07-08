import { createCheckboxWebComponent } from "../checkbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/checkbox.");
}

export const Group = createCheckboxWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
