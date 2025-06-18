export function decimalLimiter(str, decimals = 2, maxDigits = 9) {
  str = str.replace(/[^0-9.]/g, "");
  const [intPart, decPart] = str.split(".");
  const limitedInt = intPart ? intPart.slice(0, maxDigits) : "";
  if (decPart !== undefined) {
    return limitedInt + "." + decPart.slice(0, decimals);
  }
  return limitedInt;
}