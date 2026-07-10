import { KbdElement } from "../kbd-element";
import { getKbdPartSpec } from "./part-spec";

const partSpec = getKbdPartSpec("Root");

export class Root extends KbdElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
