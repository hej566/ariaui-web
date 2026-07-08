import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Description");

if (!partSpec) {
  throw new Error("Missing Description part spec for @ariaui-web/alert-dialog.");
}

export const Description = createAlertDialogWebComponent(partSpec);
export type DescriptionElement = InstanceType<typeof Description>;
