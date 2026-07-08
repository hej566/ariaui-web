import { createTooltipWebComponent } from "../tooltip-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Content");

if (!partSpec) {
  throw new Error("Missing Content part spec for @ariaui-web/tooltip.");
}

export const Content = createTooltipWebComponent(partSpec);
export type ContentElement = InstanceType<typeof Content>;
