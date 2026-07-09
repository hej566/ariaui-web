import { BreadcrumbElement } from "../breadcrumb-element";
import { getBreadcrumbPartSpec } from "./part-spec";

const partSpec = getBreadcrumbPartSpec("Item");

export class Item extends BreadcrumbElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type ItemElement = InstanceType<typeof Item>;
