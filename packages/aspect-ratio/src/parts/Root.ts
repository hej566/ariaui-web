import { createAspectRatioWebComponent } from "../aspect-ratio-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/aspect-ratio.");
}

export const Root = createAspectRatioWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
