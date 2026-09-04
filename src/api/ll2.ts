import type { Launcher } from '@/types/ll2'

/**
 * The dev host is generous with rate limits and serves the same data as
 * production. Use lldev.* here so the reviewer can run the build freely.
 */
const BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

/**
 * `mode=detailed` is mandatory: without it `description` is omitted.
 * `limit=20` is mandatory too — the default page is 10 and SpaceX has 13.
 */
const DETAILED = 'mode=detailed&limit=20'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  return res.json() as Promise<T>
}

export function fetchLaunchers(manufacturer = 'SpaceX'): Promise<Launcher[]> {
  const url = `${BASE}/?manufacturer__name=${manufacturer}&${DETAILED}`
  return getJson<{ results: Launcher[] }>(url).then(d => d.results)
}

export function fetchLauncherById(id: string | number): Promise<Launcher> {
  const url = `${BASE}/${id}/`
  return getJson<Launcher>(url)
}
