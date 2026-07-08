import { createCheckboxWebComponent } from "../checkbox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/checkbox.");
}

export const Item = createCheckboxWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
