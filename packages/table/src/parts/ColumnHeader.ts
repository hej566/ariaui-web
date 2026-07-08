import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "ColumnHeader");

if (!partSpec) {
  throw new Error("Missing ColumnHeader part spec for @ariaui-web/table.");
}

export const ColumnHeader = createTableWebComponent(partSpec);
export type ColumnHeaderElement = InstanceType<typeof ColumnHeader>;
