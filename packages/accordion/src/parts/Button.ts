import { getAccordionPartSpec } from "./part-spec";
import { AccordionTriggerElement } from "./Trigger";

const partSpec = getAccordionPartSpec("Button");

export class Button extends AccordionTriggerElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ButtonElement = InstanceType<typeof Button>;
