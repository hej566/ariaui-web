import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "RowHeader");

if (!partSpec) {
  throw new Error("Missing RowHeader part spec for @ariaui-web/table.");
}

export const RowHeader = createTableWebComponent(partSpec);
export type RowHeaderElement = InstanceType<typeof RowHeader>;
