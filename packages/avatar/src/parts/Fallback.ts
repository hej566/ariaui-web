import { createAvatarWebComponent } from "../avatar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Fallback");

if (!partSpec) {
  throw new Error("Missing Fallback part spec for @ariaui-web/avatar.");
}

export const Fallback = createAvatarWebComponent(partSpec);
export type FallbackElement = InstanceType<typeof Fallback>;
