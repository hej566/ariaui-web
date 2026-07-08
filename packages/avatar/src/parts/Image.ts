import { createAvatarWebComponent } from "../avatar-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Image");

if (!partSpec) {
  throw new Error("Missing Image part spec for @ariaui-web/avatar.");
}

export const Image = createAvatarWebComponent(partSpec);
export type ImageElement = InstanceType<typeof Image>;
