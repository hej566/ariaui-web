import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Option");

if (!partSpec) {
  throw new Error("Missing Option part spec for @ariaui-web/select.");
}

export const Option = createSelectWebComponent(partSpec);
export type OptionElement = InstanceType<typeof Option>;
