import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Body } from "./parts/Body";
import { Cell } from "./parts/Cell";
import { Head } from "./parts/Head";
import { Header } from "./parts/Header";
import { Root } from "./parts/Root";
import { Row } from "./parts/Row";

const gridPartConstructors = {
  Body,
  Cell,
  Head,
  Header,
  Root,
  Row,
} as const;

export function createGridWebComponent(part: WebComponentPartSpec) {
  const constructor = gridPartConstructors[part.name as keyof typeof gridPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/grid.");
  }

  return constructor;
}
