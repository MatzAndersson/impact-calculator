export const formatCurrency = (value, currency = "USD") =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: currency || "USD", // fallback to USD if empty
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });