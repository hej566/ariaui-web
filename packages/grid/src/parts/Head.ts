import { createGridWebComponent } from "../grid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Head");

if (!partSpec) {
  throw new Error("Missing Head part spec for @ariaui-web/grid.");
}

export const Head = createGridWebComponent(partSpec);
export type HeadElement = InstanceType<typeof Head>;
