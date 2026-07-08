import { AccordionContentElement } from "./Content";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Panel");

export class Panel extends AccordionContentElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type PanelElement = InstanceType<typeof Panel>;
