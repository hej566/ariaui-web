import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Close } from "./parts/Close";
import { Content } from "./parts/Content";
import { Description } from "./parts/Description";
import { Heading } from "./parts/Heading";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-popover", Root],
  ["aria-popover-close", Close],
  ["aria-popover-content", Content],
  ["aria-popover-description", Description],
  ["aria-popover-heading", Heading],
  ["aria-popover-trigger", Trigger],
] as const;

export function definePopoverElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
