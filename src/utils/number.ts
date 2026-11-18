/**
 * Numbers from APIs often arrive as strings ("52000000") or as null.
 * Generic on purpose: it knows nothing about rockets.
 */
export function parseNullableNumber(value: string | null | undefined): number | null {
    if (!value) return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
}