import { createRadioWebComponent } from "../radio-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/radio.");
}

export const Item = createRadioWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
