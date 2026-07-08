import { createGridWebComponent } from "../grid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Row");

if (!partSpec) {
  throw new Error("Missing Row part spec for @ariaui-web/grid.");
}

export const Row = createGridWebComponent(partSpec);
export type RowElement = InstanceType<typeof Row>;
