import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Action } from "./parts/Action";
import { Cancel } from "./parts/Cancel";
import { Close } from "./parts/Close";
import { Description } from "./parts/Description";
import { Title } from "./parts/Title";

const definitions = [
  ["aria-alert", Root],
  ["aria-alert-action", Action],
  ["aria-alert-cancel", Cancel],
  ["aria-alert-close", Close],
  ["aria-alert-description", Description],
  ["aria-alert-title", Title],
] as const;

export function defineAlertElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
