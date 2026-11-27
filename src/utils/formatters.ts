export function formatLaunchCost(cost: number | null | undefined): string {
    if (cost === null || cost === undefined || Number.isNaN(cost)) {
        return 'Not disclosed'
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(cost)
}

export function formatFlightDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return 'Unknown'
    }

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
        return dateString
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export function formatFallbackText(
    value: string | null | undefined,
    fallback = 'Not available',
): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : fallback
}