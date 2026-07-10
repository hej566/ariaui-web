import { buttonIsDisabled } from "./button-dom";

function isSpaceKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Spacebar";
}

function isButtonLikeRole(role: string | null) {
  return role === "button" || role === "link";
}

export function handleButtonClick(element: HTMLElement, event: Event) {
  if (event.defaultPrevented) {
    return;
  }

  if (buttonIsDisabled(element)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (element.hasAttribute("pressed")) {
    element.toggleAttribute("pressed", !element.hasAttribute("pressed"));
  }
}

export function handleButtonKeyDown(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const role = element.getAttribute("role");
  if (!isButtonLikeRole(role)) {
    return;
  }

  if (buttonIsDisabled(element)) {
    event.preventDefault();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    element.click();
    return;
  }

  if (role === "button" && isSpaceKey(event)) {
    event.preventDefault();
  }
}

export function handleButtonKeyUp(element: HTMLElement, event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  if (element.getAttribute("role") !== "button") {
    return;
  }

  if (buttonIsDisabled(element)) {
    event.preventDefault();
    return;
  }

  if (isSpaceKey(event)) {
    event.preventDefault();
    element.click();
  }
}
