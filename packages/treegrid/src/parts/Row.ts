import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Row");

if (!partSpec) {
  throw new Error("Missing Row part spec for @ariaui-web/treegrid.");
}

export const Row = createTreegridWebComponent(partSpec);
export type RowElement = InstanceType<typeof Row>;
