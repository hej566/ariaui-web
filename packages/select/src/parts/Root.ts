import { createSelectWebComponent } from "../select-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/select.");
}

export const Root = createSelectWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
