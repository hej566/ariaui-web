import { BreadcrumbElement } from "../breadcrumb-element";
import { getBreadcrumbPartSpec } from "./part-spec";

const partSpec = getBreadcrumbPartSpec("Root");

export class Root extends BreadcrumbElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
