import { createAlertDialogWebComponent } from "../alert-dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Portal");

if (!partSpec) {
  throw new Error("Missing Portal part spec for @ariaui-web/alert-dialog.");
}

export const Portal = createAlertDialogWebComponent(partSpec);
export type PortalElement = InstanceType<typeof Portal>;
