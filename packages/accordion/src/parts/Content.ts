import { AccordionElement } from "../accordion-element";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Content");

export class AccordionContentElement extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export class Content extends AccordionContentElement {}

export type ContentElement = InstanceType<typeof Content>;
