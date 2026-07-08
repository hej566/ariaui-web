import { createLabelWebComponent } from "../label-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/label.");
}

export const Root = createLabelWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
