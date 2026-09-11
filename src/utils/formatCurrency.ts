export function formatCurrency(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
