import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "RowHeader");

if (!partSpec) {
  throw new Error("Missing RowHeader part spec for @ariaui-web/treegrid.");
}

export const RowHeader = createTreegridWebComponent(partSpec);
export type RowHeaderElement = InstanceType<typeof RowHeader>;
