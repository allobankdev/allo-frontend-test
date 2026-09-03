export const API_CONFIG = {
  BASE_URL: 'https://lldev.thespacedevs.com/2.2.0/config/launcher',
  DEFAULT_MANUFACTURER: 'SpaceX',
  DEFAULT_LIMIT: 20,
  DEFAULT_MODE: 'detailed',
  TIMEOUT_MS: 12000,
} as const

export const STORAGE_KEYS = {
  LOCAL_ROCKETS: 'allo_spacex_local_rockets',
} as const
