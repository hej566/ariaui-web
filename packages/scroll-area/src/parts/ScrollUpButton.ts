import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "ScrollUpButton");

if (!partSpec) {
  throw new Error("Missing ScrollUpButton part spec for @ariaui-web/scroll-area.");
}

export const ScrollUpButton = createScrollAreaWebComponent(partSpec);
export type ScrollUpButtonElement = InstanceType<typeof ScrollUpButton>;
