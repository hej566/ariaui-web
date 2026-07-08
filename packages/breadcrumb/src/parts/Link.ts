import { createBreadcrumbWebComponent } from "../breadcrumb-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Link");

if (!partSpec) {
  throw new Error("Missing Link part spec for @ariaui-web/breadcrumb.");
}

export const Link = createBreadcrumbWebComponent(partSpec);
export type LinkElement = InstanceType<typeof Link>;
