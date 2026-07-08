import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/pagination.");
}

export const Content = createPaginationWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
