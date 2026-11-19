export function displayDescription(value: string | null | undefined): string {
  const text = value?.trim();
  return text ? text : "No description";
}

export function displayValue(
  value: string | null | undefined,
  fallback = "N/A",
): string {
  const text = value?.trim();
  return text ? text : fallback;
}

export function formatLaunchCost(value: string | null | undefined): string {
  const text = value?.trim();
  if (!text) return "N/A";

  const numeric = Number(text.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return text;

  return numeric.toLocaleString("en-US");
}
