import type { LauncherApi, Rocket } from '@/types/rocket'

function toDisplayCost (cost: LauncherApi['launch_cost']): string | null {
  if (cost === null || cost === undefined || cost === '') return null

  const numericCost = Number(cost)
  if (!Number.isFinite(numericCost)) return String(cost)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericCost)
}

function toDisplayDate (date: string | null | undefined): string | null {
  if (!date) return null

  const parsedDate = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

export function normalizeRocket (launcher: LauncherApi): Rocket {
  return {
    id: String(launcher.id),
    source: 'api',
    name: launcher.full_name || launcher.name || 'Unnamed rocket',
    description: launcher.description || 'No description was provided by the launch provider.',
    imageUrl: launcher.image_url || null,
    launchCost: toDisplayCost(launcher.launch_cost),
    country: launcher.manufacturer?.country_code || null,
    firstFlight: toDisplayDate(launcher.maiden_flight),
  }
}
