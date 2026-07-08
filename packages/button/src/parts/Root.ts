import { createButtonWebComponent } from "../button-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/button.");
}

export const Root = createButtonWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
