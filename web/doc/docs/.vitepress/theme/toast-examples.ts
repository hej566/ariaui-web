import { createToast } from "@ariaui-web/toast";

type PositionId = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

const installedDocuments = new WeakSet<Document>();
const activePosition = new WeakMap<HTMLElement, PositionId>();
const dismissers = new WeakMap<HTMLElement, Array<() => void>>();

const itemBaseClass = "ariaui-web-toast-item group pointer-events-auto relative flex h-[90px] box-border w-full items-center gap-2 overflow-hidden rounded-(--border-radius-lg) border border-border bg-popover p-4 pr-10 text-popover-foreground shadow-(--shadow-md) z-[var(--toast-z-index)] [--toast-y:0px] transform-gpu translate-y-[var(--toast-y)] transition-[transform,translate,scale,opacity] duration-300 ease-out data-[expanded=false]:col-start-1 data-[expanded=false]:row-start-1 data-[expanded=false]:data-[exiting=false]:scale-[var(--toast-scale)] data-[exiting=true]:scale-[var(--toast-exit-scale)] data-[exit-phase=fade]:opacity-0";

function itemTemplate(label: string, edge: "top" | "bottom") {
  const item = document.createElement("aria-toast-item");
  item.className = `${itemBaseClass} ${edge === "top" ? "origin-top data-[expanded=false]:data-[mounted=true]:[--toast-y:var(--toast-offset-down)] data-[mounted=false]:[--toast-y:-100vh]" : "origin-bottom data-[expanded=false]:data-[mounted=true]:[--toast-y:var(--toast-offset-up)] data-[mounted=false]:[--toast-y:100vh]"}`;
  item.innerHTML = `
    <div class="ariaui-web-toast-copy grid min-w-0 flex-1 gap-0.5">
      <h3 class="text-sm leading-5 font-medium text-popover-foreground">${label} toast</h3>
      <p class="text-sm leading-5 font-normal text-muted-foreground">The mounted list moves notifications in from the ${edge}.</p>
    </div>
    <aria-toast-close class="ariaui-web-toast-close absolute right-2 top-2 rounded-md p-1 text-icon hover:text-icon" aria-label="Dismiss notification">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"></path></svg>
    </aria-toast-close>`;
  return item;
}

function clearCurrentToasts(list: HTMLElement) {
  for (const dismiss of dismissers.get(list) ?? []) dismiss();
  dismissers.set(list, []);
}

function openToast(document: Document, button: HTMLElement) {
  const preview = button.closest<HTMLElement>('[data-toast-example="positions"]');
  const list = document.querySelector<HTMLElement>("[data-toast-example-list]");
  const position = button.dataset.toastPosition as PositionId | undefined;
  if (!preview || !list || !position) return;

  if (activePosition.get(list) !== position) clearCurrentToasts(list);
  activePosition.set(list, position);
  list.dataset.position = position;

  for (const candidate of preview.querySelectorAll<HTMLElement>("[data-toast-position]")) {
    candidate.setAttribute("aria-pressed", String(candidate === button));
  }

  const edge = position.startsWith("top") ? "top" : "bottom";
  const label = button.textContent?.trim() || position;
  const dismiss = createToast({
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    duration: 5000,
    template: itemTemplate(label, edge),
  });
  dismissers.set(list, [dismiss, ...(dismissers.get(list) ?? [])]);
}

export function installToastExamples(document = window.document) {
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLElement>("[data-toast-position]");
    if (button) openToast(document, button);
  });
}
