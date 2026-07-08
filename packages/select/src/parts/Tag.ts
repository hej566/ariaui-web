import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Tag");

if (!partSpec) {
  throw new Error("Missing Tag part spec for @ariaui-web/select.");
}

export const Tag = createSelectWebComponent(partSpec);
export type TagElement = InstanceType<typeof Tag>;
