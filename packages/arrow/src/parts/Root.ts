import { createArrowWebComponent } from "../arrow-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/arrow.");
}

export const Root = createArrowWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
