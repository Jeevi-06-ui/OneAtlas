export function buildTableActionInstruction(actionLabel: string, tableTitle: string) {
  const normalized = actionLabel.trim();
  if (/^add\b/i.test(normalized)) {
    const fieldName = normalized.replace(/^add\s+/i, "").trim() || "New Row";
    return `add column ${fieldName} to ${tableTitle} table`;
  }
  if (/^invite\b/i.test(normalized)) {
    return `add column Invitee to ${tableTitle} table`;
  }
  if (/^reorder\b/i.test(normalized)) {
    return `add column Reorder Note to ${tableTitle} table`;
  }
  if (/^assign\b/i.test(normalized)) {
    return `add column Assignee to ${tableTitle} table`;
  }
  if (/^approve\b/i.test(normalized)) {
    return `add column Approval Status to ${tableTitle} table`;
  }
  return `add column ${normalized} to ${tableTitle} table`;
}

export function buildCardActionInstruction(actionLabel: string, cardTitle: string) {
  const label = actionLabel.trim();
  if (/review|open|view/i.test(label)) {
    return `move ${cardTitle} to top`;
  }
  if (/share|export/i.test(label)) {
    return `update ${cardTitle} description to Shared with stakeholders`;
  }
  if (/edit|filter/i.test(label)) {
    return `update ${cardTitle} content to Filters updated just now`;
  }
  return `update ${cardTitle} content to ${label} completed`;
}

export function scrollToHash(href?: string) {
  if (!href?.startsWith("#")) {
    return false;
  }
  const targetId = href.slice(1);
  const element =
    document.getElementById(targetId) ??
    document.querySelector(`[id*="${targetId}" i]`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  return false;
}
