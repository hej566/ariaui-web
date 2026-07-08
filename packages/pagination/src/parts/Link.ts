import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Link");

if (!partSpec) {
  throw new Error("Missing Link part spec for @ariaui-web/pagination.");
}

export const Link = createPaginationWebComponent(partSpec);
export type LinkElement = InstanceType<typeof Link>;
