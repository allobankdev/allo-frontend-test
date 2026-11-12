import type { LauncherConfigDto, PaginatedResponseDto } from '@/types/launchLibrary'
import type { Rocket } from '@/types/rocket'
import { mapLauncherToRocket } from './rocketMapper'

/** Base URL Launch Library 2 v2.2.0, memakai host dev `lldev` yang limitnya longgar. */
export const LL2_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

/**
 * Query list rocket SpaceX. `mode=detailed` wajib agar `description` ikut,
 * `limit=20` wajib agar ke-13 rocket datang dalam satu halaman.
 */
const ROCKET_LIST_QUERY = new URLSearchParams({
  manufacturer__name: 'SpaceX',
  mode: 'detailed',
  limit: '20',
})

/** Error saat API membalas dengan status HTTP selain 2xx. */
export class ApiError extends Error {
  readonly status: number

  constructor (status: number) {
    super(`Permintaan ke API gagal (HTTP ${status})`)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Mengambil JSON dari URL dan melempar `ApiError` jika status bukan 2xx. */
async function getJson<T> (url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new ApiError(response.status)
  return response.json() as Promise<T>
}

/**
 * Mengambil semua rocket SpaceX dalam satu request.
 *
 * @param signal - Opsional, untuk membatalkan request.
 * @returns Daftar rocket yang sudah dipetakan.
 * @throws {ApiError} Jika API membalas status error.
 */
export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const url = `${LL2_BASE_URL}/config/launcher/?${ROCKET_LIST_QUERY}`
  const data = await getJson<PaginatedResponseDto<LauncherConfigDto>>(url, signal)
  return data.results.map(mapLauncherToRocket)
}

/**
 * Mengambil detail satu rocket berdasarkan id.
 *
 * @param id - Id launcher dari API.
 * @param signal - Opsional, untuk membatalkan request.
 * @returns Rocket yang sudah dipetakan.
 * @throws {ApiError} Jika API membalas status error, misalnya 404.
 */
export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const url = `${LL2_BASE_URL}/config/launcher/${encodeURIComponent(id)}/`
  const data = await getJson<LauncherConfigDto>(url, signal)
  return mapLauncherToRocket(data)
}
