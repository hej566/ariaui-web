let idCounter = 0;

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function createId(prefix = "ariaui-web") {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function useId(prefix?: string) {
  return createId(prefix);
}

export function createControllableState<T>(options: ControllableStateOptions<T>) {
  let internalValue = options.defaultValue;
  return {
    get value() {
      return options.value ?? internalValue;
    },
    setValue(nextValue: T) {
      internalValue = nextValue;
      options.onChange?.(nextValue);
    },
  };
}

export const useControllableState = createControllableState;

export function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T | undefined) {
  return (...args: Parameters<T>) => callback?.(...args);
}

export function useMergeRefs<T>(...refs: Array<((value: T) => void) | { current: T | null } | null | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) ref.current = value;
    }
  };
}

export { componentSpec } from "./component-spec";
