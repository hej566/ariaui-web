import { createInputWebComponent } from "../input-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/input.");
}

export const Root = createInputWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
