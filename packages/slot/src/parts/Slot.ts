import { createSlotWebComponent } from "../slot-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Slot");

if (!partSpec) {
  throw new Error("Missing Slot part spec for @ariaui-web/slot.");
}

export const Slot = createSlotWebComponent(partSpec);
export type SlotElement = InstanceType<typeof Slot>;
