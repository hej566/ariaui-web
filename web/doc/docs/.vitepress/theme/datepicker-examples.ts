const installedDatepickerExampleDocuments = new WeakSet<Document>();

export function syncDatepickerExamples(_doc: Document = document) {
  // Datepicker examples are positioned by the package runtime.
}

export function installDatepickerExamples(doc: Document = document) {
  if (installedDatepickerExampleDocuments.has(doc)) {
    return;
  }

  installedDatepickerExampleDocuments.add(doc);
  syncDatepickerExamples(doc);
}
