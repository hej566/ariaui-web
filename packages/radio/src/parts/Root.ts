import { createRadioWebComponent } from "../radio-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/radio.");
}

export const Root = createRadioWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
