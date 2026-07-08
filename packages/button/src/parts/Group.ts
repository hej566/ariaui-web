import { createButtonWebComponent } from "../button-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/button.");
}

export const Group = createButtonWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
