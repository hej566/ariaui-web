import { createGridWebComponent } from "../grid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/grid.");
}

export const Root = createGridWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
