import {
  isRadioItem,
  radioItemDisabled,
  radioItems,
  radioRoot,
} from "./radio-dom";
import { radioRootIsControlled, syncRadioRoot } from "./radio-sync";

function dispatchValueChange(root: HTMLElement, value: string) {
  root.dispatchEvent(
    new CustomEvent("valuechange", {
      bubbles: true,
      detail: { value },
    }),
  );
}

export function selectRadioItem(item: HTMLElement, event?: Event) {
  const root = radioRoot(item);
  if (!root || radioItemDisabled(item, root)) {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    return false;
  }

  const value = item.getAttribute("value");
  if (value == null) return false;
  if (!radioRootIsControlled(root)) root.setAttribute("value", value);
  syncRadioRoot(root);
  item.focus();
  dispatchValueChange(root, value);
  return true;
}

export function handleRadioClick(element: HTMLElement, event: Event) {
  if (!isRadioItem(element)) return;
  selectRadioItem(element, event);
}

export function handleRadioKeyDown(item: HTMLElement, event: KeyboardEvent) {
  if (
    !isRadioItem(item) ||
    !["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"].includes(event.key)
  ) {
    return false;
  }
  const root = radioRoot(item);
  if (!root || radioItemDisabled(item, root)) return false;
  const enabled = radioItems(root).filter(
    (candidate) => !radioItemDisabled(candidate, root),
  );
  const index = enabled.indexOf(item);
  if (index === -1 || enabled.length === 0) return false;
  event.preventDefault();
  const direction =
    event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
  const target = enabled[(index + direction + enabled.length) % enabled.length];
  if (target) selectRadioItem(target);
  return true;
}
