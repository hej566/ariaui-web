import { BreadcrumbElement } from "../breadcrumb-element";
import { getBreadcrumbPartSpec } from "./part-spec";

const partSpec = getBreadcrumbPartSpec("Link");

export class Link extends BreadcrumbElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type LinkElement = InstanceType<typeof Link>;
