import { createScrollAreaWebComponent } from "../scroll-area-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/scroll-area.");
}

export const Root = createScrollAreaWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
