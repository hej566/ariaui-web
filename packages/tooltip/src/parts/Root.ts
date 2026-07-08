import { createTooltipWebComponent } from "../tooltip-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/tooltip.");
}

export const Root = createTooltipWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
