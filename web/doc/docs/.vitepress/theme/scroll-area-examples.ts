import { animate } from "framer-motion/dom";

const installedPreviews = new WeakSet<HTMLElement>();
const observers = new WeakMap<Document, MutationObserver>();

function populateReleaseTags(preview: HTMLElement) {
  const list = preview.querySelector<HTMLElement>("[data-scroll-area-tags]");
  if (!list || list.children.length > 0) return;
  for (let index = 0; index < 50; index += 1) {
    const row = preview.ownerDocument.createElement("div");
    row.className = "ariaui-web-scroll-area-tag-row";
    row.textContent = `v1.2.0-beta.${50 - index}`;
    list.append(row);
  }
}

function optionElements(preview: HTMLElement) {
  return Array.from(preview.querySelectorAll<HTMLElement>('[role="option"]'));
}

function installPicker(preview: HTMLElement, motion: boolean) {
  const options = optionElements(preview);
  const viewport = preview.querySelector<HTMLElement>('[role="listbox"]');
  if (!viewport || options.length === 0) return;
  let selectedIndex = Math.min(3, options.length - 1);

  const select = (nextIndex: number) => {
    selectedIndex = Math.min(Math.max(nextIndex, 0), options.length - 1);
    options.forEach((option, index) => {
      const selected = index === selectedIndex;
      option.setAttribute("aria-selected", String(selected));
      option.dataset.selected = String(selected);
      option.querySelector<HTMLElement>("[data-selected-check]")?.toggleAttribute("hidden", !selected);
      if (motion) {
        animate(
          option,
          { x: selected ? 2 : 0, opacity: selected ? 1 : 0.76, scale: selected ? 1 : 0.985 },
          { type: "spring", stiffness: 420, damping: 32 },
        );
      }
    });
    const selected = options[selectedIndex];
    if (selected?.id) viewport.setAttribute("aria-activedescendant", selected.id);
  };

  options.forEach((option, index) => {
    option.addEventListener("click", () => select(index));
    option.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      select(index);
    });
  });

  if (motion) {
    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      select(selectedIndex + (event.key === "ArrowDown" ? 1 : -1));
    });
    const buttons = preview.querySelectorAll<HTMLElement>(
      "aria-scroll-area-scroll-up-button, aria-scroll-area-scroll-down-button",
    );
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        select(selectedIndex + (button.matches("aria-scroll-area-scroll-up-button") ? -1 : 1));
      });
    });
    const active = preview.querySelector<HTMLElement>("[data-motion-active-background]");
    if (active) animate(active, { opacity: [0, 1] }, { duration: 0.18, ease: "easeOut" });
  }

  select(selectedIndex);
}

export function syncScrollAreaExamples(ownerDocument: Document = document) {
  for (const preview of ownerDocument.querySelectorAll<HTMLElement>(
    '.ariaui-web-preview[data-component="scroll-area"]',
  )) {
    if (installedPreviews.has(preview)) continue;
    const variant = preview.dataset.exampleVariant;
    if (variant === "default") populateReleaseTags(preview);
    if (variant === "select-menu") installPicker(preview, false);
    if (variant === "framer-motion") installPicker(preview, true);
    installedPreviews.add(preview);
  }
}

export function installScrollAreaExamples(ownerDocument: Document = document) {
  syncScrollAreaExamples(ownerDocument);
  if (observers.has(ownerDocument) || typeof MutationObserver === "undefined") return;
  const observer = new MutationObserver(() => syncScrollAreaExamples(ownerDocument));
  observer.observe(ownerDocument.documentElement, { childList: true, subtree: true });
  observers.set(ownerDocument, observer);
}
