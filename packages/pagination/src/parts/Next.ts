import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Next");

if (!partSpec) {
  throw new Error("Missing Next part spec for @ariaui-web/pagination.");
}

export const Next = createPaginationWebComponent(partSpec);
export type NextElement = InstanceType<typeof Next>;
