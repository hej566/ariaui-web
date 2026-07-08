import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "TagGroup");

if (!partSpec) {
  throw new Error("Missing TagGroup part spec for @ariaui-web/select.");
}

export const TagGroup = createSelectWebComponent(partSpec);
export type TagGroupElement = InstanceType<typeof TagGroup>;
