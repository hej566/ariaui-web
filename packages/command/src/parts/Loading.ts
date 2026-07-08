import { createCommandWebComponent } from "../command-element";
import { componentSpec } from "../component-spec";

const partSpec = componentSpec.parts.find((candidate) => candidate.name === "Loading");

if (!partSpec) {
  throw new Error("Missing Loading part spec for @ariaui-web/command.");
}

export const Loading = createCommandWebComponent(partSpec);
export type LoadingElement = InstanceType<typeof Loading>;
