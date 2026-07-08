import { createGridWebComponent } from "../grid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Body");

if (!partSpec) {
  throw new Error("Missing Body part spec for @ariaui-web/grid.");
}

export const Body = createGridWebComponent(partSpec);
export type BodyElement = InstanceType<typeof Body>;
