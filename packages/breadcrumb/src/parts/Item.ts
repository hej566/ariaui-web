import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Item");

if (!partSpec) {
  throw new Error("Missing Item part spec for @ariaui-web/breadcrumb.");
}

export const Item = createBreadcrumbWebComponent(partSpec);
export type ItemElement = InstanceType<typeof Item>;
