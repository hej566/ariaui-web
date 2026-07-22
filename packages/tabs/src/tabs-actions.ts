import {
  tabsNativeTarget,
  tabsPartName,
  tabsRoot,
  tabsTriggerDisabled,
  tabsTriggers,
} from "./tabs-dom";
import { syncTabsRoot, tabsRootIsControlled } from "./tabs-sync";

function dispatchValueChange(root: HTMLElement, value: string) {
  root.dispatchEvent(new CustomEvent("valuechange", { bubbles: true, detail: { value } }));
}

export function selectTabsTrigger(trigger: HTMLElement, event?: Event, focus = false) {
  const root = tabsRoot(trigger);
  if (!root || tabsTriggerDisabled(trigger, root)) {
    event?.preventDefault();
    event?.stopPropagation();
    return false;
  }
  const value = trigger.getAttribute("value");
  if (value == null) return false;
  event?.preventDefault();
  event?.stopPropagation();
  if (!tabsRootIsControlled(root)) root.setAttribute("value", value);
  syncTabsRoot(root);
  if (focus) tabsNativeTarget(trigger).focus();
  dispatchValueChange(root, value);
  return true;
}

export function handleTabsClick(element: HTMLElement, event: Event) {
  if (tabsPartName(element) !== "Trigger" || event.defaultPrevented) return;
  const target = event.target;
  if (target instanceof Element && target.closest("aria-tabs-trigger") !== element) return;
  selectTabsTrigger(element, event);
}

export function handleTabsKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (tabsPartName(element) !== "Trigger" || event.defaultPrevented) return false;
  const root = tabsRoot(element);
  if (!root || tabsTriggerDisabled(element, root)) return false;
  const orientation = root.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
  const enabled = tabsTriggers(root).filter((trigger) => !tabsTriggerDisabled(trigger, root));
  const index = enabled.indexOf(element);
  if (index < 0 || enabled.length === 0) return false;

  let target: HTMLElement | undefined;
  if (event.key === "Home") target = enabled[0];
  else if (event.key === "End") target = enabled.at(-1);
  else if ((orientation === "horizontal" && event.key === "ArrowRight") || (orientation === "vertical" && event.key === "ArrowDown")) {
    target = enabled[(index + 1) % enabled.length];
  } else if ((orientation === "horizontal" && event.key === "ArrowLeft") || (orientation === "vertical" && event.key === "ArrowUp")) {
    target = enabled[(index - 1 + enabled.length) % enabled.length];
  } else if ((event.key === "Enter" || event.key === " " || event.key === "Spacebar") && tabsNativeTarget(element) === element) {
    return selectTabsTrigger(element, event, true);
  } else {
    return false;
  }

  if (!target) return false;
  event.preventDefault();
  event.stopPropagation();
  selectTabsTrigger(target, undefined, true);
  return true;
}
