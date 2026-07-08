import { createPopoverWebComponent } from "../popover-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Description");

if (!partSpec) {
  throw new Error("Missing Description part spec for @ariaui-web/popover.");
}

export const Description = createPopoverWebComponent(partSpec);
export type DescriptionElement = InstanceType<typeof Description>;
