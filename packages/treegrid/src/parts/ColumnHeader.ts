import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "ColumnHeader");

if (!partSpec) {
  throw new Error("Missing ColumnHeader part spec for @ariaui-web/treegrid.");
}

export const ColumnHeader = createTreegridWebComponent(partSpec);
export type ColumnHeaderElement = InstanceType<typeof ColumnHeader>;
