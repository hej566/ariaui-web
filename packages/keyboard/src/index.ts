export type Direction = "horizontal" | "vertical";

export function getDirectionKeys(direction: Direction) {
  return direction === "horizontal"
    ? { next: "ArrowRight", previous: "ArrowLeft" }
    : { next: "ArrowDown", previous: "ArrowUp" };
}

export function getNextIndex(currentIndex: number, itemCount: number) {
  if (itemCount <= 0) return -1;
  return (currentIndex + 1 + itemCount) % itemCount;
}

export function getPrevIndex(currentIndex: number, itemCount: number) {
  if (itemCount <= 0) return -1;
  return (currentIndex - 1 + itemCount) % itemCount;
}

export function isPrintableTypeaheadKey(key: string) {
  return key.length === 1 && !/\s/.test(key);
}

export function isAlphanumericTypeaheadKey(key: string) {
  return /^[a-z0-9]$/i.test(key);
}

export { componentSpec } from "./component-spec";
