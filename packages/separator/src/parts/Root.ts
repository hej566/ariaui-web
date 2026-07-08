import { createSeparatorWebComponent } from "../separator-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/separator.");
}

export const Root = createSeparatorWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
