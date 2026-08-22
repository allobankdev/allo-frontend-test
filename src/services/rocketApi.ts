import type { Rocket } from '@/types/rocket'

const API_ROOT = 'https://lldev.thespacedevs.com/2.2.0/'
const REQUEST_TIMEOUT_MS = 10_000

function asRecord (value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : null
}

function nullableString (value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmedValue = value.trim()
    return trimmedValue || null
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return null
}

function imageUrl (value: unknown): string | null {
  const url = nullableString(value)
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
      ? parsedUrl.toString()
      : null
  } catch {
    return null
  }
}

function normalizeRocket (value: unknown): Rocket {
  const rocket = asRecord(value)
  if (!rocket || typeof rocket.id !== 'number' || !Number.isFinite(rocket.id)) {
    throw new Error('The rocket response has an invalid format.')
  }

  const manufacturer = asRecord(rocket.manufacturer)

  return {
    id: rocket.id,
    fullName: nullableString(rocket.full_name) ?? nullableString(rocket.name) ?? 'Unnamed rocket',
    description: nullableString(rocket.description),
    imageUrl: imageUrl(rocket.image_url),
    launchCost: nullableString(rocket.launch_cost),
    country: nullableString(manufacturer?.country_code),
    maidenFlight: nullableString(rocket.maiden_flight),
    source: 'api',
  }
}

async function requestJson (url: URL): Promise<unknown> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`The rocket service returned status ${response.status}.`)
    }

    return await response.json() as unknown
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The rocket service took too long to respond.')
    }

    throw error instanceof Error
      ? error
      : new Error('The rocket service could not be reached.')
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function getRockets (): Promise<Rocket[]> {
  const url = new URL('config/launcher/', API_ROOT)
  url.search = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    mode: 'detailed',
    limit: '20',
  }).toString()

  const payload = asRecord(await requestJson(url))
  if (!payload || !Array.isArray(payload.results)) {
    throw new Error('The rocket list response has an invalid format.')
  }

  return payload.results.map(normalizeRocket)
}

export async function getRocket (id: number): Promise<Rocket> {
  const url = new URL(`config/launcher/${id}/`, API_ROOT)
  return normalizeRocket(await requestJson(url))
}
