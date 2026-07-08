import { createSpinnerWebComponent } from "../spinner-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/spinner.");
}

export const Root = createSpinnerWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
