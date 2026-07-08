import { createPopoverWebComponent } from "../popover-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Heading");

if (!partSpec) {
  throw new Error("Missing Heading part spec for @ariaui-web/popover.");
}

export const Heading = createPopoverWebComponent(partSpec);
export type HeadingElement = InstanceType<typeof Heading>;
