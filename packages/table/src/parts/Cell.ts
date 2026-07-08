import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cell");

if (!partSpec) {
  throw new Error("Missing Cell part spec for @ariaui-web/table.");
}

export const Cell = createTableWebComponent(partSpec);
export type CellElement = InstanceType<typeof Cell>;
