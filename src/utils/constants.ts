/**
 * Application-wide constants
 */

export const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
export const SPACEX_LAUNCHERS_ENDPOINT = `${API_BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`

/**
 * High quality space placeholder fallback when API image_url is missing or fails to load
 */
export const DEFAULT_ROCKET_IMAGE = 'https://images.unsplash.com/photo-1517976487545-d36c28f32a7a?auto=format&fit=crop&w=800&q=80'

export const DEFAULT_MANUFACTURER_COUNTRY = 'USA'

export const FILTER_STATUS_OPTIONS = [
  { title: 'All Rockets', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Retired / Inactive', value: 'retired' },
] as const
