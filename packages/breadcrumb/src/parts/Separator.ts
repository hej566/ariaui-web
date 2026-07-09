import { BreadcrumbElement } from "../breadcrumb-element";
import { getBreadcrumbPartSpec } from "./part-spec";

const partSpec = getBreadcrumbPartSpec("Separator");

export class Separator extends BreadcrumbElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type SeparatorElement = InstanceType<typeof Separator>;
