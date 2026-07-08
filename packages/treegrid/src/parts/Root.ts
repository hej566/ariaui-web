import { createTreegridWebComponent } from "../treegrid-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/treegrid.");
}

export const Root = createTreegridWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
