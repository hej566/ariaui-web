import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "ScrollDownButton");

if (!partSpec) {
  throw new Error("Missing ScrollDownButton part spec for @ariaui-web/scroll-area.");
}

export const ScrollDownButton = createScrollAreaWebComponent(partSpec);
export type ScrollDownButtonElement = InstanceType<typeof ScrollDownButton>;
