import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Body");

if (!partSpec) {
  throw new Error("Missing Body part spec for @ariaui-web/table.");
}

export const Body = createTableWebComponent(partSpec);
export type BodyElement = InstanceType<typeof Body>;
