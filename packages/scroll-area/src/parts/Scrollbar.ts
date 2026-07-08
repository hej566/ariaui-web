import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Scrollbar");

if (!partSpec) {
  throw new Error("Missing Scrollbar part spec for @ariaui-web/scroll-area.");
}

export const Scrollbar = createScrollAreaWebComponent(partSpec);
export type ScrollbarElement = InstanceType<typeof Scrollbar>;
