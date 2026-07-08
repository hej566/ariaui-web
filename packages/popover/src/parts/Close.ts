import { createPopoverWebComponent } from "../popover-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Close");

if (!partSpec) {
  throw new Error("Missing Close part spec for @ariaui-web/popover.");
}

export const Close = createPopoverWebComponent(partSpec);
export type CloseElement = InstanceType<typeof Close>;
