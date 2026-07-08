import { createTableWebComponent } from "../table-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Row");

if (!partSpec) {
  throw new Error("Missing Row part spec for @ariaui-web/table.");
}

export const Row = createTableWebComponent(partSpec);
export type RowElement = InstanceType<typeof Row>;
