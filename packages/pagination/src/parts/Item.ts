import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/pagination.");
}

export const Item = createPaginationWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
