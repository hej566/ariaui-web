import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Icon");

if (!partSpec) {
  throw new Error("Missing Icon part spec for @ariaui-web/alert-dialog.");
}

export const Icon = createAlertDialogWebComponent(partSpec);
export type IconElement = InstanceType<typeof Icon>;
