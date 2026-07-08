import { AccordionElement } from "../accordion-element";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Header");

export class Header extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type HeaderElement = InstanceType<typeof Header>;
