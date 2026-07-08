import { createAvatarWebComponent } from "../avatar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Group");

if (!partSpec) {
  throw new Error("Missing Group part spec for @ariaui-web/avatar.");
}

export const Group = createAvatarWebComponent(partSpec);
export type GroupElement = InstanceType<typeof Group>;
