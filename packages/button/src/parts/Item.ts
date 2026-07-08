import { createButtonWebComponent } from "../button-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/button.");
}

export const Item = createButtonWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
