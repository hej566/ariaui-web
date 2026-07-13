import { checkboxGroup, isCheckboxElement } from "./checkbox-dom";
import { checkboxValuesFromAttribute, writeCheckboxGroupValue } from "./checkbox-values";
import { syncCheckboxGroup, syncCheckboxTreeAround } from "./checkbox-sync";

export function handleCheckboxClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  if (!isCheckboxElement(element)) {
    return;
  }

  const group = checkboxGroup(element);
  if (group && element.hasAttribute("value")) {
    if (!toggleCheckboxItemInGroup(element, group, event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }

  toggleStandaloneCheckbox(element, event);
}

export function toggleCheckboxItemInGroup(item: HTMLElement, group: HTMLElement, event?: Event) {
  if (item.hasAttribute("disabled") || group.hasAttribute("disabled")) {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    syncCheckboxGroup(group);
    return false;
  }

  const itemValue = item.getAttribute("value");
  if (itemValue == null) {
    return false;
  }

  const currentValues = checkboxValuesFromAttribute(group.getAttribute("value"));
  const isChecked = currentValues.includes(itemValue);
  const nextValues = isChecked
    ? currentValues.filter((value) => value !== itemValue)
    : [...currentValues, itemValue];

  writeCheckboxGroupValue(group, nextValues);
  syncCheckboxGroup(group);
  group.dispatchEvent(new CustomEvent("valuechange", {
    bubbles: true,
    detail: {
      value: nextValues,
      values: nextValues,
    },
  }));
  return true;
}

function toggleStandaloneCheckbox(element: HTMLElement, event: Event) {
  if (element.hasAttribute("disabled")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    syncCheckboxTreeAround(element);
    return;
  }

  const previousChecked = element.hasAttribute("checked");
  const previousIndeterminate = element.hasAttribute("indeterminate");

  if (previousIndeterminate) {
    element.removeAttribute("indeterminate");
    element.setAttribute("checked", "");
  } else if (previousChecked) {
    element.removeAttribute("checked");
  } else {
    element.setAttribute("checked", "");
  }

  syncCheckboxTreeAround(element);

  const nextChecked = element.hasAttribute("checked");
  if (nextChecked !== previousChecked) {
    element.dispatchEvent(new CustomEvent("checkedchange", {
      bubbles: true,
      detail: { checked: nextChecked },
    }));
  }
}
