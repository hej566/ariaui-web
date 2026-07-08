import { createPaginationWebComponent } from "../pagination-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Pages");

if (!partSpec) {
  throw new Error("Missing Pages part spec for @ariaui-web/pagination.");
}

export const Pages = createPaginationWebComponent(partSpec);
export type PagesElement = InstanceType<typeof Pages>;
