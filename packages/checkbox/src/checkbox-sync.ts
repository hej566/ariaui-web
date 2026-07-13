import { checkboxGroup, checkboxIndicatorOwner, checkboxIndicators, checkboxItems, checkboxPartName, isCheckboxElement, isCheckboxGroupElement, isCheckboxIndicatorElement } from "./checkbox-dom";
import { checkboxValuesFromAttribute, writeCheckboxGroupValue } from "./checkbox-values";

const syncingCheckboxGroups = new WeakSet<HTMLElement>();
const defaultValueAppliedGroups = new WeakSet<HTMLElement>();
const inheritedDisabledAttribute = "data-ariaui-web-inherited-disabled";
const inheritedInputAttribute = "data-ariaui-web-inherited-input";
const checkboxStateReflectionAttributes = [
  "aria-expanded",
  "aria-pressed",
  "aria-selected",
] as const;

export function syncCheckboxTreeAround(element: HTMLElement) {
  installCheckboxLabelActivation(element.ownerDocument);

  if (isCheckboxIndicatorElement(element)) {
    syncCheckboxIndicator(element);
    return;
  }

  if (isCheckboxGroupElement(element)) {
    syncCheckboxGroup(element);
    return;
  }

  if (isCheckboxElement(element)) {
    const checkbox = element as HTMLElement;
    const group = checkboxGroup(checkbox);
    if (group && checkbox.hasAttribute("value")) {
      syncCheckboxGroup(group);
    } else {
      syncStandaloneCheckbox(checkbox);
    }
  }
}

export function syncCheckboxGroup(group: HTMLElement) {
  if (syncingCheckboxGroups.has(group)) {
    return;
  }

  syncingCheckboxGroups.add(group);
  try {
    if (!defaultValueAppliedGroups.has(group)) {
      if (!group.hasAttribute("value")) {
        const defaultValue = group.getAttribute("default-value") ?? group.getAttribute("defaultvalue");
        if (defaultValue != null) {
          writeCheckboxGroupValue(group, checkboxValuesFromAttribute(defaultValue));
        }
      }
      defaultValueAppliedGroups.add(group);
    }

    const values = checkboxValuesFromAttribute(group.getAttribute("value"));
    const valueSet = new Set(values);
    const groupDisabled = group.hasAttribute("disabled");
    const groupName = group.getAttribute("name");
    const groupRequired = group.hasAttribute("required");

    if (groupDisabled) {
      group.setAttribute("data-disabled", "");
    } else {
      group.removeAttribute("data-disabled");
    }
    group.removeAttribute("aria-disabled");

    for (const item of checkboxItems(group)) {
      if (!item.hasAttribute("value")) {
        syncStandaloneCheckbox(item);
        continue;
      }

      const itemValue = item.getAttribute("value") ?? "";
      const checked = valueSet.has(itemValue);
      const itemOwnDisabled = item.hasAttribute("disabled") && !item.hasAttribute(inheritedDisabledAttribute);
      const effectiveDisabled = groupDisabled || itemOwnDisabled;
      const effectiveName = item.getAttribute("name") ?? groupName;
      const effectiveRequired = item.hasAttribute("required") || (!item.hasAttribute("name") && groupRequired);

      setCheckboxInheritedDisabled(item, groupDisabled);
      setCheckboxCheckedAttribute(item, checked);
      syncCheckboxHost(item, effectiveDisabled);
      syncCheckboxHiddenInput(item, effectiveName, effectiveRequired);
      syncCheckboxIndicators(item);
    }
  } finally {
    syncingCheckboxGroups.delete(group);
  }
}

export function syncStandaloneCheckbox(element: HTMLElement) {
  const disabled = element.hasAttribute("disabled");

  if (checkboxPartName(element) === "Group") {
    return;
  }

  syncCheckboxHost(element, disabled);
  syncCheckboxIndicators(element);
}

export function syncCheckboxIndicators(owner: HTMLElement) {
  for (const indicator of checkboxIndicators(owner)) {
    syncCheckboxIndicator(indicator);
  }
}

export function syncCheckboxIndicator(indicator: HTMLElement) {
  const owner = checkboxIndicatorOwner(indicator);
  const state = owner?.getAttribute("data-state") ?? "unchecked";

  indicator.setAttribute("data-state", state);
  indicator.hidden = state === "unchecked" && !indicator.hasAttribute("force-mount");
}

export function syncCheckboxHost(element: HTMLElement, disabled: boolean) {
  const checked = element.hasAttribute("checked");
  const indeterminate = element.hasAttribute("indeterminate");
  const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";

  element.setAttribute("aria-checked", indeterminate ? "mixed" : String(checked));
  element.setAttribute("data-state", state);

  if (disabled) {
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("data-disabled", "");
    element.setAttribute("tabindex", "-1");
  } else {
    element.removeAttribute("aria-disabled");
    element.removeAttribute("data-disabled");
    if (!element.hasAttribute("tabindex") || element.getAttribute("tabindex") === "-1") {
      element.setAttribute("tabindex", "0");
    }
  }

  for (const attribute of checkboxStateReflectionAttributes) {
    element.removeAttribute(attribute);
  }
}

function setCheckboxCheckedAttribute(element: HTMLElement, checked: boolean) {
  if (checked) {
    element.setAttribute("checked", "");
  } else {
    element.removeAttribute("checked");
  }
}

function setCheckboxInheritedDisabled(element: HTMLElement, disabled: boolean) {
  if (disabled) {
    if (!element.hasAttribute("disabled")) {
      element.setAttribute(inheritedDisabledAttribute, "");
    }
    element.setAttribute("disabled", "");
    return;
  }

  if (element.hasAttribute(inheritedDisabledAttribute)) {
    element.removeAttribute("disabled");
    element.removeAttribute(inheritedDisabledAttribute);
  }
}

function syncCheckboxHiddenInput(element: HTMLElement, name: string | null, required: boolean) {
  const existing = element.querySelector<HTMLInputElement>("input[data-ariaui-web-hidden-input='true']");

  if (!name) {
    if (existing?.hasAttribute(inheritedInputAttribute)) {
      existing.remove();
    }
    return;
  }

  const input = existing instanceof HTMLInputElement ? existing : document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = element.hasAttribute("value") ? element.getAttribute("value") ?? "" : String(element.hasAttribute("checked"));
  input.required = required;
  input.disabled = false;
  input.dataset.ariauiWebHiddenInput = "true";

  if (!element.hasAttribute("name")) {
    input.setAttribute(inheritedInputAttribute, "");
  } else {
    input.removeAttribute(inheritedInputAttribute);
  }

  if (!existing) {
    element.append(input);
  }
}

const checkboxLabelDocuments = new WeakSet<Document>();

function installCheckboxLabelActivation(ownerDocument: Document) {
  if (checkboxLabelDocuments.has(ownerDocument)) {
    return;
  }

  ownerDocument.addEventListener("click", (event) => {
    if (event.defaultPrevented) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const label = target.closest("label[for]");
    const controlId = label instanceof HTMLLabelElement ? label.htmlFor : "";
    if (!label || !controlId) {
      return;
    }

    const control = ownerDocument.getElementById(controlId);
    if (!isCheckboxElement(control) || label.contains(control)) {
      return;
    }

    control.click();
  });
  checkboxLabelDocuments.add(ownerDocument);
}
