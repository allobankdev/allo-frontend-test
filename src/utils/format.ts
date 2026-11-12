const NOT_AVAILABLE = "Not available";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * The API returns launch_cost as a plain numeric string (USD), while custom
 * rockets may contain free text such as "$90 million". Only numeric values
 * are reformatted; anything else is shown as typed.
 */
export function formatLaunchCost(value: string | null): string {
  const text = value?.trim();

  if (!text) {
    return NOT_AVAILABLE;
  }

  return /^\d+(\.\d+)?$/.test(text) ? usdFormatter.format(Number(text)) : text;
}

/** Formats an ISO date (YYYY-MM-DD) without timezone shifting. */
export function formatDate(value: string | null): string {
  const text = value?.trim();

  if (!text) {
    return NOT_AVAILABLE;
  }

  const date = new Date(`${text}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
