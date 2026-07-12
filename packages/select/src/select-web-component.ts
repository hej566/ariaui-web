import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { createSelectWebComponent } from "./select-element";

export function createSelectWebComponentForPart(part: WebComponentPartSpec) {
  return createSelectWebComponent(part);
}
