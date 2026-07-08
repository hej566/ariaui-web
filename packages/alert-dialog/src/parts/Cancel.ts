import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Cancel");

if (!partSpec) {
  throw new Error("Missing Cancel part spec for @ariaui-web/alert-dialog.");
}

export const Cancel = createAlertDialogWebComponent(partSpec);
export type CancelElement = InstanceType<typeof Cancel>;
