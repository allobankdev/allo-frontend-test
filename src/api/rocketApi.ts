import type { LauncherApiResponse, LauncherConfigApi, Rocket } from '@/types/rocket'
import { API_BASE_URL, SPACEX_LAUNCHERS_ENDPOINT } from '@/utils/constants'
import { normalizeRocket } from '@/utils/formatters'

/**
 * Service to communicate with Launch Library 2 API
 */
export const rocketApi = {
  /**
   * Fetches all SpaceX rockets using the detailed mode
   */
  async fetchSpaceXRockets (): Promise<Rocket[]> {
    const response = await fetch(SPACEX_LAUNCHERS_ENDPOINT, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorMsg = response.status === 429
        ? 'Rate limit exceeded (15 req/hour for anonymous users). Please try again in a moment.'
        : `Failed to fetch rockets (HTTP ${response.status}: ${response.statusText})`
      throw new Error(errorMsg)
    }

    const data: LauncherApiResponse = await response.json()
    return data.results.map(normalizeRocket)
  },

  /**
   * Fetches detailed data for a specific rocket by ID
   */
  async fetchRocketById (id: string | number): Promise<Rocket> {
    const response = await fetch(`${API_BASE_URL}/config/launcher/${id}/`, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Rocket with ID #${id} not found in the Launch Library database.`)
      }
      const errorMsg = response.status === 429
        ? 'Rate limit exceeded. Please wait a few moments before retrying.'
        : `Failed to fetch rocket detail (HTTP ${response.status})`
      throw new Error(errorMsg)
    }

    const data: LauncherConfigApi = await response.json()
    return normalizeRocket(data)
  },
}
