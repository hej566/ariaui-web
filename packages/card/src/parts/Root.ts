import { createCardWebComponent } from "../card-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/card.");
}

export const Root = createCardWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
