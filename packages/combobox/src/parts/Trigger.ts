import { createComboboxWebComponent } from "../combobox-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Trigger");

if (!partSpec) {
  throw new Error("Missing Trigger part spec for @ariaui-web/combobox.");
}

export const Trigger = createComboboxWebComponent(partSpec);
export type TriggerElement = InstanceType<typeof Trigger>;
