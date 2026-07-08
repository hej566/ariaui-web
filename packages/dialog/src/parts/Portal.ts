import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Portal");

if (!partSpec) {
  throw new Error("Missing Portal part spec for @ariaui-web/dialog.");
}

export const Portal = createDialogWebComponent(partSpec);
export type PortalElement = InstanceType<typeof Portal>;
