import { createTextareaWebComponent } from "../textarea-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/textarea.");
}

export const Root = createTextareaWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
