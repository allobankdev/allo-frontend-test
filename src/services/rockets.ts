import type { Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The rocket service returned an unexpected response. Please try again.')
  }
  return value as Record<string, unknown>
}

function text(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  return value.trim()
}

export function imageUrl(value: unknown): string | null {
  const url = text(value)
  if (!url) return null
  try {
    const parsed = new URL(url)
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : null
  } catch {
    return null
  }
}

function normalize(value: unknown): Rocket {
  const item = record(value)
  if (typeof item.id !== 'number' && typeof item.id !== 'string') {
    throw new Error('The rocket service returned an item without an ID.')
  }
  const manufacturer = item.manufacturer ? record(item.manufacturer) : {}
  const cost = item.launch_cost
  return {
    id: String(item.id),
    name: text(item.full_name) ?? text(item.name) ?? 'Unnamed rocket',
    description: text(item.description) ?? 'A description is not available for this rocket.',
    imageUrl: imageUrl(item.image_url),
    cost: typeof cost === 'number' ? String(cost) : text(cost),
    country: text(manufacturer.country_code),
    firstFlight: text(item.maiden_flight),
    family: text(item.family),
  }
}

async function request(url: string): Promise<unknown> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      if (response.status === 404) throw new Error('This rocket could not be found.')
      if (response.status === 429) throw new Error('The rocket service is busy. Wait a moment, then try again.')
      throw new Error('We could not load the rockets. Please try again.')
    }
    return await response.json()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The rocket service took too long to respond. Please try again.')
    }
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the rocket service. Check your connection and try again.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function fetchRockets(): Promise<Rocket[]> {
  const response = record(await request(BASE_URL + '?manufacturer__name=SpaceX&mode=detailed&limit=20'))
  if (!Array.isArray(response.results)) throw new Error('The rocket list could not be read. Please try again.')
  return response.results.map(normalize)
}

export async function fetchRocket(id: string): Promise<Rocket> {
  return normalize(await request(BASE_URL + encodeURIComponent(id) + '/?mode=detailed'))
}
