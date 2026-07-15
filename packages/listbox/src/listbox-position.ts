import { autoUpdate, createUpdateEffect } from "@ariaui-web/position";
import { listboxSubContent, listboxSubOffset, listboxSubTrigger } from "./listbox-dom";

const cleanups = new WeakMap<HTMLElement, () => void>();

export function cleanupListboxSubPosition(sub: HTMLElement) {
  cleanups.get(sub)?.();
  cleanups.delete(sub);
}

export function syncListboxSubPosition(sub: HTMLElement) {
  cleanupListboxSubPosition(sub);
  const trigger = listboxSubTrigger(sub);
  const content = listboxSubContent(sub);
  if (!trigger || !content || !sub.hasAttribute("open")) return;

  content.style.visibility = "hidden";
  const update = createUpdateEffect({
    reference: trigger,
    floating: content,
    placement: "right-start",
    offset: listboxSubOffset(sub),
    boundary: "viewport",
  });
  const visibleUpdate = () => {
    update();
    content.style.visibility = "visible";
  };
  visibleUpdate();
  const cleanup = autoUpdate(trigger, content, visibleUpdate, () => {
    content.style.visibility = "hidden";
  });
  if (cleanup) cleanups.set(sub, cleanup);
}
