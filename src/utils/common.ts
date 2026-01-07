// Utility functions for formatting cost and date
export function formatCostUSD(value: number): string {
  if (!value || value <= 0) return "$0";

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${value.toLocaleString()}`;
}

// Utility function for formatting dates
export function formatDate(date: string | Date, locale = "en-US"): string {
  if (!date) return "";

  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
