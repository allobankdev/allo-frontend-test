export function formatCurrency(value: string | null): string {
  if (!value) return "N/A";

  const number = Number(value);
  if (isNaN(number)) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}
