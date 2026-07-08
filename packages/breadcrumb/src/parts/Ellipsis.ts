import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Ellipsis");

if (!partSpec) {
  throw new Error("Missing Ellipsis part spec for @ariaui-web/breadcrumb.");
}

export const Ellipsis = createBreadcrumbWebComponent(partSpec);
export type EllipsisElement = InstanceType<typeof Ellipsis>;
