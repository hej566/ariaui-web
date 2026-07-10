import { PortalElement } from "../portal-element";
import { getPortalPartSpec } from "./part-spec";

const partSpec = getPortalPartSpec("Root");

export class Root extends PortalElement {
  static override partName = partSpec.name;
  static override defaultRole = partSpec.defaultRole;
  static override defaultAttributes = partSpec.defaultAttributes;
}

export type RootElement = InstanceType<typeof Root>;
