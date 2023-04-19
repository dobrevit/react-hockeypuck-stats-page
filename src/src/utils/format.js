// This file is used to format numbers and dates
export function formatNumber(number) {
  const userLocale = navigator.language || "en-US";
  return new Intl.NumberFormat(userLocale).format(number);
}
