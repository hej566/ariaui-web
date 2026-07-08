import { defineCustomElement } from "@ariaui-web/utils";
import { Root } from "./parts/Root";
import { Calendar } from "./parts/Calendar";
import { Content } from "./parts/Content";
import { Input } from "./parts/Input";
import { Label } from "./parts/Label";
import { Trigger } from "./parts/Trigger";

const definitions = [
  ["aria-datepicker", Root],
  ["aria-datepicker-calendar", Calendar],
  ["aria-datepicker-content", Content],
  ["aria-datepicker-input", Input],
  ["aria-datepicker-label", Label],
  ["aria-datepicker-trigger", Trigger],
] as const;

export function defineDatepickerElements() {
  for (const [tagName, element] of definitions) {
    defineCustomElement(tagName, element);
  }
}
