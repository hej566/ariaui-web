import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Description");

if (!partSpec) {
  throw new Error("Missing Description part spec for @ariaui-web/dialog.");
}

export const Description = createDialogWebComponent(partSpec);
export type DescriptionElement = InstanceType<typeof Description>;
