import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Ellipsis");

if (!partSpec) {
  throw new Error("Missing Ellipsis part spec for @ariaui-web/pagination.");
}

export const Ellipsis = createPaginationWebComponent(partSpec);
export type EllipsisElement = InstanceType<typeof Ellipsis>;
