import { BreadcrumbElement } from "../breadcrumb-element";
import { getBreadcrumbPartSpec } from "./part-spec";

const partSpec = getBreadcrumbPartSpec("Ellipsis");

export class Ellipsis extends BreadcrumbElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type EllipsisElement = InstanceType<typeof Ellipsis>;
