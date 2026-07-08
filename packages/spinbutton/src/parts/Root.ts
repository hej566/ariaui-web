import { createSpinbuttonWebComponent } from "../spinbutton-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/spinbutton.");
}

export const Root = createSpinbuttonWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
