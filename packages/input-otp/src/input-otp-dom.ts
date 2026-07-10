export type InputOtpSyncState = {
  defaultValueApplied: boolean;
  focused: boolean;
  focusedIndex: number;
  inputListening: boolean;
  observer: MutationObserver | null;
  rootListening: boolean;
  syncing: boolean;
  value: string;
  valueAttribute: string | null;
};

const inputOtpStates = new WeakMap<HTMLElement, InputOtpSyncState>();

export const inputOtpRootSelector = "aria-input-otp, aria-input-otp-input-otp";
export const inputOtpSlotSelector = "aria-input-otp-slot, aria-input-otp-input-otpslot";

export const inputOtpForwardedInputAttributes = [
  "aria-describedby",
  "aria-label",
  "aria-labelledby",
  "name",
  "required",
] as const;

export function inputOtpState(element: HTMLElement) {
  let state = inputOtpStates.get(element);
  if (!state) {
    state = {
      defaultValueApplied: false,
      focused: false,
      focusedIndex: -1,
      inputListening: false,
      observer: null,
      rootListening: false,
      syncing: false,
      value: "",
      valueAttribute: null,
    };
    inputOtpStates.set(element, state);
  }

  return state;
}

export function inputOtpPartName(element: HTMLElement) {
  return (element.constructor as typeof HTMLElement & { partName?: string }).partName ?? "";
}

export function inputOtpCanonicalPartName(element: HTMLElement) {
  const partName = inputOtpPartName(element);

  if (partName === "InputOTP") {
    return "Root";
  }

  if (partName === "InputOTPGroup") {
    return "Group";
  }

  if (partName === "InputOTPSeparator") {
    return "Separator";
  }

  if (partName === "InputOTPSlot") {
    return "Slot";
  }

  return partName;
}

export function isInputOtpRoot(element: HTMLElement) {
  return inputOtpCanonicalPartName(element) === "Root";
}

export function isInputOtpSlot(element: HTMLElement) {
  return inputOtpCanonicalPartName(element) === "Slot";
}

export function nearestInputOtpRoot(element: Element) {
  const root = element.matches(inputOtpRootSelector)
    ? element
    : element.closest(inputOtpRootSelector);

  return root instanceof HTMLElement ? root : null;
}

export function ownedInputOtpInput(root: HTMLElement) {
  return root.querySelector("input[data-ariaui-web-input-otp='true']") as HTMLInputElement | null;
}

export function createInputOtpInput() {
  const input = document.createElement("input");
  input.dataset.ariauiWebInputOtp = "true";
  input.type = "text";
  input.inputMode = "numeric";
  input.pattern = "[0-9]*";
  input.autocomplete = "one-time-code";
  input.style.position = "absolute";
  input.style.inset = "0px";
  input.style.zIndex = "10";
  input.style.cursor = "default";
  input.style.opacity = "0";
  return input;
}

export function inputOtpSlots(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(inputOtpSlotSelector)).filter((slot) => nearestInputOtpRoot(slot) === root);
}

export function inputOtpMaxLength(root: HTMLElement) {
  const rawValue = root.getAttribute("max-length") ?? root.getAttribute("maxlength");
  const parsedValue = rawValue == null ? 0 : Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : Math.max(inputOtpSlots(root).length, 1);
}

export function inputOtpSlotIndex(slot: HTMLElement, slots: readonly HTMLElement[]) {
  const rawIndex = slot.getAttribute("index");
  if (rawIndex != null && rawIndex !== "") {
    const explicitIndex = Number.parseInt(rawIndex, 10);
    if (Number.isFinite(explicitIndex) && explicitIndex >= 0) {
      return explicitIndex;
    }
  }

  return slots.indexOf(slot);
}

export function inputOtpCompositionTarget(slot: HTMLElement) {
  if (!slot.hasAttribute("native-composition")) {
    return slot;
  }

  return slot.firstElementChild instanceof HTMLElement ? slot.firstElementChild : slot;
}
