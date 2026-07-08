import { createAvatarWebComponent } from "../avatar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/avatar.");
}

export const Root = createAvatarWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
