import { createDisclosureWebComponent } from "../disclosure-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/disclosure.");
}

export const Root = createDisclosureWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
