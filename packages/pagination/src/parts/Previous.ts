import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Previous");

if (!partSpec) {
  throw new Error("Missing Previous part spec for @ariaui-web/pagination.");
}

export const Previous = createPaginationWebComponent(partSpec);
export type PreviousElement = InstanceType<typeof Previous>;
