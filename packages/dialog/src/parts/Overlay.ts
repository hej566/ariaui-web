import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Overlay");

if (!partSpec) {
  throw new Error("Missing Overlay part spec for @ariaui-web/dialog.");
}

export const Overlay = createDialogWebComponent(partSpec);
export type OverlayElement = InstanceType<typeof Overlay>;
