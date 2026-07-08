import { createDialogWebComponent } from "../dialog-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Root");

if (!partSpec) {
  throw new Error("Missing Root part spec for @ariaui-web/dialog.");
}

export const Root = createDialogWebComponent(partSpec);
export type RootElement = InstanceType<typeof Root>;
