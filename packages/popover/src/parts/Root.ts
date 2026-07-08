import { createPopoverWebComponent } from "../popover-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/popover.");
}

export const Root = createPopoverWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
