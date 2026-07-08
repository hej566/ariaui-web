import { defineCustomElement } from "@ariaui-web/utils";
import { Slot } from "./parts/Slot";

const definitions = [
  ["aria-slot-slot", Slot],
] as const;

export function defineSlotElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
