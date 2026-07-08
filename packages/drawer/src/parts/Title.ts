import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Title");

if (!partSpec) {
  throw new Error("Missing Title part spec for @ariaui-web/drawer.");
}

export const Title = createDrawerWebComponent(partSpec);
export type TitleElement = InstanceType<typeof Title>;
