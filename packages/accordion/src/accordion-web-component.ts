import type { WebComponentPartSpec } from "@ariaui-web/utils";
import { Button } from "./parts/Button";
import { Content } from "./parts/Content";
import { Header } from "./parts/Header";
import { Item } from "./parts/Item";
import { Panel } from "./parts/Panel";
import { Root } from "./parts/Root";
import { Trigger } from "./parts/Trigger";

const accordionPartConstructors = {
  Button,
  Content,
  Header,
  Item,
  Panel,
  Root,
  Trigger,
} as const;

export function createAccordionWebComponent(part: WebComponentPartSpec) {
  const constructor = accordionPartConstructors[part.name as keyof typeof accordionPartConstructors];
  if (!constructor) {
    throw new Error("Missing " + part.name + " part class for @ariaui-web/accordion.");
  }

  return constructor;
}
