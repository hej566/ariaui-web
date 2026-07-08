import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Body");

if (!partSpec) {
  throw new Error("Missing Body part spec for @ariaui-web/treegrid.");
}

export const Body = createTreegridWebComponent(partSpec);
export type BodyElement = InstanceType<typeof Body>;
