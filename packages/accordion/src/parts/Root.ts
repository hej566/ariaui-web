import { AccordionElement } from "../accordion-element";
import { syncAccordionTreeFromRoot } from "../accordion-sync";
import { getAccordionPartSpec } from "./part-spec";

const partSpec = getAccordionPartSpec("Root");

export class Root extends AccordionElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
  #accordionSyncing = false;

  syncAccordionTreeFromRoot() {
    if (this.#accordionSyncing) {
      return;
    }

    this.#accordionSyncing = true;
    try {
      syncAccordionTreeFromRoot(this);
    } finally {
      this.#accordionSyncing = false;
    }
  }
}

export type RootElement = InstanceType<typeof Root>;
