import { createGridWebComponent } from "../grid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cell");

if (!partSpec) {
  throw new Error("Missing Cell part spec for @ariaui-web/grid.");
}

export const Cell = createGridWebComponent(partSpec);
export type CellElement = InstanceType<typeof Cell>;
