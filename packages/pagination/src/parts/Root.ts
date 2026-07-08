import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/pagination.");
}

export const Root = createPaginationWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
