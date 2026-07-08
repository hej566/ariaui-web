import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cell");

if (!partSpec) {
  throw new Error("Missing Cell part spec for @ariaui-web/treegrid.");
}

export const Cell = createTreegridWebComponent(partSpec);
export type CellElement = InstanceType<typeof Cell>;
