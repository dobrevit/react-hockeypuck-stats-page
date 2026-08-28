// Locale-aware rendering of the values in the stats document.

// Shown wherever the server reported no value, so an empty cell is still
// visibly a cell.
const PLACEHOLDER = "—";

function locale() {
  return navigator.language || "en-US";
}

export function formatNumber(number) {
  if (!Number.isFinite(number)) {
    return PLACEHOLDER;
  }
  return new Intl.NumberFormat(locale()).format(number);
}

// The parser hands components a Date or null; null means the server said
// this has never happened.
export function formatDateTime(date) {
  return date instanceof Date ? date.toLocaleString(locale()) : PLACEHOLDER;
}

export function formatDate(date) {
  return date instanceof Date ? date.toLocaleDateString(locale()) : PLACEHOLDER;
}

export function formatTime(date) {
  return date instanceof Date ? date.toLocaleTimeString(locale()) : PLACEHOLDER;
}

// Two timestamps belong to the same calendar day in the viewer's timezone.
export function isSameDay(a, b) {
  if (!(a instanceof Date) || !(b instanceof Date)) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
