import type { Rocket } from '../types/rocket'

const API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

function asObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function normalizeRocket(value: unknown): Rocket {
  const data = asObject(value)
  if ((typeof data.id !== 'number' && typeof data.id !== 'string') || String(data.id).trim() === '') {
    throw new Error('Data roket dari server tidak memiliki pengenal yang valid.')
  }
  const manufacturer = asObject(data.manufacturer)
  return {
    id: String(data.id),
    name: text(data.full_name) ?? 'Nama roket belum tersedia',
    description: text(data.description) ?? 'Deskripsi belum tersedia.',
    imageUrl: text(data.image_url),
    launchCost: typeof data.launch_cost === 'number' && Number.isFinite(data.launch_cost)
      ? String(data.launch_cost) : text(data.launch_cost),
    country: text(manufacturer.country_code),
    firstFlight: text(data.maiden_flight),
  }
}

async function request(url: string, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) controller.abort()
  const timer = setTimeout(abort, 15000)
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
    if (!response.ok) {
      if (response.status === 404) throw new Error('Roket tidak ditemukan.')
      if (response.status === 429) throw new Error('Batas permintaan tercapai. Tunggu sebentar lalu coba lagi.')
      throw new Error(`Data tidak dapat dimuat (HTTP ${response.status}). Silakan coba lagi.`)
    }
    return await response.json()
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new Error('Permintaan terlalu lama. Periksa koneksi lalu coba lagi.')
    }
    if (error instanceof TypeError) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.')
    }
    throw error
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

export async function fetchRockets(): Promise<Rocket[]> {
  const data = asObject(await request(`${API_BASE}?manufacturer__name=SpaceX&mode=detailed&limit=20`))
  if (!Array.isArray(data.results)) throw new Error('Format daftar roket dari server tidak valid.')
  return data.results.map(normalizeRocket)
}

export async function fetchRocket(id: string, signal: AbortSignal): Promise<Rocket> {
  const rocket = normalizeRocket(await request(`${API_BASE}${encodeURIComponent(id)}/`, signal))
  if (rocket.id !== id) throw new Error('Data roket dari server tidak sesuai dengan roket yang diminta.')
  return rocket
}
