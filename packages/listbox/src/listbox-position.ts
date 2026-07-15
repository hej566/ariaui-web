import { autoUpdate, createUpdateEffect } from "@ariaui-web/position";
import { listboxSubContent, listboxSubOffset, listboxSubTrigger } from "./listbox-dom";

const cleanups = new WeakMap<HTMLElement, () => void>();
const viewportPadding = 8;
const clippingOverflow = /(auto|clip|hidden|scroll)/;

function listboxSubContentBounds(content: HTMLElement) {
  const doc = content.ownerDocument;
  const win = doc.defaultView;
  const width = doc.documentElement.clientWidth || win?.innerWidth || 0;
  const height = doc.documentElement.clientHeight || win?.innerHeight || 0;
  const bounds = { left: 0, top: 0, right: width, bottom: height };

  for (let ancestor = content.parentElement; ancestor; ancestor = ancestor.parentElement) {
    const style = win?.getComputedStyle(ancestor);
    if (!style) continue;
    const rect = ancestor.getBoundingClientRect();

    if (clippingOverflow.test(`${style.overflow} ${style.overflowX}`) && rect.right > rect.left) {
      bounds.left = Math.max(bounds.left, rect.left);
      bounds.right = Math.min(bounds.right, rect.right);
    }
    if (clippingOverflow.test(`${style.overflow} ${style.overflowY}`) && rect.bottom > rect.top) {
      bounds.top = Math.max(bounds.top, rect.top);
      bounds.bottom = Math.min(bounds.bottom, rect.bottom);
    }
  }

  return bounds;
}

function clampListboxSubContentToBounds(content: HTMLElement) {
  const rect = content.getBoundingClientRect();
  const bounds = listboxSubContentBounds(content);
  let left = Number.parseFloat(content.style.left) || 0;
  let top = Number.parseFloat(content.style.top) || 0;

  if (rect.left < bounds.left + viewportPadding) {
    left += bounds.left + viewportPadding - rect.left;
  } else if (rect.right > bounds.right - viewportPadding) {
    left -= rect.right - (bounds.right - viewportPadding);
  }

  if (rect.top < bounds.top + viewportPadding) {
    top += bounds.top + viewportPadding - rect.top;
  } else if (rect.bottom > bounds.bottom - viewportPadding) {
    top -= rect.bottom - (bounds.bottom - viewportPadding);
  }

  content.style.left = `${left}px`;
  content.style.top = `${top}px`;
}

function listboxSubPositionGeometry(trigger: HTMLElement, content: HTMLElement) {
  const triggerRect = trigger.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  const offsetParentRect = content.offsetParent?.getBoundingClientRect();
  const bounds = listboxSubContentBounds(content);
  return [
    triggerRect.left,
    triggerRect.top,
    triggerRect.width,
    triggerRect.height,
    contentRect.width,
    contentRect.height,
    offsetParentRect?.left ?? 0,
    offsetParentRect?.top ?? 0,
    bounds.left,
    bounds.top,
    bounds.right,
    bounds.bottom,
  ].join(":");
}

export function cleanupListboxSubPosition(sub: HTMLElement) {
  cleanups.get(sub)?.();
  cleanups.delete(sub);
}

export function syncListboxSubPosition(sub: HTMLElement) {
  cleanupListboxSubPosition(sub);
  const trigger = listboxSubTrigger(sub);
  const content = listboxSubContent(sub);
  if (!trigger || !content || !sub.hasAttribute("open")) return;

  if (content.style.visibility !== "hidden") content.style.visibility = "hidden";
  let geometry = "";
  const update = createUpdateEffect({
    reference: trigger,
    floating: content,
    placement: "right-start",
    offset: listboxSubOffset(sub),
    boundary: "viewport",
  });
  const visibleUpdate = () => {
    const nextGeometry = listboxSubPositionGeometry(trigger, content);
    if (nextGeometry === geometry) {
      if (content.style.visibility !== "visible") content.style.visibility = "visible";
      return;
    }
    geometry = nextGeometry;
    update();
    clampListboxSubContentToBounds(content);
    if (content.style.visibility !== "visible") content.style.visibility = "visible";
  };
  visibleUpdate();
  const cleanup = autoUpdate(trigger, content, visibleUpdate, () => {
    content.style.visibility = "hidden";
  });
  if (cleanup) cleanups.set(sub, cleanup);
}
