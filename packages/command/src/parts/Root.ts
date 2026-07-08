import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/command.");
}

export const Root = createCommandWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
