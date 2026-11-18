/**
 * Shared formatters. The API gives us raw strings/dates, the UI shows readable text.
 * Keeping them here means the components stay free of presentation branches.
 */
const costFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
})

export function formatCost(value: number | null): string {
    return value === null ? 'Not disclosed' : costFormatter.format(value)
}

export function formatFirstFlight(value: string | null): string {
    if (!value) return 'Not flown yet'
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? 'Unknown' : dateFormatter.format(parsed)
}

export function formatCountry(value: string | null): string {
    return value ?? 'Unknown'
}
