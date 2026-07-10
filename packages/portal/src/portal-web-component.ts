import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Root } from "./parts/Root";

const portalPartConstructors = {
  Root,
} as const;

export function createPortalWebComponent(part: WebComponentPartSpec) {
  const constructor = portalPartConstructors[part.name as keyof typeof portalPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/portal.");
  }

  return constructor;
}
