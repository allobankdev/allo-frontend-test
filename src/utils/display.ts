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
