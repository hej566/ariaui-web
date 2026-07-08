import { AccordionElement } from "../accordion-element";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Item");

export class Item extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ItemElement = InstanceType<typeof Item>;
