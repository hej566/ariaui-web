import { createCardWebComponent } from "../card-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Description");

if (!partSpec) {
  throw new Error("Missing Description part spec for @ariaui-web/card.");
}

export const Description = createCardWebComponent(partSpec);
export type DescriptionElement = InstanceType<typeof Description>;
