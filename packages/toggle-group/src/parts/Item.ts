import { createToggleGroupWebComponent } from "../toggle-group-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/toggle-group.");
}

export const Item = createToggleGroupWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
