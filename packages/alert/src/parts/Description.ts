import { createAlertWebComponent } from "../alert-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Description");

if (!partSpec) {
  throw new Error("Missing Description part spec for @ariaui-web/alert.");
}

export const Description = createAlertWebComponent(partSpec);
export type DescriptionElement = InstanceType<typeof Description>;
