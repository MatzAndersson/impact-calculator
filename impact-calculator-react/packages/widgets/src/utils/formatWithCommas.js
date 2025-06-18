export function formatWithCommas(strOrNum) {
  if (strOrNum === "" || strOrNum === null) return "";
  // Remove any existing commas, then add them
  return strOrNum.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}