export function formatUsd(amount: number): string {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate || "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat().format(value);
}

export function formatBool(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value ? "Yes" : "No";
}

export function formatLength(value: {
  meters: number | null;
  feet: number | null;
}): string {
  const m = value.meters ?? null;
  const ft = value.feet ?? null;
  if (m === null && ft === null) return "-";
  if (m === null) return `${formatNumber(ft)} ft`;
  if (ft === null) return `${formatNumber(m)} m`;
  return `${formatNumber(m)} m (${formatNumber(ft)} ft)`;
}

export function formatThrust(value: { kN: number; lbf: number }): string {
  return `${formatNumber(value.kN)} kN (${formatNumber(value.lbf)} lbf)`;
}
