const installedPortalExampleDocuments = new WeakSet<Document>();
const pendingPortalExampleDocuments = new WeakSet<Document>();

function schedulePortalExampleUpdate(doc: Document) {
  if (pendingPortalExampleDocuments.has(doc)) {
    return;
  }

  pendingPortalExampleDocuments.add(doc);
  requestAnimationFrame(() => {
    pendingPortalExampleDocuments.delete(doc);
    syncPortalExamples(doc);
  });
}

function syncPortalExamples(doc: Document) {
  const previews = Array.from(doc.querySelectorAll<HTMLElement>('.ariaui-web-preview[data-component="portal"]'));
  const cards = Array.from(doc.body.querySelectorAll<HTMLElement>(".ariaui-web-portal-card"));

  for (const card of cards) {
    const preview = previews.find((candidate) => {
      const root = candidate.querySelector("aria-portal");
      return root && !root.contains(card);
    }) ?? previews[0];
    const host = preview?.querySelector<HTMLElement>(".ariaui-web-portal-host");

    if (!host) {
      card.style.visibility = "hidden";
      continue;
    }

    const rect = host.getBoundingClientRect();
    const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!isVisible) {
      card.style.visibility = "hidden";
      continue;
    }

    const maxWidth = Math.min(Math.max(rect.width - 32, 180), 320);
    card.style.width = maxWidth + "px";
    card.style.left = Math.round(rect.left + (rect.width - maxWidth) / 2) + "px";
    card.style.top = Math.round(rect.top + (rect.height - card.offsetHeight) / 2) + "px";
    card.style.right = "auto";
    card.style.bottom = "auto";
    card.style.visibility = "visible";
  }
}

export function installPortalExamples(doc: Document = document) {
  if (installedPortalExampleDocuments.has(doc)) {
    return;
  }

  installedPortalExampleDocuments.add(doc);
  const schedule = () => schedulePortalExampleUpdate(doc);

  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true });
  new MutationObserver(schedule).observe(doc.body, {
    childList: true,
    subtree: true,
  });
  schedule();
}
