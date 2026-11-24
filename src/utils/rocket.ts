export const missingValue = "Belum tersedia";

export function displayText(
  value: string | null | undefined,
  fallback = missingValue,
): string {
  return value?.trim() || fallback;
}

export function safeImageUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function formatFirstFlight(value: string | null): string {
  if (!value || !validDate(value)) return missingValue;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatLaunchCost(value: string | number | null): string {
  if (value === null || (typeof value === "string" && !value.trim()))
    return missingValue;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return missingValue;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}
