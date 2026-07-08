import { BadgeElement } from "../badge-element";
import { getBadgePartSpec } from "./part-spec";

const partSpec = getBadgePartSpec("Root");

export class Root extends BadgeElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
