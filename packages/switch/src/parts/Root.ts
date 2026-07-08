import { createSwitchWebComponent } from "../switch-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/switch.");
}

export const Root = createSwitchWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
