const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatLaunchCost(cost: number | null): string {
  if (cost === null || !Number.isFinite(cost)) {
    return "Not disclosed";
  }
  return currencyFormatter.format(cost);
}

export function formatMaidenFlight(dateStr: string | null): string {
  if (!dateStr) {
    return "TBD / Unknown";
  }
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateStr;
  }
  return dateFormatter.format(parsed);
}

export function formatCountry(countryCode: string | null): string {
  return countryCode?.trim() || "Unknown";
}

export function formatDescription(description: string | null): string {
  return description?.trim() || "No description available.";
}
