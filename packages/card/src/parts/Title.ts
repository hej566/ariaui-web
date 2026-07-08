import { createCardWebComponent } from "../card-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Title");

if (!partSpec) {
  throw new Error("Missing Title part spec for @ariaui-web/card.");
}

export const Title = createCardWebComponent(partSpec);
export type TitleElement = InstanceType<typeof Title>;
