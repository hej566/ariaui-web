const installedDocuments = new WeakSet<Document>();

function previewFor(target: Element) {
  return target.closest<HTMLElement>(
    '[data-component="table"][data-example-variant="data-table"]',
  );
}

function visibleRows(preview: HTMLElement) {
  return Array.from(preview.querySelectorAll<HTMLElement>("[data-table-data-row]"))
    .filter((row) => !row.hidden);
}

function updateSelection(preview: HTMLElement) {
  const rows = Array.from(preview.querySelectorAll<HTMLElement>("[data-table-data-row]"));
  const visible = visibleRows(preview);
  const selectedCount = rows.filter((row) => row.getAttribute("aria-selected") === "true").length;
  const allVisibleSelected = visible.length > 0 && visible.every(
    (row) => row.getAttribute("aria-selected") === "true",
  );
  const selectAll = preview.querySelector<HTMLElement>("[data-table-select-all]");
  selectAll?.setAttribute("aria-pressed", String(allVisibleSelected));
  selectAll?.setAttribute("aria-checked", String(allVisibleSelected));

  const summary = preview.querySelector<HTMLElement>("[data-table-selection-summary]");
  if (summary) summary.textContent = `${selectedCount} of ${visible.length} row(s) selected.`;
}

function setRowSelected(row: HTMLElement, selected: boolean) {
  row.setAttribute("aria-selected", String(selected));
  row.toggleAttribute("data-selected", selected);
  const control = row.querySelector<HTMLElement>("[data-table-select-row]");
  control?.setAttribute("aria-pressed", String(selected));
  control?.setAttribute("aria-checked", String(selected));
}

function filterRows(preview: HTMLElement, value: string) {
  const query = value.trim().toLowerCase();
  for (const row of preview.querySelectorAll<HTMLElement>("[data-table-data-row]")) {
    row.hidden = !((row.dataset.email ?? "").toLowerCase().includes(query));
  }
  updateSelection(preview);
}

function toggleColumn(preview: HTMLElement, control: HTMLElement) {
  const column = control.dataset.tableColumnToggle;
  if (!column) return;
  const visible = control.getAttribute("aria-pressed") !== "true";
  control.setAttribute("aria-pressed", String(visible));
  control.toggleAttribute("data-active", visible);
  for (const cell of preview.querySelectorAll<HTMLElement>(`[data-column="${column}"]`)) {
    cell.hidden = !visible;
  }
}

function closeMenus(preview: HTMLElement, except?: HTMLElement) {
  for (const menu of preview.querySelectorAll<HTMLElement>("[data-table-menu]")) {
    if (menu !== except) {
      menu.hidden = true;
      menu.parentElement?.querySelector<HTMLElement>("[data-table-menu-trigger]")
        ?.setAttribute("aria-expanded", "false");
    }
  }
}

function rowMenuFor(trigger: HTMLElement) {
  let parent = trigger.parentElement;
  if (!parent) return null;
  const existing = parent.querySelector<HTMLElement>("[data-table-menu]");
  if (existing) return existing;

  if (!parent.classList.contains("ariaui-web-table-menu-root")) {
    const wrapper = trigger.ownerDocument.createElement("span");
    wrapper.className = "ariaui-web-table-menu-root";
    parent.insertBefore(wrapper, trigger);
    wrapper.append(trigger);
    parent = wrapper;
  }

  const menu = trigger.ownerDocument.createElement("span");
  menu.dataset.tableMenu = "";
  menu.className = "ariaui-web-table-menu ariaui-web-row-menu";
  menu.hidden = true;
  for (const label of ["Copy payment ID", "View customer", "View payment details"]) {
    const item = trigger.ownerDocument.createElement("button");
    item.type = "button";
    item.textContent = label;
    menu.append(item);
  }
  parent.append(menu);
  return menu;
}

export function installTableExamples(document = window.document) {
  if (installedDocuments.has(document)) return;
  installedDocuments.add(document);

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.matches("[data-table-filter]")) return;
    const preview = previewFor(target);
    if (preview) filterRows(preview, target.value);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const preview = previewFor(target);
    if (!preview) {
      for (const tablePreview of document.querySelectorAll<HTMLElement>(
        '[data-component="table"][data-example-variant="data-table"]',
      )) closeMenus(tablePreview);
      return;
    }

    const rowControl = target.closest<HTMLElement>("[data-table-select-row]");
    if (rowControl) {
      const row = rowControl.closest<HTMLElement>("[data-table-data-row]");
      if (row) setRowSelected(row, row.getAttribute("aria-selected") !== "true");
      updateSelection(preview);
      return;
    }

    if (target.closest("[data-table-select-all]")) {
      const rows = visibleRows(preview);
      const select = !rows.every((row) => row.getAttribute("aria-selected") === "true");
      for (const row of rows) setRowSelected(row, select);
      updateSelection(preview);
      return;
    }

    const columnControl = target.closest<HTMLElement>("[data-table-column-toggle]");
    if (columnControl) {
      toggleColumn(preview, columnControl);
      return;
    }

    const menuTrigger = target.closest<HTMLElement>("[data-table-menu-trigger]");
    if (menuTrigger) {
      const menu = rowMenuFor(menuTrigger);
      if (menu) {
        const willOpen = menu.hidden;
        closeMenus(preview, menu);
        menu.hidden = !willOpen;
        menuTrigger.setAttribute("aria-expanded", String(willOpen));
      }
      return;
    }

    closeMenus(preview);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const preview of document.querySelectorAll<HTMLElement>(
      '[data-component="table"][data-example-variant="data-table"]',
    )) closeMenus(preview);
  });
}
