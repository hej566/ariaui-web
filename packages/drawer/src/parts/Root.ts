import { createDrawerWebComponent } from "../drawer-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/drawer.");
}

export const Root = createDrawerWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
